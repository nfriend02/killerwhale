using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Boss.StageBosses
{
    /// <summary>
    /// Stage 2 보스: 고대 아이스 크라켄 (기획서 4.3절)
    /// </summary>
    public class BossIceKraken : BossBase
    {
        [Header("Kraken Pattern")]
        [SerializeField] private LineRenderer warningLine;
        private float attackCycle = 0f;

        protected override void Awake()
        {
            base.Awake();
            bossNameKo = "고대 아이스 크라켄";
        }

        protected override void UpdateFSM(float dt)
        {
            attackCycle += dt;

            switch (currentState)
            {
                case BossState.Idle:
                    // 심해에서 꿈틀거리는 상하 펄스 모션
                    transform.position = new Vector3(6.5f, Mathf.Sin(stateTimer * 2f) * 2.0f, 0f);

                    if (stateTimer >= 2.0f)
                    {
                        currentState = BossState.AttackPattern1;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.AttackPattern1:
                    // 붉은 경고선 가이드 활성화 후 촉수 공격
                    if (stateTimer < 1.0f)
                    {
                        ShowWarningLine(true);
                    }
                    else if (stateTimer < 2.5f)
                    {
                        ShowWarningLine(false);
                        PerformTentacleStrike();
                    }
                    else
                    {
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    // 촉수 회수 후 약점 노출
                    if (stateTimer >= 2.5f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }

        private void ShowWarningLine(bool show)
        {
            if (warningLine != null) warningLine.enabled = show;
        }

        private void PerformTentacleStrike()
        {
            // 상하단 촉수 출현
            Managers.SpawnManager.Instance?.SpawnHazardAt(HazardKind.FallingIce, new Vector3(Random.Range(-2f, 4f), 5f, 0f));
        }
    }
}
