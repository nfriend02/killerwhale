using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Entities.Hazards
{
    /// <summary>
    /// 잠수함의 유도 어뢰 및 사냥꾼의 작살 탄도 (기획서 7절 및 12절)
    /// </summary>
    public class SubmarineMissile : HazardBase
    {
        [Header("Homing Missile Properties")]
        [SerializeField] private float homingRotateSpeed = 90f; // 초당 회전 각도
        [SerializeField] private float homingDuration = 3.5f;   // 유도 추적 지속 시간
        [SerializeField] private bool canDamageBossOnReflect = true;

        private Transform playerTarget;
        private float homingTimer = 0f;
        private bool isReflected = false;

        protected override void Awake()
        {
            base.Awake();
            kind = HazardKind.Torpedo;
            collisionType = CollisionType.Hazard;
        }

        public override void OnSpawnFromPool()
        {
            base.OnSpawnFromPool();
            homingTimer = 0f;
            isReflected = false;

            // 플레이어 타깃 탐색
            var player = GameObject.FindWithTag("Player");
            if (player != null)
            {
                playerTarget = player.transform;
            }
        }

        protected override void Update()
        {
            float dt = Time.deltaTime;
            homingTimer += dt;

            // 유도 비행 처리
            if (playerTarget != null && homingTimer < homingDuration && !isReflected)
            {
                Vector2 dir = (playerTarget.position - transform.position).normalized;
                float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
                Quaternion targetRot = Quaternion.Euler(0f, 0f, angle + 180f);
                transform.rotation = Quaternion.RotateTowards(transform.rotation, targetRot, homingRotateSpeed * dt);
            }

            // 앞 방향으로 직진
            float speed = baseMoveSpeed * currentSpeedMultiplier;
            transform.Translate(Vector3.left * speed * dt, Space.Self);

            // 화면 이탈 검사
            if (transform.position.x < -15f || transform.position.x > 15f ||
                transform.position.y < -8f || transform.position.y > 8f)
            {
                ReturnToPool();
            }
        }

        public void ReflectTowardBoss(Transform bossTarget)
        {
            isReflected = true;
            if (bossTarget != null)
            {
                Vector2 dir = (bossTarget.position - transform.position).normalized;
                float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
                transform.rotation = Quaternion.Euler(0f, 0f, angle + 180f);
            }
            baseMoveSpeed *= 1.5f;
        }

        private void OnTriggerEnter2D(Collider2D collision)
        {
            if (isReflected && collision.CompareTag("Boss"))
            {
                // 보스에 역충돌 데미지
                var boss = collision.GetComponent<Boss.BossBase>();
                boss?.TakeDamage(15);
                ReturnToPool();
            }
        }
    }
}
