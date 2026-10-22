using UnityEngine;
using UnityEngine.UI;
using KillerWhale.Core;
using KillerWhale.Managers;

namespace KillerWhale.UI
{
    /// <summary>
    /// 게임 설정 모달 (목숨 3~6회, 컨트롤 오프셋, 사운드 슬라이더) (기획서 13.2절)
    /// </summary>
    public class UISettingsModal : MonoBehaviour
    {
        [Header("Modal Root")]
        [SerializeField] private GameObject settingsPanel;

        [Header("Lives Radio Buttons (3, 4, 5, 6)")]
        [SerializeField] private Toggle toggleLife3;
        [SerializeField] private Toggle toggleLife4;
        [SerializeField] private Toggle toggleLife5;
        [SerializeField] private Toggle toggleLife6;

        [Header("Audio Sliders")]
        [SerializeField] private Slider bgmSlider;
        [SerializeField] private Slider sfxSlider;
        [SerializeField] private Toggle hapticToggle;

        [Header("Control Layout Customization")]
        [SerializeField] private Slider opacitySlider;
        [SerializeField] private Slider scaleSlider;
        [SerializeField] private Slider jumpOffsetXSlider;
        [SerializeField] private Slider jumpOffsetYSlider;

        [Header("Buttons")]
        [SerializeField] private Button resumeButton;
        [SerializeField] private Button homeButton;
        [SerializeField] private Button closeButton;

        private void Awake()
        {
            if (toggleLife3 != null) toggleLife3.onValueChanged.AddListener((on) => { if (on) SetLives(3); });
            if (toggleLife4 != null) toggleLife4.onValueChanged.AddListener((on) => { if (on) SetLives(4); });
            if (toggleLife5 != null) toggleLife5.onValueChanged.AddListener((on) => { if (on) SetLives(5); });
            if (toggleLife6 != null) toggleLife6.onValueChanged.AddListener((on) => { if (on) SetLives(6); });

            if (bgmSlider != null) bgmSlider.onValueChanged.AddListener(OnBgmChanged);
            if (sfxSlider != null) sfxSlider.onValueChanged.AddListener(OnSfxChanged);
            if (hapticToggle != null) hapticToggle.onValueChanged.AddListener(OnHapticToggled);

            if (opacitySlider != null) opacitySlider.onValueChanged.AddListener(OnControlCustomChanged);
            if (scaleSlider != null) scaleSlider.onValueChanged.AddListener(OnControlCustomChanged);
            if (jumpOffsetXSlider != null) jumpOffsetXSlider.onValueChanged.AddListener(OnControlCustomChanged);
            if (jumpOffsetYSlider != null) jumpOffsetYSlider.onValueChanged.AddListener(OnControlCustomChanged);

            if (resumeButton != null) resumeButton.onClick.AddListener(OnClickResume);
            if (homeButton != null) homeButton.onClick.AddListener(OnClickHome);
            if (closeButton != null) closeButton.onClick.AddListener(OnClickResume);
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged += HandleStateChanged;
            }
            LoadCurrentSettingsToUI();
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
            bool isPaused = (state == GameState.Paused);
            if (settingsPanel != null) settingsPanel.SetActive(isPaused);

            if (isPaused)
            {
                LoadCurrentSettingsToUI();
            }
        }

        private void LoadCurrentSettingsToUI()
        {
            var data = SaveSystem.Data;
            if (data == null) return;

            // 목숨 라디오 세팅
            int lives = data.selectedLives;
            if (toggleLife3 != null) toggleLife3.isOn = (lives == 3);
            if (toggleLife4 != null) toggleLife4.isOn = (lives == 4);
            if (toggleLife5 != null) toggleLife5.isOn = (lives == 5);
            if (toggleLife6 != null) toggleLife6.isOn = (lives == 6);

            // 오디오 세팅
            if (bgmSlider != null) bgmSlider.value = data.bgmVolume;
            if (sfxSlider != null) sfxSlider.value = data.sfxVolume;
            if (hapticToggle != null) hapticToggle.isOn = data.hapticEnabled;

            // 조작계 세팅
            if (opacitySlider != null) opacitySlider.value = data.controlOffset.opacity;
            if (scaleSlider != null) scaleSlider.value = data.controlOffset.scale;
            if (jumpOffsetXSlider != null) jumpOffsetXSlider.value = data.controlOffset.jumpX;
            if (jumpOffsetYSlider != null) jumpOffsetYSlider.value = data.controlOffset.jumpY;
        }

        private void SetLives(int count)
        {
            SaveSystem.Data.selectedLives = count;
            SaveSystem.Save();
            GameManager.Instance?.ApplySettingsFromSave();
        }

        private void OnBgmChanged(float val)
        {
            SaveSystem.Data.bgmVolume = val;
            SaveSystem.Save();
            AudioManager.Instance?.ApplyVolumes();
        }

        private void OnSfxChanged(float val)
        {
            SaveSystem.Data.sfxVolume = val;
            SaveSystem.Save();
            AudioManager.Instance?.ApplyVolumes();
        }

        private void OnHapticToggled(bool on)
        {
            SaveSystem.Data.hapticEnabled = on;
            SaveSystem.Save();
        }

        private void OnControlCustomChanged(float dummy)
        {
            var offset = SaveSystem.Data.controlOffset;
            if (opacitySlider != null) offset.opacity = opacitySlider.value;
            if (scaleSlider != null) offset.scale = scaleSlider.value;
            if (jumpOffsetXSlider != null) offset.jumpX = jumpOffsetXSlider.value;
            if (jumpOffsetYSlider != null) offset.jumpY = jumpOffsetYSlider.value;

            SaveSystem.Save();

            // HUD 실시간 반영
            FindObjectOfType<UIHUD>()?.ApplyControlCustomization();
        }

        private void OnClickResume()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            GameManager.Instance?.ChangeState(GameState.Playing);
        }

        private void OnClickHome()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            GameManager.Instance?.ChangeState(GameState.Title);
        }
    }
}
