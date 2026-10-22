using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Boss.StageBosses
{
    /// <summary>
    /// Stage 1 보스: 사냥꾼 포획 모선 '헤파이토스 호' & 탐사 드론 (기획서 4.3절)
    /// </summary>
    public class BossHephaestus : BossBase
    {
        [Header("Hephaestus Components")]
        [SerializeField] private float droneSpawnInterval = 3.0f;
        private float droneTimer = 0f;

        protected override void Awake()
        {
            base.Awake();
            bossNameKo = "헤파이토스 호 & 탐사 드론";
        }

        protected override void UpdateFSM(float dt)
        {
            droneTimer += dt;

            switch (currentState)
            {
                case BossState.Idle:
                    // 수면 부근에서 좌우 천천히 패트롤
                    transform.position = new Vector3(6f + Mathf.Sin(stateTimer * 1.5f) * 1.5f, 3.2f, 0f);

                    if (stateTimer >= 2.5f)
                    {
                        currentState = BossState.AttackPattern1;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.AttackPattern1:
                    // 드론 작살 투하 패턴
                    if (droneTimer >= droneSpawnInterval)
                    {
                        droneTimer = 0f;
                        SpawnHarpoonDrone();
                    }

                    if (stateTimer >= 5.0f)
                    {
                        currentState = BossState.WeakPhase;
                        stateTimer = 0f;
                    }
                    break;

                case BossState.WeakPhase:
                    // 바위 충돌 유도 타이밍: 방어막 약화
                    if (stateTimer >= 3.0f)
                    {
                        currentState = BossState.Idle;
                        stateTimer = 0f;
                    }
                    break;
            }
        }

        private void SpawnHarpoonDrone()
        {
            Debug.Log("[BossHephaestus] Drone Harpoon Launched!");
            // 스포너를 통해 드론 또는 작살 발사
            Managers.SpawnManager.Instance?.SpawnHazardAt(HazardKind.Harpoon, transform.position + Vector3.down * 1.2f);
        }
    }
}
