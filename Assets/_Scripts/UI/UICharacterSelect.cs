using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using KillerWhale.Core;
using KillerWhale.Data;

namespace KillerWhale.UI
{
    /// <summary>
    /// 5종 캐릭터 캐러셀, 스탯 그래프, 먹이 10종 프리뷰 및 선택 제어기 (기획서 4.1절 & 11절)
    /// </summary>
    public class UICharacterSelect : MonoBehaviour
    {
        [Header("Panel Root")]
        [SerializeField] private GameObject selectPanel;

        [Header("Navigation Buttons")]
        [SerializeField] private Button prevButton;
        [SerializeField] private Button nextButton;
        [SerializeField] private Button selectPlayButton;
        [SerializeField] private Button backButton;

        [Header("Character Info Views")]
        [SerializeField] private Text characterNameText;
        [SerializeField] private Text characterTitleText;
        [SerializeField] private Image characterPortrait;
        [SerializeField] private Text skillDescriptionText;

        [Header("Stat Bars (0.0 ~ 1.0)")]
        [SerializeField] private Slider speedStatBar;
        [SerializeField] private Slider boostStatBar;
        [SerializeField] private Slider hitboxStatBar;
        [SerializeField] private Slider magnetStatBar;

        [Header("10 Dedicated Prey Preview")]
        [SerializeField] private Transform preyGridContainer;
        [SerializeField] private Text[] preyNameLabels = new Text[10];

        private int currentIndex = 0;
        private readonly CharacterType[] characterTypes = {
            CharacterType.KillerWhale,
            CharacterType.Shark,
            CharacterType.BlueMarlin,
            CharacterType.GiantSquid,
            CharacterType.Megalodon
        };

        private void Awake()
        {
            if (prevButton != null) prevButton.onClick.AddListener(OnClickPrev);
            if (nextButton != null) nextButton.onClick.AddListener(OnClickNext);
            if (selectPlayButton != null) selectPlayButton.onClick.AddListener(OnClickSelectPlay);
            if (backButton != null) backButton.onClick.AddListener(OnClickBack);
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
            bool isSelect = (state == GameState.CharacterSelect);
            if (selectPanel != null) selectPanel.SetActive(isSelect);

            if (isSelect)
            {
                DisplayCharacter(currentIndex);
            }
        }

        private void DisplayCharacter(int index)
        {
            CharacterType type = characterTypes[index];

            switch (type)
            {
                case CharacterType.KillerWhale:
                    SetUIInfo("범고래 (Killer Whale)", "올라운더 / 밸런스형",
                              "고유 스킬: [초음파 탐지 (Echolocation)] - 화면 우측에 적/어뢰 출현 1.5초 전 점멸 인디케이터 항시 표시.",
                              0.6f, 0.6f, 0.6f, 0.6f,
                              new[] { "물개", "연어", "바다표범", "펭귄", "청어", "가오리", "바다사자", "오징어", "왕바다표범", "정어리 떼" });
                    break;

                case CharacterType.Shark:
                    SetUIInfo("상어 (Shark)", "기습 / 속도 특화형",
                              "고유 스킬: [피의 포식 (Blood Frenzy)] - 노미스 먹이 연속 포식 시 이속 누적 +20% & 콤보 최대 x4.0 확장.",
                              0.8f, 0.8f, 0.4f, 0.4f,
                              new[] { "참치", "고등어", "바다거북", "정어리", "방어", "꽁치", "삼치", "날치", "갑각류(게)", "쥐치" });
                    break;

                case CharacterType.BlueMarlin:
                    SetUIInfo("청새치 (Blue Marlin)", "초고속 직진 / 돌진형",
                              "고유 스킬: [바늘 돌진 (Needle Dash)] - JUMP 입력 시 전방 사선 순간 돌진 & 소형 그물/일반 적 1회 관통 파괴.",
                              1.0f, 1.0f, 0.35f, 0.2f,
                              new[] { "무늬오징어", "만새기", "날치", "멸치 떼", "삼치", "고등어", "전갱이", "청새치 치어", "꽁치", "바다새" });
                    break;

                case CharacterType.GiantSquid:
                    SetUIInfo("대왕오징어 (Giant Squid)", "심해 / 특수 궤적 유연형",
                              "고유 스킬: [먹물 은신 (Ink Screen)] - 광범위 자력 흡입. 피격 위기 시 자동 먹물 분사로 적 1.5초 감속 & 무적 (판당 2회).",
                              0.4f, 0.4f, 0.6f, 1.0f,
                              new[] { "심해어", "랜턴피시", "심해 새우", "갯지렁이", "갑오징어", "명태", "대구", "심해 게", "암모나이트", "크릴새우 떼" });
                    break;

                case CharacterType.Megalodon:
                    SetUIInfo("메갈로돈 (Megalodon)", "고대 파워 / 돌파형",
                              "고유 스킬: [최상위 장갑 (Apex Armor)] - 큰 관성과 중량감. 보호막 게이지 충전 시 소형 바위/잠수함 파괴 통과.",
                              0.4f, 0.6f, 1.0f, 0.8f,
                              new[] { "고대 고래", "대형 바다거북", "대형 매너티", "바다사자 떼", "대형 참치", "대형 가오리", "고대 상어", "해양 파충류", "향고래", "고대 다랑어" });
                    break;
            }
        }

        private void SetUIInfo(string name, string title, string skillDesc, float spd, float bst, float hit, float mag, string[] preys)
        {
            if (characterNameText != null) characterNameText.text = name;
            if (characterTitleText != null) characterTitleText.text = title;
            if (skillDescriptionText != null) skillDescriptionText.text = skillDesc;

            if (speedStatBar != null) speedStatBar.value = spd;
            if (boostStatBar != null) boostStatBar.value = bst;
            if (hitboxStatBar != null) hitboxStatBar.value = hit;
            if (magnetStatBar != null) magnetStatBar.value = mag;

            for (int i = 0; i < preyNameLabels.Length && i < preys.Length; i++)
            {
                if (preyNameLabels[i] != null) preyNameLabels[i].text = $"{i+1}. {preys[i]}";
            }
        }

        private void OnClickPrev()
        {
            currentIndex = (currentIndex - 1 + characterTypes.Length) % characterTypes.Length;
            DisplayCharacter(currentIndex);
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
        }

        private void OnClickNext()
        {
            currentIndex = (currentIndex + 1) % characterTypes.Length;
            DisplayCharacter(currentIndex);
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
        }

        private void OnClickSelectPlay()
        {
            CharacterType selected = characterTypes[currentIndex];
            GameManager.Instance.SelectedCharacter = selected;
            SaveSystem.Data.selectedCharacter = selected.ToString();
            SaveSystem.Save();

            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
            GameManager.Instance.StartStage(StageIndex.Stage1_Pacific);
        }

        private void OnClickBack()
        {
            Managers.AudioManager.Instance?.PlaySfx(Managers.AudioClipType.ButtonClick);
            GameManager.Instance.ChangeState(GameState.Title);
        }
    }
}
