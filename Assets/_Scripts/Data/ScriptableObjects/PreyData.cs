using System;
using System.Collections.Generic;
using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Data
{
    [CreateAssetMenu(fileName = "PreyData", menuName = "KillerWhale/Prey Data", order = 2)]
    public class PreyData : ScriptableObject
    {
        [Header("Prey Info")]
        public string preyId;               // unique key (e.g., kw_01_seal)
        public string preyNameKo;           // 한국어 먹이 이름
        public CharacterType ownerCharacter;// 소유 캐릭터
        public Sprite iconSprite;           // 아이콘 스프라이트
        public bool isRare;                 // 희귀 먹이 여부 (300점)
        public int baseScore = 100;         // 기본 100점 (희귀 300점)
        public Color glowColor = Color.cyan;// 획득 시 파티클 컬러

        /// <summary>
        /// 기획서에 명시된 50종 먹이 명부 초기화 팩토리
        /// </summary>
        public static List<PreyInfo> GetAllPreyDefinitions()
        {
            var list = new List<PreyInfo>();

            // 1. 범고래 전용 10종
            string[] kw = { "물개", "연어", "바다표범", "펭귄", "청어", "가오리", "바다사자", "오징어", "왕바다표범", "정어리 떼" };
            for (int i = 0; i < kw.Length; i++)
            {
                list.Add(new PreyInfo($"kw_{i+1}", kw[i], CharacterType.KillerWhale, (i == 8 || i == 9) ? 300 : 100, i >= 8));
            }

            // 2. 상어 전용 10종
            string[] sk = { "참치", "고등어", "바다거북", "정어리", "방어", "꽁치", "삼치", "날치", "게", "쥐치" };
            for (int i = 0; i < sk.Length; i++)
            {
                list.Add(new PreyInfo($"sk_{i+1}", sk[i], CharacterType.Shark, (i == 2 || i == 7) ? 300 : 100, i == 2 || i == 7));
            }

            // 3. 청새치 전용 10종
            string[] bm = { "무늬오징어", "만새기", "날치", "멸치 떼", "삼치", "고등어", "전갱이", "청새치 치어", "꽁치", "바다새" };
            for (int i = 0; i < bm.Length; i++)
            {
                list.Add(new PreyInfo($"bm_{i+1}", bm[i], CharacterType.BlueMarlin, (i == 1 || i == 9) ? 300 : 100, i == 1 || i == 9));
            }

            // 4. 대왕오징어 전용 10종
            string[] gs = { "심해어", "랜턴피시", "심해 새우", "갯지렁이", "갑오징어", "명태", "대구", "심해 게", "암모나이트", "크릴새우 떼" };
            for (int i = 0; i < gs.Length; i++)
            {
                list.Add(new PreyInfo($"gs_{i+1}", gs[i], CharacterType.GiantSquid, (i == 8 || i == 9) ? 300 : 100, i == 8 || i == 9));
            }

            // 5. 메갈로돈 전용 10종
            string[] mg = { "고대 고래", "대형 바다거북", "대형 매너티", "바다사자 떼", "대형 참치", "대형 가오리", "고대 상어", "해양 파충류", "향고래", "고대 다랑어" };
            for (int i = 0; i < mg.Length; i++)
            {
                list.Add(new PreyInfo($"mg_{i+1}", mg[i], CharacterType.Megalodon, (i == 6 || i == 8) ? 300 : 100, i == 6 || i == 8));
            }

            return list;
        }
    }

    [Serializable]
    public struct PreyInfo
    {
        public string id;
        public string nameKo;
        public CharacterType character;
        public int score;
        public bool isRare;

        public PreyInfo(string id, string nameKo, CharacterType character, int score, bool isRare)
        {
            this.id = id;
            this.nameKo = nameKo;
            this.character = character;
            this.score = score;
            this.isRare = isRare;
        }
    }
}
