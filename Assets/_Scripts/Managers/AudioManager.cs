using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Managers
{
    public enum AudioClipType
    {
        PreyPickup,
        HitThud,
        JumpWaterBurst,
        FeverStart,
        StageClearBgm,
        GameOverBgm,
        ButtonClick,
        InkScreenSfx,
        ArmorSmash
    }

    /// <summary>
    /// BGM, SFX, Pitch Shifted Combo Sound 및 Haptic 진동 관리자 (기획서 4.2절 & 14절)
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Sources")]
        [SerializeField] private AudioSource bgmSource;
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource comboSfxSource;

        [Header("Audio Clips")]
        [SerializeField] private AudioClip mainTitleBgm;
        [SerializeField] private AudioClip[] stageBgms = new AudioClip[5];
        [SerializeField] private AudioClip preyPickupClip;
        [SerializeField] private AudioClip hitThudClip;
        [SerializeField] private AudioClip jumpBurstClip;
        [SerializeField] private AudioClip stageClearClip;
        [SerializeField] private AudioClip gameOverClip;

        private float currentPreyPitch = 1.0f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            if (bgmSource == null) bgmSource = gameObject.AddComponent<AudioSource>();
            if (sfxSource == null) sfxSource = gameObject.AddComponent<AudioSource>();
            if (comboSfxSource == null) comboSfxSource = gameObject.AddComponent<AudioSource>();

            bgmSource.loop = true;
            ApplyVolumes();
        }

        public void ApplyVolumes()
        {
            if (SaveSystem.Data != null)
            {
                if (bgmSource != null) bgmSource.volume = SaveSystem.Data.bgmVolume;
                if (sfxSource != null) sfxSource.volume = SaveSystem.Data.sfxVolume;
                if (comboSfxSource != null) comboSfxSource.volume = SaveSystem.Data.sfxVolume;
            }
        }

        public void PlayBgmForStage(StageIndex stage)
        {
            int idx = (int)stage - 1;
            if (stageBgms != null && idx >= 0 && idx < stageBgms.Length && stageBgms[idx] != null)
            {
                bgmSource.clip = stageBgms[idx];
                bgmSource.pitch = 1.0f;
                bgmSource.Play();
            }
        }

        public void PlayTitleBgm()
        {
            if (mainTitleBgm != null)
            {
                bgmSource.clip = mainTitleBgm;
                bgmSource.pitch = 1.0f;
                bgmSource.Play();
            }
        }

        public void SetFeverTempo(bool isFever)
        {
            if (bgmSource != null)
            {
                bgmSource.pitch = isFever ? 1.15f : 1.0f;
            }
        }

        public void PlayPitchShiftedPreySfx(float pitch)
        {
            currentPreyPitch = pitch;
            if (comboSfxSource != null)
            {
                comboSfxSource.pitch = currentPreyPitch;
                if (preyPickupClip != null)
                {
                    comboSfxSource.PlayOneShot(preyPickupClip);
                }
            }
        }

        public void ResetPreyPitch()
        {
            currentPreyPitch = 1.0f;
            if (comboSfxSource != null)
            {
                comboSfxSource.pitch = 1.0f;
            }
        }

        public void PlaySfx(AudioClipType type)
        {
            if (sfxSource == null) return;

            AudioClip clip = null;
            switch (type)
            {
                case AudioClipType.PreyPickup: clip = preyPickupClip; break;
                case AudioClipType.HitThud: clip = hitThudClip; break;
                case AudioClipType.JumpWaterBurst: clip = jumpBurstClip; break;
                case AudioClipType.StageClearBgm: clip = stageClearClip; break;
                case AudioClipType.GameOverBgm: clip = gameOverClip; break;
            }

            if (clip != null)
            {
                sfxSource.PlayOneShot(clip);
            }
        }

        public void TriggerHaptic()
        {
            if (SaveSystem.Data != null && SaveSystem.Data.hapticEnabled)
            {
#if UNITY_ANDROID || UNITY_IOS
                Handheld.Vibrate();
#endif
            }
        }
    }
}
