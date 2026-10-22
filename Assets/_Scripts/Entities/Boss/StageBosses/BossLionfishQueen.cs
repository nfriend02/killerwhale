using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Boss.StageBosses
{
    /// <summary>
    /// Stage 3 보스: 쏠배감펭 퀸 (기획서 4.3절)
    /// </summary>
    public class BossLionfishQueen : BossBase
    {
        [Header("Lionfish Patterns")]
        private bool isHidden = false;

        protected override void Awake()
        {
            base.Awake();
            bossNameKo = "쏠배감펭 퀸";
        }

        protected override void UpdateFSM(float dt)
        {
            switch (currentState)
            {
                case BossState.Idle:
                    transform.position = new Vector3(6f + Mathf.Cos(stateTimer * 2f), Mathf.Sin(stateTimer * 3f) * 1.5f, 0f);

                    if (stateTimer >= 2.0f)
                    {
                        currentState = BossState.AttackPattern1;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.AttackPattern1:
                    // 전방위 8방향 독가시 방출
                    FirePoisonSpines();
                    currentState = BossState.SpecialAttack;
                    stateTimer = 0f;
                    break;

                case BossState.SpecialAttack:
                    // 산호초 뒤로 은신
                    if (stateTimer < 2.0f)
                    {
                        SetCloaked(true);
                    }
                    else
                    {
                        SetCloaked(false);
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    if (stateTimer >= 2.5f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }

        private void FirePoisonSpines()
        {
            Debug.Log("[BossLionfishQueen] Poison Spine Burst 360 deg!");
            for (int i = 0; i < 6; i++)
            {
                float angle = i * 60f * Mathf.Deg2Rad;
                Vector3 offset = new Vector3(Mathf.Cos(angle), Mathf.Sin(angle), 0f);
                Managers.SpawnManager.Instance?.SpawnHazardAt(HazardKind.PoisonSpike, transform.position + offset);
            }
        }

        private void SetCloaked(bool cloaked)
        {
            isHidden = cloaked;
            if (bossRenderer != null)
            {
                Color c = bossRenderer.color;
                c.a = cloaked ? 0.2f : 1f;
                bossRenderer.color = c;
            }
        }
    }
}
