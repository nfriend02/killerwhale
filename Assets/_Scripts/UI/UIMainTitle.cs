using UnityEngine;
using UnityEngine.UI;
using KillerWhale.Core;

namespace KillerWhale.UI
{
    /// <summary>
    /// 메인 타이틀 화면 및 네비게이션 제어기 (기획서 13절)
    /// </summary>
    public class UIMainTitle : MonoBehaviour
    {
        [Header("UI Panels")]
        [SerializeField] private GameObject titlePanel;
        [SerializeField] private Button startButton;
        [SerializeField] private Button characterSelectButton;
        [SerializeField] private Button settingsButton;

        [Header("Visual Elements")]
        [SerializeField] private RectTransform titleLogo;
        [SerializeField] private RectTransform swimmingOrca;

        private void Awake()
        {
            if (startButton != null) startButton.onClick.AddListener(OnClickStart);
            if (characterSelectButton != null) characterSelectButton.onClick.AddListener(OnClickCharacterSelect);
            if (settingsButton != null) settingsButton.onClick.AddListener(OnClickSettings);
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
            bool isTitle = (state == GameState.Title);
            if (titlePanel != null) titlePanel.SetActive(isTitle);

            if (isTitle)
            {
                Managers.AudioManager.Instance?.PlayTitleBgm();
            }
        }

        private void Update()
        {
            if (titlePanel != null && titlePanel.activeInHierarchy)
            {
                // 로고 및 배경 범고래의 유기적인 수중 헤엄 플로팅 애니메이션
                float t = Time.time;
                if (titleLogo != null)
                {
                    titleLogo.anchoredPosition = new Vector2(0f, 150f + Mathf.Sin(t * 2f) * 12f);
                }
                if (swimmingOrca != null)
                {
                    swimmingOrca.anchoredPosition = new Vector2(Mathf.Sin(t * 1.5f) * 30f, -60f + Mathf.Cos(t * 2f) * 15f);
                }
            }
        }

        private void OnClickStart()
        {
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
            GameManager.Instance?.StartStage(StageIndex.Stage1_Pacific);
        }

        private void OnClickCharacterSelect()
        {
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
            GameManager.Instance?.ChangeState(GameState.CharacterSelect);
        }

        private void OnClickSettings()
        {
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
            GameManager.Instance?.ChangeState(GameState.Paused);
        }
    }
}
