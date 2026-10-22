using System;
using UnityEngine;
using KillerWhale.Core;

namespace KillerWhale.Input
{
    /// <summary>
    /// 모바일 양손 엄지 터치(가상 점프 & D-Pad) 및 PC 키보드 입력을 통합 관리하는 입력 시스템
    /// </summary>
    public class InputManager : MonoBehaviour
    {
        public static InputManager Instance { get; private set; }

        [Header("Movement Output")]
        [SerializeField] private Vector2 moveInput = Vector2.zero;
        public Vector2 MoveInput => moveInput;

        [Header("Jump / Boost Output")]
        [SerializeField] private bool isJumpPressed = false;
        [SerializeField] private bool isJumpTriggered = false;
        public bool IsJumpPressed => isJumpPressed;
        public bool IsJumpTriggered => isJumpTriggered;

        // 커스텀 오프셋 및 설정
        public ControlOffsetData ControlOffset => SaveSystem.Data.controlOffset;

        // 이벤트 콜백
        public event Action OnJumpDown;
        public event Action OnJumpUp;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Update()
        {
            isJumpTriggered = false;

            // 1. PC 키보드 입력 처리
            float h = UnityEngine.Input.GetAxisRaw("Horizontal");
            float v = UnityEngine.Input.GetAxisRaw("Vertical");

            bool keyJump = UnityEngine.Input.GetKey(KeyCode.Space) || UnityEngine.Input.GetKey(KeyCode.W) || UnityEngine.Input.GetKey(KeyCode.UpArrow);
            bool keyJumpDown = UnityEngine.Input.GetKeyDown(KeyCode.Space) || UnityEngine.Input.GetKeyDown(KeyCode.W) || UnityEngine.Input.GetKeyDown(KeyCode.UpArrow);
            bool keyJumpUp = UnityEngine.Input.GetKeyUp(KeyCode.Space) || UnityEngine.Input.GetKeyUp(KeyCode.W) || UnityEngine.Input.GetKeyUp(KeyCode.UpArrow);

            if (Mathf.Abs(h) > 0.01f || Mathf.Abs(v) > 0.01f)
            {
                moveInput = new Vector2(h, v).normalized;
            }

            if (keyJumpDown)
            {
                TriggerJumpDown();
            }
            if (keyJumpUp)
            {
                TriggerJumpUp();
            }

            if (keyJump)
            {
                isJumpPressed = true;
            }
        }

        // --- 모바일 가상 조작 콜백 ---

        public void SetVirtualMoveInput(Vector2 input)
        {
            // 데드존 (0.15f)
            if (input.sqrMagnitude < 0.0225f)
            {
                moveInput = Vector2.zero;
            }
            else
            {
                moveInput = input.normalized;
            }
        }

        public void TriggerJumpDown()
        {
            isJumpPressed = true;
            isJumpTriggered = true;
            OnJumpDown?.Invoke();
        }

        public void TriggerJumpUp()
        {
            isJumpPressed = false;
            OnJumpUp?.Invoke();
        }

        public void SetControlOffset(float jumpX, float jumpY, float dpadX, float dpadY, float opacity, float scale)
        {
            var offset = SaveSystem.Data.controlOffset;
            offset.jumpX = jumpX;
            offset.jumpY = jumpY;
            offset.dpadX = dpadX;
            offset.dpadY = dpadY;
            offset.opacity = Mathf.Clamp(opacity, 0.2f, 1.0f);
            offset.scale = Mathf.Clamp(scale, 0.8f, 1.2f);

            SaveSystem.Save();
        }
    }
}
