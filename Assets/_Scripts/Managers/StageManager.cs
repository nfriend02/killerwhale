using System;
using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;
using KillerWhale.Entities.Boss;

namespace KillerWhale.Managers
{
    /// <summary>
    /// 5개 스테이지 진행률, 3단 파라락스 배경 스크롤 및 환경 특수 이벤트 제어 (기획서 4.3절)
    /// </summary>
    public class StageManager : MonoBehaviour
    {
        public static StageManager Instance { get; private set; }

        [Header("Current Stage Configuration")]
        [SerializeField] private StageData currentStageData;
        public StageData CurrentStageData => currentStageData;

        [Header("Parallax Layers")]
        [SerializeField] private Transform parallaxFar;
        [SerializeField] private Transform parallaxMid;
        [SerializeField] private Transform parallaxClose;

        [SerializeField] private float speedFar = 0.5f;
        [SerializeField] private float speedMid = 1.0f;
        [SerializeField] private float speedClose = 1.8f;

        [Header("Progress Tracking")]
        [SerializeField] private float currentProgressDistance = 0f;
        [SerializeField] private float totalStageDistance = 12000f;
        [SerializeField] private bool isBossActive = false;
        [SerializeField] private bool isSpecialEventActive = false;

        private float stageTimer = 0f;
        private BossBase activeBoss;

        public event Action<StageEventType> OnSpecialEventStarted;
        public event Action<StageEventType> OnSpecialEventEnded;
        public event Action<string> OnBossSpawned;

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
                InitializeStage(GameManager.Instance.CurrentStage);
            }
        }

        public void InitializeStage(StageIndex stageIndex)
        {
            currentStageData = StageData.CreateDefault(stageIndex);
            currentProgressDistance = 0f;
            stageTimer = 0f;
            isBossActive = false;
            isSpecialEventActive = false;

            // 카메라 배경 색상 및 톤앤매너 적용
            if (Camera.main != null)
            {
                Camera.main.backgroundColor = currentStageData.primaryColor;
            }

            // BGM 전환
            AudioManager.Instance?.PlayBgmForStage(stageIndex);
        }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing) return;

            float dt = Time.deltaTime;
            stageTimer += dt;

            // 보스전 중에는 배경 스크롤 정지/감속
            if (!isBossActive)
            {
                float scrollStep = currentStageData != null ? currentStageData.scrollSpeed : 200f;

                // 특수 이벤트 급류 구간 속도 2배 가속
                if (currentStageData != null && currentStageData.specialEvent == StageEventType.CurrentRush && isSpecialEventActive)
                {
                    scrollStep *= 2.0f;
                }

                currentProgressDistance += scrollStep * dt;

                // 파라락스 스크롤 이동
                ScrollParallax(scrollStep * dt);

                // 진행률 업데이트 (0.0 ~ 1.0)
                float normalized = Mathf.Clamp01(currentProgressDistance / totalStageDistance);
                GameManager.Instance.UpdateStageProgress(normalized);

                // 1. 특수 환경 이벤트 검사 (50% 지점)
                if (!isSpecialEventActive && normalized >= 0.50f && normalized < 0.80f)
                {
                    TriggerSpecialEvent();
                }
                else if (isSpecialEventActive && normalized >= 0.75f)
                {
                    EndSpecialEvent();
                }

                // 2. 보스전 인카운터 검사 (85% 지점)
                if (normalized >= 0.85f && !isBossActive)
                {
                    TriggerBossEncounter();
                }
            }
        }

        private void ScrollParallax(float delta)
        {
            if (parallaxFar != null) parallaxFar.position += Vector3.left * (delta * speedFar * 0.01f);
            if (parallaxMid != null) parallaxMid.position += Vector3.left * (delta * speedMid * 0.01f);
            if (parallaxClose != null) parallaxClose.position += Vector3.left * (delta * speedClose * 0.01f);
        }

        private void TriggerSpecialEvent()
        {
            if (currentStageData == null) return;
            isSpecialEventActive = true;
            Debug.Log($"[StageManager] Special Event Triggered: {currentStageData.specialEvent}");
            OnSpecialEventStarted?.Invoke(currentStageData.specialEvent);

            if (currentStageData.specialEvent == StageEventType.FeedingFrenzy)
            {
                SpawnManager.Instance?.TriggerFeedingFrenzy();
            }
        }

        private void EndSpecialEvent()
        {
            if (currentStageData == null) return;
            isSpecialEventActive = false;
            OnSpecialEventEnded?.Invoke(currentStageData.specialEvent);
        }

        private void TriggerBossEncounter()
        {
            isBossActive = true;
            Debug.Log($"[StageManager] Boss Encounter: {currentStageData.bossNameKo}");
            OnBossSpawned?.Invoke(currentStageData.bossNameKo);

            // 보스 생성
            SpawnManager.Instance?.SpawnBoss(GameManager.Instance.CurrentStage);
        }

        public void NotifyBossDefeated()
        {
            isBossActive = false;
            // 100% 도달
            GameManager.Instance.UpdateStageProgress(1.0f);
        }
    }
}
