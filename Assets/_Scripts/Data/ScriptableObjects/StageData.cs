using System;
using System.Collections.Generic;
using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Data
{
    [CreateAssetMenu(fileName = "StageData", menuName = "KillerWhale/Stage Data", order = 3)]
    public class StageData : ScriptableObject
    {
        [Header("Stage Identity")]
        public StageIndex stageIndex = StageIndex.Stage1_Pacific;
        public string stageNameKo;
        public string stageNameEn;
        [TextArea] public string stageDescription;

        [Header("Visual Palette & Ambience")]
        public Color primaryColor = new Color(0f, 0.7f, 0.85f); // #00B4D8
        public Color secondaryColor = new Color(0.56f, 0.88f, 0.94f); // #90E0EF
        public Color waterFogColor = new Color(0f, 0.2f, 0.4f, 0.5f);
        public Sprite backgroundParallaxLayerFar;
        public Sprite backgroundParallaxLayerMid;
        public Sprite backgroundParallaxLayerClose;

        [Header("Stage Progress & Timing")]
        public float parTimeSeconds = 60f; // 58s ~ 70s
        public float stageLengthPixels = 12000f; // 총 스크롤 길이
        public float scrollSpeed = 200f; // 기본 스크롤 속도

        [Header("Special Stage Event")]
        public StageEventType specialEvent = StageEventType.None;
        public float eventTriggerProgress = 0.5f; // 진행률 50% 지점 발동
        public float eventDuration = 10f; // 10초 지속
        public string eventBannerMessageKo;

        [Header("Boss Encounter")]
        public string bossNameKo;
        public string bossTitleKo;
        public int bossMaxHp = 100;
        public float bossTriggerProgress = 0.85f; // 진행률 85% 지점 보스 등장
        [TextArea] public string bossClearBridgeTextKo;

        public static StageData CreateDefault(StageIndex index)
        {
            var data = CreateInstance<StageData>();
            data.stageIndex = index;

            switch (index)
            {
                case StageIndex.Stage1_Pacific:
                    data.stageNameKo = "Stage 1: 태평양";
                    data.stageNameEn = "Pacific Ocean";
                    data.primaryColor = new Color(0.0f, 0.706f, 0.847f); // #00B4D8
                    data.secondaryColor = new Color(0.565f, 0.878f, 0.937f);
                    data.parTimeSeconds = 58f;
                    data.specialEvent = StageEventType.FeedingFrenzy;
                    data.eventBannerMessageKo = "정어리 떼 피딩 프렌지! (FEVER TIME)";
                    data.bossNameKo = "헤파이토스 호 & 탐사 드론";
                    data.bossClearBridgeTextKo = "화창한 태평양을 지나 극지의 차가운 유빙 바다로 들어섭니다.";
                    data.bossMaxHp = 80;
                    break;

                case StageIndex.Stage2_Antarctic:
                    data.stageNameKo = "Stage 2: 남극";
                    data.stageNameEn = "Antarctic Ocean";
                    data.primaryColor = new Color(0.0f, 0.467f, 0.714f); // #0077B6
                    data.secondaryColor = new Color(0.878f, 0.98f, 1.0f);
                    data.parTimeSeconds = 60f;
                    data.specialEvent = StageEventType.IcebergCollapse;
                    data.eventBannerMessageKo = "경고: 유빙 대붕괴! 낙하하는 빙하를 회피하세요!";
                    data.bossNameKo = "고대 아이스 크라켄";
                    data.bossClearBridgeTextKo = "빙하 동굴을 탈출하여 화려한 네온 산호초 미로에 다다릅니다.";
                    data.bossMaxHp = 100;
                    break;

                case StageIndex.Stage3_TropicalReef:
                    data.stageNameKo = "Stage 3: 열대 산호초";
                    data.stageNameEn = "Tropical Coral Reef";
                    data.primaryColor = new Color(1.0f, 0.0f, 0.498f); // #FF007F
                    data.secondaryColor = new Color(0.482f, 0.173f, 0.749f);
                    data.parTimeSeconds = 60f;
                    data.specialEvent = StageEventType.CurrentRush;
                    data.eventBannerMessageKo = "해저 급류 래프팅! (이동속도 2배 가속)";
                    data.bossNameKo = "쏠배감펭 퀸";
                    data.bossClearBridgeTextKo = "산호초 숲을 넘어 빛이 닿지 않는 대서양 칠흑의 심해로 침투합니다.";
                    data.bossMaxHp = 120;
                    break;

                case StageIndex.Stage4_AtlanticDeep:
                    data.stageNameKo = "Stage 4: 대서양 심해";
                    data.stageNameEn = "Atlantic Deep Sea";
                    data.primaryColor = new Color(0.043f, 0.035f, 0.039f); // #0B090A
                    data.secondaryColor = new Color(0.322f, 0.718f, 0.533f);
                    data.parTimeSeconds = 65f;
                    data.specialEvent = StageEventType.BioluminescentMode;
                    data.eventBannerMessageKo = "자발광 암전 타임! (생체 발광체 감지 모드)";
                    data.bossNameKo = "군용 스텔스 잠수함 네모-X";
                    data.bossClearBridgeTextKo = "잠수함의 탐지를 뚫고 지각이 갈라지는 마리아나 해구의 심연으로 내려갑니다.";
                    data.bossMaxHp = 140;
                    break;

                case StageIndex.Stage5_MarianaTrench:
                    data.stageNameKo = "Stage 5: 마리아나 해구";
                    data.stageNameEn = "Mariana Trench";
                    data.primaryColor = new Color(0.863f, 0.184f, 0.008f); // #DC2F02
                    data.secondaryColor = new Color(0.141f, 0.0f, 0.275f);
                    data.parTimeSeconds = 70f;
                    data.specialEvent = StageEventType.AbyssalVortex;
                    data.eventBannerMessageKo = "심연의 소용돌이! (중앙 흡인 탈출)";
                    data.bossNameKo = "심연의 군주 용암 레비아탄";
                    data.bossClearBridgeTextKo = "용암 레비아탄을 제압하고 바다의 최상위 군주로 거듭납니다!";
                    data.bossMaxHp = 180;
                    break;
            }

            return data;
        }
    }
}
