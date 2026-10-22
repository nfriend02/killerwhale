using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using KillerWhale.Core;
using KillerWhale.Managers;

namespace KillerWhale.UI
{
    /// <summary>
    /// 스테이지 클리어 / 게임오버 결과 화면 (기획서 13.3절 & 9절 별 등급 판정)
    /// </summary>
    public class UIResultModal : MonoBehaviour
    {
        [Header("Modal Root")]
        [SerializeField] private GameObject resultPanel;

        [Header("Title & Story")]
        [SerializeField] private Text titleResultText;      // STAGE CLEAR / GAME OVER
        [SerializeField] private Text stageBridgeText;      // 스테이지 브릿지 연출 문구

        [Header("Score & Combo Stats")]
        [SerializeField] private Text finalScoreText;
        [SerializeField] private Text maxComboText;
        [SerializeField] private GameObject newRecordBadge;

        [Header("Star Rating (★1 ~ ★3)")]
        [SerializeField] private Image star1Icon;
        [SerializeField] private Image star2Icon;
        [SerializeField] private Image star3Icon;

        [Header("Action Buttons")]
        [SerializeField] private Button retryButton;
        [SerializeField] private Button nextStageButton;
        [SerializeField] private Button homeButton;
        [SerializeField] private Button leaderboardButton;

        private void Awake()
        {
            if (retryButton != null) retryButton.onClick.AddListener(OnClickRetry);
            if (nextStageButton != null) nextStageButton.onClick.AddListener(OnClickNextStage);
            if (homeButton != null) homeButton.onClick.AddListener(OnClickHome);
            if (leaderboardButton != null) leaderboardButton.onClick.AddListener(OnClickLeaderboard);
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
            bool show = (state == GameState.StageClear || state == GameState.GameOver);
            if (resultPanel != null) resultPanel.SetActive(show);

            if (show)
            {
                DisplayResults(state == GameState.StageClear);
            }
        }

        private void DisplayResults(bool isClear)
        {
            int score = ScoreManager.Instance != null ? ScoreManager.Instance.CurrentScore : 0;
            int maxCombo = ScoreManager.Instance != null ? ScoreManager.Instance.MaxComboInStage : 0;
            string stageKey = GameManager.Instance.CurrentStage.ToString();
            int bestScore = SaveSystem.Data.GetBestScore(stageKey);

            if (titleResultText != null)
            {
                titleResultText.text = isClear ? "STAGE CLEAR" : "GAME OVER";
                titleResultText.color = isClear ? new Color(1f, 0.85f, 0.2f) : new Color(1f, 0.3f, 0.3f);
            }

            if (nextStageButton != null)
            {
                nextStageButton.gameObject.SetActive(isClear && (int)GameManager.Instance.CurrentStage < 5);
            }

            // 브릿지 문구 연출 (기획서 6.2절)
            if (stageBridgeText != null)
            {
                if (isClear)
                {
                    stageBridgeText.text = GetBridgeText(GameManager.Instance.CurrentStage);
                }
                else
                {
                    stageBridgeText.text = "심해의 위협에 가라앉았습니다. 다시 도전하세요!";
                }
            }

            // 점수 및 콤보
            if (finalScoreText != null) finalScoreText.text = score.ToString("N0");
            if (maxComboText != null) maxComboText.text = $"MAX COMBO: x{maxCombo}";

            // 신기록 배지
            if (newRecordBadge != null)
            {
                newRecordBadge.SetActive(score > bestScore);
            }

            // 별 등급 계산 (기획서 9절)
            // ★1: 클리어, ★2: 목숨 2개 이상 남김, ★3: 무피격 클리어
            int stars = 0;
            if (isClear)
            {
                stars = 1;
                if (GameManager.Instance.CurrentLives >= 2) stars = 2;
                if (GameManager.Instance.CurrentLives == GameManager.Instance.MaxLives) stars = 3;
            }

            SetStars(stars);
            SaveSystem.Data.SetBestStars(stageKey, stars);
            SaveSystem.Save();

            // Firebase 점수 제출
            FirebaseManager.Instance?.SubmitScore(stageKey, score, GameManager.Instance.SelectedCharacter.ToString());
        }

        private void SetStars(int stars)
        {
            Color activeColor = new Color(1f, 0.85f, 0.2f);
            Color dimColor = new Color(0.3f, 0.3f, 0.3f, 0.4f);

            if (star1Icon != null) star1Icon.color = (stars >= 1) ? activeColor : dimColor;
            if (star2Icon != null) star2Icon.color = (stars >= 2) ? activeColor : dimColor;
            if (star3Icon != null) star3Icon.color = (stars >= 3) ? activeColor : dimColor;
        }

        private string GetBridgeText(StageIndex stage)
        {
            switch (stage)
            {
                case StageIndex.Stage1_Pacific:
                    return "화창한 태평양을 지나 극지의 차가운 유빙 바다로 들어섭니다.";
                case StageIndex.Stage2_Antarctic:
                    return "빙하 동굴을 탈출하여 화려한 네온 산호초 미로에 다다릅니다.";
                case StageIndex.Stage3_TropicalReef:
                    return "산호초 숲을 넘어 빛이 닿지 않는 대서양 칠흑의 심해로 침투합니다.";
                case StageIndex.Stage4_AtlanticDeep:
                    return "잠수함의 탐지를 뚫고 지각이 갈라지는 마리아나 해구의 심연으로 내려갑니다.";
                case StageIndex.Stage5_MarianaTrench:
                    return "용암 레비아탄을 제압하고 바다의 최상위 군주로 거듭납니다!";
                default:
                    return "축하합니다!";
            }
        }

        private void OnClickRetry()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            GameManager.Instance?.RestartCurrentStage();
        }

        private void OnClickNextStage()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            GameManager.Instance?.NextStage();
        }

        private void OnClickHome()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            GameManager.Instance?.ChangeState(GameState.Title);
        }

        private void OnClickLeaderboard()
        {
            AudioManager.Instance?.PlaySfx(AudioClipType.ButtonClick);
            Debug.Log("[UIResultModal] Open Leaderboard View");
        }
    }
}
