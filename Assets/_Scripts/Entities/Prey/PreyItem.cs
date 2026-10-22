using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;
using KillerWhale.Managers;

namespace KillerWhale.Entities.Prey
{
    /// <summary>
    /// 필드에 생성되는 50종 전용 먹이 아이콘 동작 및 흡입 처리
    /// </summary>
    [RequireComponent(typeof(CircleCollider2D))]
    public class PreyItem : MonoBehaviour, IPoolable
    {
        [Header("Prey Configuration")]
        [SerializeField] private string preyId;
        [SerializeField] private string preyNameKo;
        [SerializeField] private int scoreValue = 100;
        [SerializeField] private bool isRare = false;
        [SerializeField] private CharacterType ownerCharacter;

        [Header("Visual Components")]
        [SerializeField] private SpriteRenderer iconRenderer;
        [SerializeField] private ParticleSystem pickupParticle;

        private CircleCollider2D circleCol;
        private bool isCollected = false;
        private bool isAttracted = false;
        private Vector3 targetPos;
        private float attractSpeed = 10f;
        private float floatTimer = 0f;
        private Vector3 spawnOffset;

        public bool IsCollected => isCollected;
        public string PreyId => preyId;
        public string PreyNameKo => preyNameKo;
        public int ScoreValue => scoreValue;

        private void Awake()
        {
            circleCol = GetComponent<CircleCollider2D>();
            circleCol.isTrigger = true;
            if (iconRenderer == null) iconRenderer = GetComponentInChildren<SpriteRenderer>();
        }

        public void Setup(string id, string nameKo, int score, bool rare, CharacterType owner, Sprite icon = null)
        {
            preyId = id;
            preyNameKo = nameKo;
            scoreValue = score;
            isRare = rare;
            ownerCharacter = owner;

            if (icon != null && iconRenderer != null)
            {
                iconRenderer.sprite = icon;
            }

            if (isRare && iconRenderer != null)
            {
                iconRenderer.color = new Color(1f, 0.9f, 0.4f, 1f); // 황금빛 희귀 먹이
            }
            else if (iconRenderer != null)
            {
                iconRenderer.color = Color.white;
            }
        }

        private void Update()
        {
            if (isCollected) return;

            // 1. 자력 흡입 중일 때 플레이어로 가속 이동
            if (isAttracted)
            {
                transform.position = Vector3.MoveTowards(transform.position, targetPos, attractSpeed * Time.deltaTime);
                attractSpeed += 25f * Time.deltaTime; // 점점 빨라지는 흡입
                return;
            }

            // 2. 자연스러운 수중 부유 (Floating Wave)
            floatTimer += Time.deltaTime * 3f;
            transform.position += new Vector3(0f, Mathf.Sin(floatTimer) * 0.003f, 0f);

            // 화면 왼쪽 밖으로 나가면 풀로 반환
            if (transform.position.x < -14f)
            {
                ReturnToPool();
            }
        }

        public void AttractToward(Vector3 playerPos, float speed)
        {
            if (isCollected) return;
            isAttracted = true;
            targetPos = playerPos;
            attractSpeed = Mathf.Max(attractSpeed, speed);
        }

        public void Collect()
        {
            if (isCollected) return;
            isCollected = true;

            // 점수 및 콤보 반영
            ScoreManager.Instance?.AddPreyScore(scoreValue, isRare, preyId);

            // 도감 기록
            SaveSystem.Data.CollectPrey(preyId);

            if (pickupParticle != null)
            {
                pickupParticle.Play();
            }

            ReturnToPool();
        }

        public void OnSpawnFromPool()
        {
            isCollected = false;
            isAttracted = false;
            attractSpeed = 10f;
            floatTimer = Random.Range(0f, 6.28f);
            if (circleCol != null) circleCol.enabled = true;
            if (iconRenderer != null) iconRenderer.enabled = true;
        }

        public void OnReturnToPool()
        {
            isCollected = true;
            isAttracted = false;
            if (circleCol != null) circleCol.enabled = false;
        }

        private void ReturnToPool()
        {
            if (ObjectPool.Instance != null)
            {
                ObjectPool.Instance.Despawn("PreyItem", gameObject);
            }
            else
            {
                gameObject.SetActive(false);
            }
        }
    }
}
