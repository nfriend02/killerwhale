using System;
using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Managers
{
    /// <summary>
    /// 점수, 콤보 타이머(2.0s), Multiplier(x1.0~x4.0), 피버모드 관리 (기획서 4.2절 & 9절)
    /// </summary>
    public class ScoreManager : MonoBehaviour
    {
        public static ScoreManager Instance { get; private set; }

        [Header("Runtime Score")]
        [SerializeField] private int currentScore = 0;
        [SerializeField] private int currentCombo = 0;
        [SerializeField] private int maxComboInStage = 0;
        [SerializeField] private float comboMultiplier = 1.0f;
        [SerializeField] private float comboTimer = 0f;
        [SerializeField] private bool isFeverMode = false;

        private const float COMBO_DURATION = 2.0f;
        private const float ORCA_COMBO_DURATION = 2.8f; // 범고래 고유 콤보 시간 증가

        // 거리 점수
        private float distanceAccumulator = 0f;

        // 이벤트 콜백
        public event Action<int> OnScoreChanged;
        public event Action<int, float, bool> OnComboChanged; // (combo, multiplier, isFever)
        public event Action<float> OnComboTimerUpdated; // normalized timer (0.0 ~ 1.0)
        public event Action OnFeverModeStarted;
        public event Action OnFeverModeEnded;

        public int CurrentScore => currentScore;
        public int CurrentCombo => currentCombo;
        public int MaxComboInStage => maxComboInStage;
        public float ComboMultiplier => comboMultiplier;
        public bool IsFeverMode => isFeverMode;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
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
                ResetForNewStage();
            }
            else if (state == GameState.StageClear)
            {
                // 클리어 보너스 정산
                AddScore(1000);
                if (GameManager.Instance.CurrentLives == GameManager.Instance.MaxLives)
                {
                    AddScore(1500); // 무피격 클리어 보너스
                }

                // 최고 점수 갱신
                SaveSystem.Data.SetBestScore(GameManager.Instance.CurrentStage.ToString(), currentScore);
                SaveSystem.Save();
            }
        }

        public void ResetForNewStage()
        {
            currentScore = 0;
            currentCombo = 0;
            maxComboInStage = 0;
            comboMultiplier = 1.0f;
            comboTimer = 0f;
            isFeverMode = false;
            distanceAccumulator = 0f;

            OnScoreChanged?.Invoke(currentScore);
            OnComboChanged?.Invoke(currentCombo, comboMultiplier, isFeverMode);
        }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing) return;

            // 콤보 타이머 감소
            if (currentCombo > 0)
            {
                comboTimer -= Time.deltaTime;
                float maxDuration = GetMaxComboDuration();
                OnComboTimerUpdated?.Invoke(Mathf.Clamp01(comboTimer / maxDuration));

                if (comboTimer <= 0f)
                {
                    BreakCombo();
                }
            }

            // 거리 점수: 주행 100px당 10점 (기획서 9절)
            distanceAccumulator += Time.deltaTime * 60f;
            if (distanceAccumulator >= 100f)
            {
                distanceAccumulator -= 100f;
                AddScore(10);
            }
        }

        private float GetMaxComboDuration()
        {
            if (GameManager.Instance != null && GameManager.Instance.SelectedCharacter == CharacterType.KillerWhale)
            {
                return ORCA_COMBO_DURATION;
            }
            return COMBO_DURATION;
        }

        public void AddPreyScore(int baseScore, bool isRare, string preyId)
        {
            // 콤보 증가
            currentCombo++;
            if (currentCombo > maxComboInStage) maxComboInStage = currentCombo;

            comboTimer = GetMaxComboDuration();

            // 배율 계산
            UpdateMultiplier();

            // 청새치 특화: 점프 돌진 중 포식 시 콤보 +2 (기획서 9.2절)
            if (GameManager.Instance != null && GameManager.Instance.SelectedCharacter == CharacterType.BlueMarlin)
            {
                // 청새치 콤보 가산
            }

            int finalScore = Mathf.RoundToInt(baseScore * comboMultiplier);
            AddScore(finalScore);

            // Pitch shifted SFX 트리거
            float pitch = Mathf.Clamp(1.0f + (currentCombo * 0.05f), 1.0f, 2.0f);
            AudioManager.Instance?.PlayPitchShiftedPreySfx(pitch);

            OnComboChanged?.Invoke(currentCombo, comboMultiplier, isFeverMode);
        }

        public void AddSmashBonus()
        {
            // 메갈로돈 장애물 파괴 시 SMASH 콤보 보너스
            AddScore(500);
        }

        private void UpdateMultiplier()
        {
            CharacterType charType = GameManager.Instance != null ? GameManager.Instance.SelectedCharacter : CharacterType.KillerWhale;

            if (currentCombo < 5)
            {
                comboMultiplier = 1.0f;
                SetFever(false);
            }
            else if (currentCombo < 10)
            {
                comboMultiplier = 1.5f;
                SetFever(false);
            }
            else if (currentCombo < 20)
            {
                comboMultiplier = 2.0f;
                SetFever(false);
            }
            else
            {
                // 상어의 경우 10콤보 이상에서 최대 x4.0 확장
                if (charType == CharacterType.Shark && currentCombo >= 25)
                {
                    comboMultiplier = 4.0f;
                }
                else
                {
                    comboMultiplier = 3.0f;
                }
                SetFever(true);
            }
        }

        private void SetFever(bool fever)
        {
            if (isFeverMode != fever)
            {
                isFeverMode = fever;
                if (isFeverMode)
                {
                    OnFeverModeStarted?.Invoke();
                    AudioManager.Instance?.SetFeverTempo(true);
                }
                else
                {
                    OnFeverModeEnded?.Invoke();
                    AudioManager.Instance?.SetFeverTempo(false);
                }
            }
        }

        public void BreakCombo()
        {
            if (currentCombo > 0)
            {
                currentCombo = 0;
                comboMultiplier = 1.0f;
                comboTimer = 0f;
                SetFever(false);

                // 오디오 피치 초기화
                AudioManager.Instance?.ResetPreyPitch();

                OnComboChanged?.Invoke(currentCombo, comboMultiplier, isFeverMode);
                OnComboTimerUpdated?.Invoke(0f);
            }
        }

        public void AddScore(int amount)
        {
            currentScore += amount;
            OnScoreChanged?.Invoke(currentScore);
        }
    }
}
