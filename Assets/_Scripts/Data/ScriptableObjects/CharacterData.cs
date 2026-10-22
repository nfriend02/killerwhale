using System;
using System.Collections.Generic;
using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Data
{
    public enum PassiveSkillType
    {
        Echolocation,   // 범고래: 위험 인디케이터 상시 표시
        BloodFrenzy,    // 상어: 노미스 포식 시 속도 +20% & 배율 최대 x4.0
        NeedleDash,     // 청새치: 점프 시 소형 그물/적 관통 파괴 돌진 (쿨타임 5초)
        InkScreen,      // 대왕오징어: 위기 시 자동 먹물 분사 1.5초 감속 & 무적 (판당 2회)
        ApexArmor       // 메갈로돈: 보호막 게이지로 소형 바위/잠수함 파괴 통과
    }

    [CreateAssetMenu(fileName = "CharacterData", menuName = "KillerWhale/Character Data", order = 1)]
    public class CharacterData : ScriptableObject
    {
        [Header("Character Identity")]
        public CharacterType characterType;
        public string characterNameKo;
        public string characterNameEn;
        [TextArea] public string description;
        public Sprite portraitSprite;
        public Sprite characterSprite;

        [Header("Base Stats (1.0 ~ 5.0)")]
        [Range(1f, 5f)] public float moveSpeed = 3f;
        [Range(1f, 5f)] public float boostForce = 3f;
        [Range(0.5f, 2f)] public float hitboxRadius = 1.0f;
        [Range(1f, 8f)] public float magnetRadius = 3.0f;
        [Range(0.5f, 5f)] public float waterDrag = 2.0f;   // 관성/제동력 제어

        [Header("Unique Passive Skill")]
        public PassiveSkillType passiveSkill;
        public string skillNameKo;
        [TextArea] public string skillDescription;
        public float skillCooldown = 5f;
        public int skillMaxCharges = 2;

        [Header("10 Dedicated Prey Items")]
        public List<PreyData> dedicatedPreyList = new List<PreyData>();
    }
}
