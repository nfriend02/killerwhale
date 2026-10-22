using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;

namespace KillerWhale.Entities.Hazards
{
    /// <summary>
    /// 장애물 및 적 유닛의 공통 추상/기반 클래스 (기획서 8절, 12절)
    /// </summary>
    public class HazardBase : MonoBehaviour, IPoolable
    {
        [Header("Hazard Properties")]
        [SerializeField] protected HazardKind kind = HazardKind.Rock;
        [SerializeField] protected CollisionType collisionType = CollisionType.Hazard;
        [SerializeField] protected int damage = 1;
        [SerializeField] protected float baseMoveSpeed = 3.5f;

        [Header("Movement Behavior")]
        [SerializeField] protected bool movesLeft = true;
        [SerializeField] protected bool hasSineWaveY = false;
        [SerializeField] protected float sineFrequency = 2f;
        [SerializeField] protected float sineAmplitude = 1.2f;

        protected float currentSpeedMultiplier = 1f;
        protected float slowTimer = 0f;
        protected float lifetime = 0f;
        protected Vector3 initialPos;

        public HazardKind Kind => kind;
        public CollisionType CollisionType => collisionType;
        public int Damage => damage;

        protected virtual void Awake()
        {
            initialPos = transform.position;
        }

        protected virtual void Update()
        {
            float dt = Time.deltaTime;

            // 1. 대왕오징어 먹물 감속 타이머 처리
            if (slowTimer > 0f)
            {
                slowTimer -= dt;
                if (slowTimer <= 0f) currentSpeedMultiplier = 1f;
            }

            // 2. 이동 로직
            lifetime += dt;
            float speed = baseMoveSpeed * currentSpeedMultiplier;

            Vector3 move = Vector3.zero;
            if (movesLeft)
            {
                move.x -= speed * dt;
            }

            if (hasSineWaveY)
            {
                move.y = Mathf.Sin(lifetime * sineFrequency) * sineAmplitude * dt;
            }

            transform.position += move;

            // 3. 화면 좌측 벗어나면 풀 반환
            if (transform.position.x < -15f || transform.position.y < -8f || transform.position.y > 8f)
            {
                ReturnToPool();
            }
        }

        public void ApplySlow(float duration, float multiplier)
        {
            slowTimer = duration;
            currentSpeedMultiplier = multiplier;
        }

        public virtual void DestroyByPlayerSkill()
        {
            // 스킬에 의해 파괴될 때 파티클 및 풀 반환
            ReturnToPool();
        }

        public virtual void OnSpawnFromPool()
        {
            lifetime = 0f;
            currentSpeedMultiplier = 1f;
            slowTimer = 0f;
            gameObject.SetActive(true);
        }

        public virtual void OnReturnToPool()
        {
            gameObject.SetActive(false);
        }

        protected virtual void ReturnToPool()
        {
            if (ObjectPool.Instance != null)
            {
                ObjectPool.Instance.Despawn(gameObject.name.Replace("(Clone)", "").Trim(), gameObject);
            }
            else
            {
                gameObject.SetActive(false);
            }
        }
    }
}
