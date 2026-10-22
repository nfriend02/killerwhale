using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Boss.StageBosses
{
    /// <summary>
    /// Stage 5 최종 보스: 심연의 군주 '용암 레비아탄' 2페이즈 (기획서 4.3절)
    /// </summary>
    public class BossMagmaLeviathan : BossBase
    {
        [Header("Phase State")]
        [SerializeField] private int currentPhase = 1; // 1: 수중 격돌, 2: 마그마 대폭발 & 거대 돌진
        private float breathTimer = 0f;
        private bool isCharging = false;
        private Vector3 chargeTarget;

        protected override void Awake()
        {
            base.Awake();
            bossNameKo = "심연의 군주 용암 레비아탄";
        }

        public override void SpawnBoss(int hp)
        {
            base.SpawnBoss(hp);
            currentPhase = 1;
            isCharging = false;
        }

        public override void TakeDamage(int damage)
        {
            base.TakeDamage(damage);

            // 2페이즈 진입 조건: HP 50% 이하
            if (currentPhase == 1 && currentHp <= maxHp * 0.5f)
            {
                currentPhase = 2;
                TriggerPhase2Transformation();
            }
        }

        private void TriggerPhase2Transformation()
        {
            Debug.Log("[BossMagmaLeviathan] PHASE 2: Magma Leviathan Awakens!");
            if (bossRenderer != null)
            {
                bossRenderer.color = new Color(1f, 0.2f, 0f); // 마그마 불꽃 색상
            }
            currentState = BossState.SpecialAttack;
            stateTimer = 0f;
        }

        protected override void UpdateFSM(float dt)
        {
            breathTimer += dt;

            if (currentPhase == 1)
            {
                UpdatePhase1(dt);
            }
            else
            {
                UpdatePhase2(dt);
            }
        }

        private void UpdatePhase1(float dt)
        {
            switch (currentState)
            {
                case BossState.Idle:
                    transform.position = new Vector3(6.2f, Mathf.Sin(stateTimer * 2f) * 2.5f, 0f);

                    if (stateTimer >= 2.5f)
                    {
                        currentState = BossState.AttackPattern1;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.AttackPattern1:
                    // 거품 브레스 발사
                    if (breathTimer >= 1.5f)
                    {
                        breathTimer = 0f;
                        Managers.SpawnManager.Instance?.SpawnHazardAt(HazardKind.MagmaBubble, transform.position + Vector3.left * 2f);
                    }

                    if (stateTimer >= 4f)
                    {
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    if (stateTimer >= 2f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }

        private void UpdatePhase2(float dt)
        {
            switch (currentState)
            {
                case BossState.Idle:
                    transform.position = new Vector3(6.5f, Mathf.Sin(stateTimer * 3.5f) * 3.0f, 0f);

                    if (stateTimer >= 2f)
                    {
                        currentState = BossState.SpecialAttack;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.SpecialAttack:
                    // 화면 우측 거대 돌진 공격 (Giant Charge Dash)
                    if (stateTimer < 1.0f)
                    {
                        // 뒤로 물러나며 준비
                        transform.position += Vector3.right * 2f * dt;
                    }
                    else if (stateTimer < 2.2f)
                    {
                        // 앞으로 초고속 돌진
                        transform.position += Vector3.left * 14f * dt;
                    }
                    else
                    {
                        // 복귀
                        transform.position = new Vector3(6.5f, 0f, 0f);
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    if (stateTimer >= 3f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }
    }
}
