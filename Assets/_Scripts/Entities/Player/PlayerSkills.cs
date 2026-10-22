using System;
using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;
using KillerWhale.Entities.Hazards;
using KillerWhale.Input;
using KillerWhale.Managers;

namespace KillerWhale.Entities.Player
{
    /// <summary>
    /// 5종 주인공 캐릭터별 고유 패시브/액티브 스킬 시스템 (기획서 4.1절)
    /// </summary>
    public class PlayerSkills : MonoBehaviour
    {
        [Header("Runtime State")]
        [SerializeField] private CharacterType characterType;
        [SerializeField] private PassiveSkillType skillType;

        // 청새치: Needle Dash 상태
        private float needleDashCooldown = 5f;
        private float needleDashTimer = 0f;
        private bool isNeedleDashing = false;
        private float dashDuration = 0.35f;
        private float dashTimer = 0f;

        // 대왕오징어: Ink Screen 상태
        private int remainingInkScreens = 2; // 판당 2회

        // 상어: Blood Frenzy 상태
        private int consecutivePreyCount = 0;
        private float bloodFrenzySpeedBonus = 0f;

        // 메갈로돈: Apex Armor 상태
        private float armorGauge = 100f; // 0 ~ 100%
        private const float MAX_ARMOR = 100f;

        private PlayerController playerController;

        public event Action<bool> OnEcholocationWarning; // 범고래 인디케이터 알림
        public event Action OnSkillTriggered;

        private void Awake()
        {
            playerController = GetComponent<PlayerController>();
        }

        public void Initialize(CharacterType type)
        {
            characterType = type;
            needleDashTimer = 0f;
            isNeedleDashing = false;
            remainingInkScreens = 2;
            consecutivePreyCount = 0;
            bloodFrenzySpeedBonus = 0f;
            armorGauge = MAX_ARMOR;

            switch (type)
            {
                case CharacterType.KillerWhale:
                    skillType = PassiveSkillType.Echolocation;
                    break;
                case CharacterType.Shark:
                    skillType = PassiveSkillType.BloodFrenzy;
                    break;
                case CharacterType.BlueMarlin:
                    skillType = PassiveSkillType.NeedleDash;
                    needleDashCooldown = 5f;
                    break;
                case CharacterType.GiantSquid:
                    skillType = PassiveSkillType.InkScreen;
                    break;
                case CharacterType.Megalodon:
                    skillType = PassiveSkillType.ApexArmor;
                    break;
            }

            if (InputManager.Instance != null)
            {
                InputManager.Instance.OnJumpDown += HandleJumpForSkills;
            }
        }

        private void OnDestroy()
        {
            if (InputManager.Instance != null)
            {
                InputManager.Instance.OnJumpDown -= HandleJumpForSkills;
            }
        }

        private void Update()
        {
            float dt = Time.deltaTime;

            // 1. 청새치: Needle Dash 쿨다운 및 지속 시간
            if (characterType == CharacterType.BlueMarlin)
            {
                if (needleDashTimer > 0f) needleDashTimer -= dt;

                if (isNeedleDashing)
                {
                    dashTimer -= dt;
                    if (dashTimer <= 0f)
                    {
                        isNeedleDashing = false;
                        playerController.SetNeedleDashing(false);
                    }
                }
            }

            // 2. 메갈로돈: Apex Armor 게이지 점진 충전
            if (characterType == CharacterType.Megalodon)
            {
                if (armorGauge < MAX_ARMOR)
                {
                    armorGauge = Mathf.Min(MAX_ARMOR, armorGauge + dt * 10f); // 10초에 100% 충전
                }
            }
        }

        private void HandleJumpForSkills()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing) return;

            // 청새치 점프 시 Needle Dash 발동
            if (characterType == CharacterType.BlueMarlin && needleDashTimer <= 0f)
            {
                TriggerNeedleDash();
            }
        }

        private void TriggerNeedleDash()
        {
            isNeedleDashing = true;
            dashTimer = dashDuration;
            needleDashTimer = needleDashCooldown;

            playerController.SetNeedleDashing(true);
            AudioManager.Instance?.PlaySfx(AudioClipType.JumpWaterBurst);
            OnSkillTriggered?.Invoke();
        }

        public void OnPreyCollected()
        {
            // 상어: Blood Frenzy 스킬 (노미스 포식 누적 이속 +20%)
            if (characterType == CharacterType.Shark)
            {
                consecutivePreyCount++;
                bloodFrenzySpeedBonus = Mathf.Min(0.20f, consecutivePreyCount * 0.02f);
                playerController.SetSpeedMultiplier(1f + bloodFrenzySpeedBonus);
            }
        }

        public void OnPlayerHit()
        {
            consecutivePreyCount = 0;
            bloodFrenzySpeedBonus = 0f;
            playerController.SetSpeedMultiplier(1f);
        }

        /// <summary>
        /// 대왕오징어: 위기 시 먹물 분사 자동 발동
        /// </summary>
        public bool TryTriggerInkScreen()
        {
            if (characterType != CharacterType.GiantSquid) return false;
            if (remainingInkScreens <= 0) return false;

            remainingInkScreens--;
            GameManager.Instance.TriggerTemporaryInvincibility(1.5f);

            // 주변 적 감속 트리거
            SpawnManager.Instance?.SlowDownAllHazards(1.5f, 0.4f);
            AudioManager.Instance?.PlaySfx(AudioClipType.InkScreenSfx);
            OnSkillTriggered?.Invoke();
            return true;
        }

        /// <summary>
        /// 메갈로돈 또는 청새치 스킬로 장애물을 파괴할 수 있는지 검사
        /// </summary>
        public bool CanDestroyHazard(HazardBase hazard)
        {
            if (hazard == null) return false;

            // 청새치 Needle Dash 돌진 중 소형 그물/일반 적 파괴
            if (characterType == CharacterType.BlueMarlin && isNeedleDashing)
            {
                if (hazard.Kind == HazardKind.Net || hazard.Kind == HazardKind.Torpedo || hazard.Kind == HazardKind.HumanDiver)
                {
                    return true;
                }
            }

            // 메갈로돈 Apex Armor: 장갑 게이지 100%일 때 소형 바위/잠수함 파괴 통과
            if (characterType == CharacterType.Megalodon && armorGauge >= MAX_ARMOR)
            {
                if (hazard.Kind == HazardKind.Rock || hazard.Kind == HazardKind.Submarine || hazard.Kind == HazardKind.Torpedo)
                {
                    armorGauge = 0f; // 방어막 소모
                    ScoreManager.Instance?.AddSmashBonus();
                    AudioManager.Instance?.PlaySfx(AudioClipType.ArmorSmash);
                    return true;
                }
            }

            return false;
        }

        public float GetArmorNormalized() => armorGauge / MAX_ARMOR;
        public int GetRemainingInkScreens() => remainingInkScreens;
        public float GetNeedleDashCooldownNormalized() => needleDashTimer / needleDashCooldown;
    }
}
