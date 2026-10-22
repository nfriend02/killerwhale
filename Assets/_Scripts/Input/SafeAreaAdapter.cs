using UnityEngine;

namespace KillerWhale.Input
{
    /// <summary>
    /// 모바일 기기 노치/펀치홀 및 홈 인디케이터에 맞추어 UI 캔버스 안전 구역(Safe Area)을 자동 조정 (기획서 15.1절)
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    public class SafeAreaAdapter : MonoBehaviour
    {
        private RectTransform targetRect;
        private Rect lastSafeArea = Rect.zero;
        private Vector2Int lastScreenSize = Vector2Int.zero;
        private ScreenOrientation lastOrientation = ScreenOrientation.AutoRotation;

        [Header("Manual Fallback Padding (pt)")]
        [SerializeField] private float minHorizontalPadding = 44f; // 좌우 44pt
        [SerializeField] private float minVerticalPadding = 16f;   // 상하 16pt

        private void Awake()
        {
            targetRect = GetComponent<RectTransform>();
            ApplySafeArea();
        }

        private void Update()
        {
            if (lastSafeArea != Screen.safeArea ||
                lastScreenSize.x != Screen.width ||
                lastScreenSize.y != Screen.height ||
                lastOrientation != Screen.orientation)
            {
                ApplySafeArea();
            }
        }

        private void ApplySafeArea()
        {
            if (targetRect == null) return;

            Rect safeArea = Screen.safeArea;
            lastSafeArea = safeArea;
            lastScreenSize = new Vector2Int(Screen.width, Screen.height);
            lastOrientation = Screen.orientation;

            // 정규화된 앵커 계산 (0.0 ~ 1.0)
            Vector2 anchorMin = safeArea.position;
            Vector2 anchorMax = safeArea.position + safeArea.size;

            anchorMin.x /= Screen.width;
            anchorMin.y /= Screen.height;
            anchorMax.x /= Screen.width;
            anchorMax.y /= Screen.height;

            // 최소 패딩 보장
            float normMinH = minHorizontalPadding / Screen.width;
            float normMinV = minVerticalPadding / Screen.height;

            anchorMin.x = Mathf.Max(anchorMin.x, normMinH);
            anchorMin.y = Mathf.Max(anchorMin.y, normMinV);
            anchorMax.x = Mathf.Min(anchorMax.x, 1f - normMinH);
            anchorMax.y = Mathf.Min(anchorMax.y, 1f - normMinV);

            targetRect.anchorMin = anchorMin;
            targetRect.anchorMax = anchorMax;
            targetRect.offsetMin = Vector2.zero;
            targetRect.offsetMax = Vector2.zero;
        }
    }
}
