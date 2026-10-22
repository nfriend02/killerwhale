using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Boss.StageBosses
{
    /// <summary>
    /// Stage 4 보스: 군용 스텔스 잠수함 '네모-X' (기획서 4.3절)
    /// </summary>
    public class BossNemoX : BossBase
    {
        [Header("Nemo-X Stealth System")]
        [SerializeField] private Light searchLight;
        private float torpedoInterval = 2.5f;
        private float torpedoTimer = 0f;

        protected override void Awake()
        {
            base.Awake();
            bossNameKo = "스텔스 잠수함 네모-X";
        }

        protected override void UpdateFSM(float dt)
        {
            torpedoTimer += dt;

            switch (currentState)
            {
                case BossState.Idle:
                    transform.position = new Vector3(6f, Mathf.Sin(stateTimer * 1.2f) * 2.2f, 0f);

                    if (stateTimer >= 2.0f)
                    {
                        currentState = BossState.AttackPattern1;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.AttackPattern1:
                    // 유도 어뢰 발사
                    if (torpedoTimer >= torpedoInterval)
                    {
                        torpedoTimer = 0f;
                        LaunchHomingTorpedo();
                    }

                    if (stateTimer >= 4.0f)
                    {
                        currentState = BossState.SpecialAttack;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.SpecialAttack:
                    // 스텔스 모드 진입 (서치라이트만 켜고 본체 반투명)
                    if (bossRenderer != null)
                    {
                        Color c = bossRenderer.color;
                        c.a = 0.15f;
                        bossRenderer.color = c;
                    }

                    if (stateTimer >= 3.5f)
                    {
                        if (bossRenderer != null)
                        {
                            Color c = bossRenderer.color;
                            c.a = 1f;
                            bossRenderer.color = c;
                        }
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    // 역충돌 유도 가능 취약 구간
                    if (stateTimer >= 3.0f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }

        private void LaunchHomingTorpedo()
        {
            Managers.SpawnManager.Instance?.SpawnHazardAt(HazardKind.Torpedo, transform.position + Vector3.left * 1.5f);
        }
    }
}
