using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using KillerWhale.Core;
using KillerWhale.Managers;
using KillerWhale.Input;

namespace KillerWhale.UI
{
    /// <summary>
    /// 인게임 HUD 및 가상 조작계(JUMP/D-Pad) 시각 UI (기획서 4.4절 & 13.1절)
    /// </summary>
    public class UIHUD : MonoBehaviour
    {
        [Header("Root Panel")]
        [SerializeField] private GameObject hudRoot;

        [Header("Top HUD Elements")]
        [SerializeField] private Button pauseButton;
        [SerializeField] private Transform livesContainer;
        [SerializeField] private Image lifeIconPrefab;
        [SerializeField] private Slider stageProgressBar;
        [SerializeField] private RectTransform progressPinOrca;
        [SerializeField] private Text scoreText;
        [SerializeField] private Text comboText;
        [SerializeField] private Slider comboTimerSlider;
        [SerializeField] private GameObject feverBanner;

        [Header("Virtual Controller UI")]
        [SerializeField] private RectTransform jumpButtonRect;
        [SerializeField] private Image jumpButtonImage;
        [SerializeField] private RectTransform dpadRect;
        [SerializeField] private CanvasGroup virtualControlsCanvasGroup;

        [Header("Echolocation Indicator")]
        [SerializeField] private GameObject warningIndicator;
        [SerializeField] private RectTransform warningArrow;

        private readonly List<Image> activeLifeIcons = new List<Image>();

        private void Awake()
        {
            if (pauseButton != null) pauseButton.onClick.AddListener(OnClickPause);
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged += HandleStateChanged;
                GameManager.Instance.OnLivesChanged += UpdateLivesUI;
                GameManager.Instance.OnStageProgressChanged += UpdateProgressUI;
            }

            if (ScoreManager.Instance != null)
            {
                ScoreManager.Instance.OnScoreChanged += UpdateScoreUI;
                ScoreManager.Instance.OnComboChanged += UpdateComboUI;
                ScoreManager.Instance.OnComboTimerUpdated += UpdateComboTimerUI;
            }

            if (SpawnManager.Instance != null)
            {
                SpawnManager.Instance.OnHazardApproachingWarning += ShowEcholocationWarning;
            }

            ApplyControlCustomization();
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged -= HandleStateChanged;
                GameManager.Instance.OnLivesChanged -= UpdateLivesUI;
                GameManager.Instance.OnStageProgressChanged -= UpdateProgressUI;
            }

            if (ScoreManager.Instance != null)
            {
                ScoreManager.Instance.OnScoreChanged -= UpdateScoreUI;
                ScoreManager.Instance.OnComboChanged -= UpdateComboUI;
                ScoreManager.Instance.OnComboTimerUpdated -= UpdateComboTimerUI;
            }

            if (SpawnManager.Instance != null)
            {
                SpawnManager.Instance.OnHazardApproachingWarning -= ShowEcholocationWarning;
            }
        }

        private void HandleStateChanged(GameState state)
        {
            bool isPlaying = (state == GameState.Playing);
            if (hudRoot != null) hudRoot.SetActive(isPlaying);

            if (isPlaying)
            {
                InitializeLives(GameManager.Instance.CurrentLives, GameManager.Instance.MaxLives);
                ApplyControlCustomization();
            }
        }

        public void InitializeLives(int current, int max)
        {
            if (livesContainer == null) return;

            // 기존 아이콘 제거
            for (int i = 0; i < activeLifeIcons.Count; i++)
            {
                if (activeLifeIcons[i] != null) Destroy(activeLifeIcons[i].gameObject);
            }
            activeLifeIcons.Clear();

            // 설정된 개수(3~6개)만큼 하트/지느러미 생성
            for (int i = 0; i < max; i++)
            {
                Image icon = Instantiate(lifeIconPrefab, livesContainer);
                icon.gameObject.SetActive(true);
                icon.color = (i < current) ? new Color(1f, 0.2f, 0.5f, 1f) : new Color(0.3f, 0.3f, 0.3f, 0.4f);
                activeLifeIcons.Add(icon);
            }
        }

        private void UpdateLivesUI(int current, int max)
        {
            for (int i = 0; i < activeLifeIcons.Count; i++)
            {
                if (activeLifeIcons[i] != null)
                {
                    bool alive = (i < current);
                    activeLifeIcons[i].color = alive ? new Color(1f, 0.2f, 0.5f, 1f) : new Color(0.3f, 0.3f, 0.3f, 0.4f);
                }
            }
        }

        private void UpdateProgressUI(int percent)
        {
            float norm = percent / 100f;
            if (stageProgressBar != null) stageProgressBar.value = norm;
            if (progressPinOrca != null)
            {
                // 프로그레스 바 너비 220dp 대응
                progressPinOrca.anchoredPosition = new Vector2(norm * 220f - 110f, 0f);
            }
        }

        private void UpdateScoreUI(int score)
        {
            if (scoreText != null)
            {
                // GC 방지용 고정 자리수 포맷팅
                scoreText.text = score.ToString("N0");
            }
        }

        private void UpdateComboUI(int combo, float multiplier, bool isFever)
        {
            if (comboText != null)
            {
                if (combo > 0)
                {
                    comboText.gameObject.SetActive(true);
                    comboText.text = $"COMBO x{combo} ({multiplier:F1}x)";
                }
                else
                {
                    comboText.gameObject.SetActive(false);
                }
            }

            if (feverBanner != null)
            {
                feverBanner.SetActive(isFever);
            }
        }

        private void UpdateComboTimerUI(float normalized)
        {
            if (comboTimerSlider != null)
            {
                comboTimerSlider.value = normalized;
            }
        }

        private void ShowEcholocationWarning(Vector3 worldPos)
        {
            if (warningIndicator != null)
            {
                warningIndicator.SetActive(true);
                if (warningArrow != null)
                {
                    float screenY = Camera.main != null ? Camera.main.WorldToScreenPoint(worldPos).y : Screen.height * 0.5f;
                    warningArrow.position = new Vector3(Screen.width - 60f, screenY, 0f);
                }
                CancelInvoke(nameof(HideWarningIndicator));
                Invoke(nameof(HideWarningIndicator), 1.2f);
            }
        }

        private void HideWarningIndicator()
        {
            if (warningIndicator != null) warningIndicator.SetActive(false);
        }

        public void ApplyControlCustomization()
        {
            if (SaveSystem.Data == null) return;
            var offset = SaveSystem.Data.controlOffset;

            if (virtualControlsCanvasGroup != null)
            {
                virtualControlsCanvasGroup.alpha = offset.opacity;
            }

            if (jumpButtonRect != null)
            {
                jumpButtonRect.localScale = Vector3.one * offset.scale;
                jumpButtonRect.anchoredPosition = new Vector2(offset.jumpX, offset.jumpY);
            }

            if (dpadRect != null)
            {
                dpadRect.localScale = Vector3.one * offset.scale;
                dpadRect.anchoredPosition = new Vector2(offset.dpadX, offset.dpadY);
            }
        }

        private void OnClickPause()
        {
            GameManager.Instance?.TogglePause();
        }
    }
}
