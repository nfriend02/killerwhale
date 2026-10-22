using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Entities.Prey;
using KillerWhale.Entities.Hazards;
using KillerWhale.Managers;

namespace KillerWhale.Entities.Player
{
    /// <summary>
    /// 캐릭터별 피격 히트박스 판정 및 먹이 자력(Magnet) 흡입 처리 (기획서 4.1절)
    /// </summary>
    public class PlayerHitbox : MonoBehaviour
    {
        [Header("Radii Configuration")]
        [SerializeField] private float hitboxRadius = 1.0f;
        [SerializeField] private float magnetRadius = 3.0f;

        [Header("Layer Masks")]
        [SerializeField] private LayerMask preyLayer;
        [SerializeField] private LayerMask hazardLayer;

        private CircleCollider2D circleCol;
        private SpriteRenderer spriteRenderer;
        private PlayerSkills playerSkills;
        private PlayerController playerController;

        // GC 예방을 위한 버퍼 (기획서 5절 모바일 최적화 지침)
        private static readonly Collider2D[] hitBuffer = new Collider2D[16];

        private void Awake()
        {
            circleCol = GetComponent<CircleCollider2D>();
            spriteRenderer = GetComponentInChildren<SpriteRenderer>();
            playerSkills = GetComponent<PlayerSkills>();
            playerController = GetComponent<PlayerController>();

            if (circleCol == null)
            {
                circleCol = gameObject.AddComponent<CircleCollider2D>();
                circleCol.isTrigger = true;
            }
        }

        public void Initialize(CharacterType type)
        {
            // 캐릭터별 히트박스 & 자력 반경 매핑 (기획서 4.1절)
            switch (type)
            {
                case CharacterType.KillerWhale:
                    hitboxRadius = 1.4f;
                    magnetRadius = 4.2f;
                    break;
                case CharacterType.Shark:
                    hitboxRadius = 1.1f;
                    magnetRadius = 2.8f;
                    break;
                case CharacterType.BlueMarlin:
                    hitboxRadius = 0.95f;
                    magnetRadius = 1.5f;
                    break;
                case CharacterType.GiantSquid:
                    hitboxRadius = 1.3f;
                    magnetRadius = 6.5f;    // 강력한 흡입
                    break;
                case CharacterType.Megalodon:
                    hitboxRadius = 1.8f;    // 매우 큼
                    magnetRadius = 5.5f;
                    break;
            }

            if (circleCol != null)
            {
                circleCol.radius = hitboxRadius;
            }
        }

        private void Update()
        {
            // 무적 깜빡임 연출
            if (GameManager.Instance != null && GameManager.Instance.IsInvincible)
            {
                if (spriteRenderer != null)
                {
                    float alpha = Mathf.PingPong(Time.time * 12f, 1f) > 0.4f ? 1f : 0.2f;
                    Color c = spriteRenderer.color;
                    c.a = alpha;
                    spriteRenderer.color = c;
                }
            }
            else
            {
                if (spriteRenderer != null && spriteRenderer.color.a < 1f)
                {
                    Color c = spriteRenderer.color;
                    c.a = 1f;
                    spriteRenderer.color = c;
                }
            }

            // 먹이 자력 흡입 처리 (Non-Alloc OverlapCircle)
            DetectAndAttractPrey();
        }

        private void DetectAndAttractPrey()
        {
            int count = Physics2D.OverlapCircleNonAlloc(transform.position, magnetRadius, hitBuffer);
            for (int i = 0; i < count; i++)
            {
                var col = hitBuffer[i];
                if (col == null) continue;

                var prey = col.GetComponent<PreyItem>();
                if (prey != null && !prey.IsCollected)
                {
                    prey.AttractToward(transform.position, 12f);
                }
            }
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            HandleCollision(other.gameObject);
        }

        private void OnCollisionEnter2D(Collision2D collision)
        {
            HandleCollision(collision.gameObject);
        }

        private void HandleCollision(GameObject otherObj)
        {
            // 1. 먹이 접촉
            var prey = otherObj.GetComponent<PreyItem>();
            if (prey != null && !prey.IsCollected)
            {
                prey.Collect();
                playerSkills?.OnPreyCollected();
                return;
            }

            // 2. 장애물 접촉
            var hazard = otherObj.GetComponent<HazardBase>();
            if (hazard != null)
            {
                // 메갈로돈 Apex Armor 스킬 또는 청새치 Needle Dash 스킬로 파괴 가능한지 체크
                if (playerSkills != null && playerSkills.CanDestroyHazard(hazard))
                {
                    hazard.DestroyByPlayerSkill();
                    return;
                }

                // 대왕오징어 Ink Screen 자동 방어 체크
                if (playerSkills != null && playerSkills.TryTriggerInkScreen())
                {
                    return;
                }

                // 일반 피격
                GameManager.Instance.TakeDamage(hazard.Damage);
                if (playerController != null)
                {
                    Vector2 normal = (transform.position - otherObj.transform.position).normalized;
                    playerController.BounceBack(normal);
                }
                playerSkills?.OnPlayerHit();
            }
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, hitboxRadius);

            Gizmos.color = Color.cyan;
            Gizmos.DrawWireSphere(transform.position, magnetRadius);
        }
    }
}
