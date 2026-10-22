using System;
using System.Collections.Generic;
using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;
using KillerWhale.Entities.Boss;
using KillerWhale.Entities.Hazards;
using KillerWhale.Entities.Prey;

namespace KillerWhale.Managers
{
    /// <summary>
    /// Object Pool 기반 먹이 및 장애물 패턴 생성기 (기획서 4.2절 & 5절)
    /// </summary>
    public class SpawnManager : MonoBehaviour
    {
        public static SpawnManager Instance { get; private set; }

        [Header("Spawn Intervals (seconds)")]
        [SerializeField] private float preySpawnInterval = 0.8f;
        [SerializeField] private float hazardSpawnInterval = 1.2f;

        [Header("Prefabs & Fallback")]
        [SerializeField] private GameObject preyPrefab;
        [SerializeField] private GameObject hazardRockPrefab;
        [SerializeField] private GameObject hazardNetPrefab;
        [SerializeField] private GameObject hazardSubmarinePrefab;
        [SerializeField] private GameObject hazardTorpedoPrefab;

        private float preyTimer = 0f;
        private float hazardTimer = 0f;
        private List<PreyInfo> currentDedicatedPreyList;
        private readonly List<HazardBase> activeHazards = new List<HazardBase>();

        // 범고래 초음파 경고 이벤트
        public event Action<Vector3> OnHazardApproachingWarning;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged += HandleStateChanged;
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged -= HandleStateChanged;
            }
        }

        private void HandleStateChanged(GameState state)
        {
            if (state == GameState.Playing)
            {
                // 현재 캐릭터의 전용 먹이 10종 리스트 추출
                FilterDedicatedPrey(GameManager.Instance.SelectedCharacter);
                preyTimer = 0f;
                hazardTimer = 0f;
            }
        }

        private void FilterDedicatedPrey(CharacterType character)
        {
            var all = PreyData.GetAllPreyDefinitions();
            currentDedicatedPreyList = new List<PreyInfo>();
            for (int i = 0; i < all.Count; i++)
            {
                if (all[i].character == character)
                {
                    currentDedicatedPreyList.Add(all[i]);
                }
            }
        }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing) return;

            float dt = Time.deltaTime;
            preyTimer += dt;
            hazardTimer += dt;

            // 1. 먹이 주기적 생성
            if (preyTimer >= preySpawnInterval)
            {
                preyTimer = 0f;
                SpawnRandomPrey();
            }

            // 2. 장애물 주기적 생성
            if (hazardTimer >= hazardSpawnInterval)
            {
                hazardTimer = 0f;
                SpawnRandomHazard();
            }
        }

        private void SpawnRandomPrey()
        {
            if (currentDedicatedPreyList == null || currentDedicatedPreyList.Count == 0) return;

            int randomIndex = UnityEngine.Random.Range(0, currentDedicatedPreyList.Count);
            PreyInfo info = currentDedicatedPreyList[randomIndex];

            Vector3 spawnPos = new Vector3(10f, UnityEngine.Random.Range(-3.8f, 3.8f), 0f);

            GameObject obj = null;
            if (ObjectPool.Instance != null)
            {
                obj = ObjectPool.Instance.Spawn("PreyItem", spawnPos, Quaternion.identity);
            }

            if (obj == null && preyPrefab != null)
            {
                obj = Instantiate(preyPrefab, spawnPos, Quaternion.identity);
            }

            if (obj != null)
            {
                var preyComp = obj.GetComponent<PreyItem>();
                if (preyComp != null)
                {
                    preyComp.Setup(info.id, info.nameKo, info.score, info.isRare, info.character);
                }
            }
        }

        private void SpawnRandomHazard()
        {
            float randY = UnityEngine.Random.Range(-3.5f, 3.5f);
            Vector3 spawnPos = new Vector3(11f, randY, 0f);

            // 범고래 패시브 Echolocation: 위험 등장 1.5초 전 경고 신호 브로드캐스팅
            if (GameManager.Instance != null && GameManager.Instance.SelectedCharacter == CharacterType.KillerWhale)
            {
                OnHazardApproachingWarning?.Invoke(spawnPos);
            }

            HazardKind kind = (HazardKind)UnityEngine.Random.Range(0, 4);
            SpawnHazardAt(kind, spawnPos);
        }

        public void SpawnHazardAt(HazardKind kind, Vector3 position)
        {
            string poolKey = kind.ToString();
            GameObject obj = null;

            if (ObjectPool.Instance != null)
            {
                obj = ObjectPool.Instance.Spawn(poolKey, position, Quaternion.identity);
            }

            if (obj == null)
            {
                // 폴백 프리팹
                GameObject prefab = hazardRockPrefab;
                switch (kind)
                {
                    case HazardKind.Net: prefab = hazardNetPrefab; break;
                    case HazardKind.Submarine: prefab = hazardSubmarinePrefab; break;
                    case HazardKind.Torpedo: prefab = hazardTorpedoPrefab; break;
                }

                if (prefab != null)
                {
                    obj = Instantiate(prefab, position, Quaternion.identity);
                }
            }

            if (obj != null)
            {
                var hazardComp = obj.GetComponent<HazardBase>();
                if (hazardComp != null && !activeHazards.Contains(hazardComp))
                {
                    activeHazards.Add(hazardComp);
                }
            }
        }

        public void TriggerFeedingFrenzy()
        {
            // Stage 1 피딩 프렌지: 대량의 정어리 떼 연속 스폰
            for (int i = 0; i < 15; i++)
            {
                float offsetX = UnityEngine.Random.Range(8f, 16f);
                float offsetY = UnityEngine.Random.Range(-3.5f, 3.5f);
                Vector3 pos = new Vector3(offsetX, offsetY, 0f);
                SpawnPreyAt(pos, "kw_10", "정어리 떼", 100, false);
            }
        }

        private void SpawnPreyAt(Vector3 pos, string id, string nameKo, int score, bool rare)
        {
            GameObject obj = null;
            if (ObjectPool.Instance != null)
            {
                obj = ObjectPool.Instance.Spawn("PreyItem", pos, Quaternion.identity);
            }
            if (obj != null)
            {
                var p = obj.GetComponent<PreyItem>();
                p?.Setup(id, nameKo, score, rare, CharacterType.KillerWhale);
            }
        }

        public void SlowDownAllHazards(float duration, float multiplier)
        {
            for (int i = activeHazards.Count - 1; i >= 0; i--)
            {
                if (activeHazards[i] != null && activeHazards[i].gameObject.activeInHierarchy)
                {
                    activeHazards[i].ApplySlow(duration, multiplier);
                }
                else
                {
                    activeHazards.RemoveAt(i);
                }
            }
        }

        public void SpawnBoss(StageIndex stage)
        {
            // 스테이지별 보스 스폰 위치
            Vector3 bossPos = new Vector3(7.0f, 0f, 0f);
            Debug.Log($"[SpawnManager] Spawning Boss for {stage} at {bossPos}");
        }
    }
}
