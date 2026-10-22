using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Data;
using KillerWhale.Input;

namespace KillerWhale.Entities.Player
{
    /// <summary>
    /// 캐릭터별 수중 물리(가속/관성/마찰/부스트) 및 이동을 총괄하는 컨트롤러
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Character Profile")]
        [SerializeField] private CharacterData currentData;
        public CharacterData CurrentData => currentData;

        [Header("Runtime Physics State")]
        [SerializeField] private Vector2 currentVelocity = Vector2.zero;
        public Vector2 CurrentVelocity => currentVelocity;

        private Rigidbody2D rb;
        private PlayerHitbox hitbox;
        private PlayerSkills skills;

        // 경계 제한 (월드 좌표)
        private float minY = -4.5f;
        private float maxY = 4.5f;
        private float minX = -8.0f;
        private float maxX = 8.0f;

        // 특수 물리 파라미터
        private float pulseTimer = 0f;          // 대왕오징어 펄스 이동용
        private float currentSpeedMultiplier = 1f;
        private bool isNeedleDashing = false;    // 청새치 바늘 돌진 중

        private void Awake()
        {
            rb = GetComponent<Rigidbody2D>();
            hitbox = GetComponent<PlayerHitbox>();
            skills = GetComponent<PlayerSkills>();

            rb.gravityScale = 0f;
            rb.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
            rb.interpolation = RigidbodyInterpolation2D.Interpolate;
        }

        private void Start()
        {
            if (currentData == null)
            {
                // 기본 데이터 적용
                ApplyCharacterData(GameManager.Instance.SelectedCharacter);
            }
        }

        public void ApplyCharacterData(CharacterType type)
        {
            // 동적 로드 또는 기본값 매핑
            if (hitbox != null) hitbox.Initialize(type);
            if (skills != null) skills.Initialize(type);
        }

        public void SetSpeedMultiplier(float multiplier)
        {
            currentSpeedMultiplier = multiplier;
        }

        public void SetNeedleDashing(bool dashing)
        {
            isNeedleDashing = dashing;
        }

        private void FixedUpdate()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing)
            {
                rb.velocity = Vector2.zero;
                return;
            }

            Vector2 moveInput = InputManager.Instance != null ? InputManager.Instance.MoveInput : Vector2.zero;
            bool isJumping = InputManager.Instance != null && InputManager.Instance.IsJumpPressed;

            CalculateUnderwaterPhysics(moveInput, isJumping);
            ClampPositionWithinScreen();
        }

        private void CalculateUnderwaterPhysics(Vector2 input, bool jumping)
        {
            CharacterType type = GameManager.Instance.SelectedCharacter;

            float baseSpeed = 5.0f;
            float drag = 3.0f;
            float boostPower = 6.0f;

            // 1. 캐릭터별 차별화된 물리 파라미터 적용 (기획서 4.1절)
            switch (type)
            {
                case CharacterType.KillerWhale:
                    baseSpeed = 6.5f;
                    drag = 2.8f;        // 표준적이고 부드러운 수중 관성
                    boostPower = 7.5f;
                    break;

                case CharacterType.Shark:
                    baseSpeed = 7.5f;
                    drag = 6.0f;        // 관성 없이 칼 같은 스냅 제동
                    boostPower = 9.0f;
                    break;

                case CharacterType.BlueMarlin:
                    baseSpeed = 9.5f;
                    drag = 1.6f;        // 빠른 최고속도, 미끄러지는 드리프트 관성
                    boostPower = 11.0f;
                    break;

                case CharacterType.GiantSquid:
                    baseSpeed = 4.8f;
                    drag = 3.5f;
                    boostPower = 6.0f;
                    // 대왕오징어 고유: 펄스(Pulse) 단위 추진
                    pulseTimer += Time.fixedDeltaTime;
                    if (input.sqrMagnitude > 0.05f)
                    {
                        float pulseFactor = Mathf.Sin(pulseTimer * 8f);
                        if (pulseFactor > 0f) baseSpeed *= 1.4f;
                    }
                    break;

                case CharacterType.Megalodon:
                    baseSpeed = 4.5f;
                    drag = 1.8f;        // 큰 관성과 묵직한 중량감
                    boostPower = 7.0f;
                    break;
            }

            // 스킬에 의한 이동속도 가산 적용
            baseSpeed *= currentSpeedMultiplier;

            if (isNeedleDashing)
            {
                // 청새치 Needle Dash 전방 순간 돌진
                rb.velocity = new Vector2(16.0f, input.y * 5f);
                return;
            }

            // 목표 속도 계산
            Vector2 targetVel = input * baseSpeed;

            if (jumping)
            {
                // 점프 입력 시 수직/사선 부스트 가산
                targetVel.y += boostPower;
                targetVel.x += boostPower * 0.35f; // 전방 약한 가속
            }

            // 가속도 보간 (Smooth Drag & Acceleration)
            currentVelocity = Vector2.MoveTowards(rb.velocity, targetVel, drag * 10f * Time.fixedDeltaTime);
            rb.velocity = currentVelocity;

            // 캐릭터 회전 각도 틸팅 (이동 방향에 따른 역동적 헤엄 애니메이션)
            float targetAngle = Mathf.Clamp(rb.velocity.y * 3.5f, -30f, 35f);
            transform.rotation = Quaternion.Euler(0f, 0f, targetAngle);
        }

        private void ClampPositionWithinScreen()
        {
            Vector3 pos = transform.position;
            pos.x = Mathf.Clamp(pos.x, minX, maxX);
            pos.y = Mathf.Clamp(pos.y, minY, maxY);
            transform.position = pos;
        }

        public void BounceBack(Vector2 hitNormal)
        {
            rb.velocity = -hitNormal * 6f;
        }
    }
}
