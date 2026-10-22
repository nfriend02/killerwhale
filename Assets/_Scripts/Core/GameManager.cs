using System;
using System.Text;
using UnityEngine;
using KillerWhale.Managers;

namespace KillerWhale.Core
{
    /// <summary>
    /// 게임 전체 루프와 라이프사이클을 통괄하는 마스터 싱글톤 관리자
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Runtime State")]
        [SerializeField] private GameState currentState = GameState.Boot;
        public GameState CurrentState => currentState;

        [Header("Configuration")]
        [SerializeField] private int targetFrameRate = 60;

        // 라이프사이클 이벤트
        public event Action<GameState> OnStateChanged;
        public event Action<int, int> OnLivesChanged; // (currentLives, maxLives)
        public event Action<int> OnStageProgressChanged; // progress percentage (0 ~ 100)
        public event Action OnStageClearEvent;
        public event Action OnGameOverEvent;

        // 인게임 런타임 값
        public int MaxLives { get; private set; } = 3;
        public int CurrentLives { get; private set; } = 3;
        public CharacterType SelectedCharacter { get; set; } = CharacterType.KillerWhale;
        public StageIndex CurrentStage { get; set; } = StageIndex.Stage1_Pacific;
        public bool IsInvincible { get; private set; } = false;

        private float invincibilityTimer = 0f;
        private const float INVINCIBILITY_DURATION = 1.5f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            // 모바일 60fps 최적화 및 화면 꺼짐 방지 (기획서 15절 준수)
            Application.targetFrameRate = targetFrameRate;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;

            SaveSystem.Load();
            ApplySettingsFromSave();
        }

        private void Start()
        {
            if (!SaveSystem.Data.introSeen)
            {
                ChangeState(GameState.Intro);
            }
            else
            {
                ChangeState(GameState.Title);
            }
        }

        private void Update()
        {
            // 무적 타이머 처리
            if (IsInvincible)
            {
                invincibilityTimer -= Time.deltaTime;
                if (invincibilityTimer <= 0f)
                {
                    IsInvincible = false;
                }
            }
        }

        public void ApplySettingsFromSave()
        {
            MaxLives = Mathf.Clamp(SaveSystem.Data.selectedLives, 3, 6);
            CurrentLives = MaxLives;

            if (Enum.TryParse(SaveSystem.Data.selectedCharacter, out CharacterType charType))
            {
                SelectedCharacter = charType;
            }
        }

        public void ChangeState(GameState newState)
        {
            if (currentState == newState) return;

            currentState = newState;
            Debug.Log($"[GameManager] GameState transitioned to: {newState}");

            switch (newState)
            {
                case GameState.Boot:
                    Time.timeScale = 1f;
                    break;
                case GameState.Intro:
                    Time.timeScale = 1f;
                    break;
                case GameState.Title:
                    Time.timeScale = 1f;
                    break;
                case GameState.Playing:
                    Time.timeScale = 1f;
                    break;
                case GameState.Paused:
                    Time.timeScale = 0f;
                    break;
                case GameState.StageClear:
                    Time.timeScale = 1f;
                    OnStageClearEvent?.Invoke();
                    break;
                case GameState.GameOver:
                    Time.timeScale = 1f;
                    OnGameOverEvent?.Invoke();
                    break;
            }

            OnStateChanged?.Invoke(currentState);
        }

        public void StartStage(StageIndex stage)
        {
            CurrentStage = stage;
            CurrentLives = MaxLives;
            IsInvincible = false;
            invincibilityTimer = 0f;

            OnLivesChanged?.Invoke(CurrentLives, MaxLives);
            ChangeState(GameState.Playing);
        }

        public void RestartCurrentStage()
        {
            StartStage(CurrentStage);
        }

        public void NextStage()
        {
            int next = (int)CurrentStage + 1;
            if (next <= 5)
            {
                StartStage((StageIndex)next);
            }
            else
            {
                ChangeState(GameState.Ending);
            }
        }

        public void TakeDamage(int amount = 1)
        {
            if (currentState != GameState.Playing) return;
            if (IsInvincible) return;

            CurrentLives -= amount;
            IsInvincible = true;
            invincibilityTimer = INVINCIBILITY_DURATION;

            // 콤보 리셋
            ScoreManager.Instance?.BreakCombo();

            // 오디오 및 피격 연출
            AudioManager.Instance?.PlaySfx(AudioClipType.HitThud);
            AudioManager.Instance?.TriggerHaptic();

            OnLivesChanged?.Invoke(CurrentLives, MaxLives);

            if (CurrentLives <= 0)
            {
                CurrentLives = 0;
                ChangeState(GameState.GameOver);
            }
        }

        public void TriggerTemporaryInvincibility(float duration)
        {
            IsInvincible = true;
            invincibilityTimer = Mathf.Max(invincibilityTimer, duration);
        }

        public void TogglePause()
        {
            if (currentState == GameState.Playing)
            {
                ChangeState(GameState.Paused);
            }
            else if (currentState == GameState.Paused)
            {
                ChangeState(GameState.Playing);
            }
        }

        public void UpdateStageProgress(float normalized)
        {
            int percent = Mathf.Clamp(Mathf.RoundToInt(normalized * 100f), 0, 100);
            OnStageProgressChanged?.Invoke(percent);
            if (percent >= 100 && currentState == GameState.Playing)
            {
                ChangeState(GameState.StageClear);
            }
        }
    }
}
