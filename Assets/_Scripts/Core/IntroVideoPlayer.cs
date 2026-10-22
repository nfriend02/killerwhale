using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Video;

namespace KillerWhale.Core
{
    /// <summary>
    /// 6초 인트로 동영상 재생 및 Firebase Storage URL 스트리밍 제어기 (기획서 6.1절)
    /// </summary>
    public class IntroVideoPlayer : MonoBehaviour
    {
        [Header("UI & Video Components")]
        [SerializeField] private GameObject introPanel;
        [SerializeField] private VideoPlayer videoPlayer;
        [SerializeField] private RawImage videoDisplayImage;
        [SerializeField] private Button skipButton;

        [Header("Firebase & Video Sources")]
        [Tooltip("Firebase Storage 또는 CDN 동영상 URL (비어있으면 로컬 파일/클립 재생)")]
        [SerializeField] private string firebaseVideoUrl = "";
        [SerializeField] private VideoClip localIntroClip;
        [SerializeField] private string localRelativePath = "Assets/Art/Video/intro_6s.mp4";

        private void Awake()
        {
            if (skipButton != null)
            {
                skipButton.onClick.AddListener(SkipIntro);
            }

            if (videoPlayer == null)
            {
                videoPlayer = gameObject.AddComponent<VideoPlayer>();
            }

            videoPlayer.playOnAwake = false;
            videoPlayer.isLooping = false;
            videoPlayer.aspectRatio = VideoAspectRatio.FitInside;
            videoPlayer.loopPointReached += OnVideoFinished;
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged += HandleStateChanged;
            }

            // 최초 진입 시 인트로 상태 체크
            if (GameManager.Instance != null && GameManager.Instance.CurrentState == GameState.Intro)
            {
                PlayIntro();
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnStateChanged -= HandleStateChanged;
            }
            if (videoPlayer != null)
            {
                videoPlayer.loopPointReached -= OnVideoFinished;
            }
        }

        private void HandleStateChanged(GameState state)
        {
            if (state == GameState.Intro)
            {
                PlayIntro();
            }
            else
            {
                StopIntro();
            }
        }

        public void PlayIntro()
        {
            if (introPanel != null) introPanel.SetActive(true);

            // 1. Firebase URL 우선 확인
            if (!string.IsNullOrEmpty(firebaseVideoUrl))
            {
                videoPlayer.source = VideoSource.Url;
                videoPlayer.url = firebaseVideoUrl;
                Debug.Log($"[IntroVideoPlayer] Streaming intro video from Firebase Storage: {firebaseVideoUrl}");
            }
            // 2. 로컬 VideoClip 확인
            else if (localIntroClip != null)
            {
                videoPlayer.source = VideoSource.VideoClip;
                videoPlayer.clip = localIntroClip;
                Debug.Log("[IntroVideoPlayer] Playing local VideoClip.");
            }
            // 3. 로컬 파일 경로 확인
            else
            {
                string streamingPath = System.IO.Path.Combine(Application.streamingAssetsPath, "intro_6s.mp4");
                string artPath = System.IO.Path.Combine(Application.dataPath, "Art/Video/intro_6s.mp4");

                if (System.IO.File.Exists(streamingPath))
                {
                    videoPlayer.source = VideoSource.Url;
                    videoPlayer.url = streamingPath;
                }
                else if (System.IO.File.Exists(artPath))
                {
                    videoPlayer.source = VideoSource.Url;
                    videoPlayer.url = artPath;
                }
                else
                {
                    Debug.LogWarning("[IntroVideoPlayer] Video asset not found in assets/video/. Proceeding directly to Title.");
                    SkipIntro();
                    return;
                }
            }

            videoPlayer.Prepare();
            videoPlayer.prepareCompleted += (source) =>
            {
                videoPlayer.Play();
            };
        }

        public void SkipIntro()
        {
            StopIntro();
            SaveSystem.Data.introSeen = true;
            SaveSystem.Save();
            GameManager.Instance?.ChangeState(GameState.Title);
        }

        private void StopIntro()
        {
            if (videoPlayer != null && videoPlayer.isPlaying)
            {
                videoPlayer.Stop();
            }
            if (introPanel != null) introPanel.SetActive(false);
        }

        private void OnVideoFinished(VideoPlayer source)
        {
            Debug.Log("[IntroVideoPlayer] 6s Intro Video finished. Navigating to Title screen.");
            SkipIntro();
        }
    }
}
