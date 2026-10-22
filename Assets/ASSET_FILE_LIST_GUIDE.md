# 📁 범고래 (Killer Whale) 에셋 파일 배치 폴더 및 규격 가이드

본 폴더(`assets/` 및 Unity용 `Assets/Art/`)는 사용자가 생성한 동영상과 UX 이미지를 배치하면 **인게임 코드에서 자동으로 감지하여 즉시 렌더링하도록 연동**되어 있습니다.

---

## 🎥 1. 인트로 동영상 (`assets/video/` 또는 `Assets/Art/Video/`)

* **권장 파일명**: `intro_6s.mp4` (또는 `intro.mp4`)
* **Firebase Storage & 모바일 최적화 규격**:
  * **해상도**: **1280 × 720** (16:9 가로 모드 표준, 모바일 노치/펀치홀 전 화면 대응)
  * **코덱**: **H.264 (Video) + AAC (Audio)** (모든 모바일 브라우저, iOS Safari, Android Chrome, Unity WebGL 100% 호환)
  * **재생 시간**: **6.0초** (기획서 6.1절 Sora 시나리오)
  * **프레임레이트**: **30 fps** (또는 60 fps)
  * **타깃 비트레이트**: **1.5 Mbps ~ 2.5 Mbps** (VBR 1-Pass / 2-Pass)
  * **목표 파일 크기**: **약 1.2MB ~ 1.8MB** (2MB 미만 엄수)
    > 💡 **Firebase 최적화 이유**: 6초 영상이 2MB 미만일 경우 Firebase Storage 무료 대역폭(월 1GB)에서도 수천 회 재생 가능하며, 모바일 LTE/5G 통신망에서 로딩 지연(Buffering) 없이 0.1초 만에 즉시 스트리밍 재생됩니다.

---

## 🎨 2. 게임 메인 첫화면 (`assets/title/` 또는 `Assets/Art/Title/`)

* **권장 파일명**: `title_bg.png` (또는 `title_bg.jpg`)
* **규격**: **1280 × 720** 또는 **1920 × 1080** (16:9 가로)
* **내용**: 수면 햇살(God Rays)이 내리쬐는 심해를 헤엄치는 3D 범고래 타이틀 키아트
* **용도**: 게임 시작 타이틀 화면 배경 텍스처로 자동 반영

---

## ⚙️ 3. 게임 Settings Modal 화면 (`assets/settings/` 또는 `Assets/Art/Settings/`)

* **권장 파일명**: `settings_modal_bg.png`
* **규격**: **800 × 540** 내외 (반투명 PNG / 글래스모피즘 샌드블라스트 유리 질감)
* **용도**: 인게임 및 메인 화면의 환경 설정(목숨 선택, 사운드, 조작키 커스텀) 팝업창 배경

---

## 🌊 4. 스테이지별 5개 배경 이미지 (`assets/stages/` 또는 `Assets/Art/Stages/`)

5개 스테이지의 대표 컬러와 분위기에 맞춘 횡스크롤 심리스 파라락스 배경입니다:

| 스테이지 | 권장 파일명 | 대표 컬러 | 콘셉트 | 권장 해상도 |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1 (태평양)** | `stage1_pacific.png` | `#00B4D8` | 에메랄드 수면 햇살, 투명한 바다 | 1920 × 1080 (Seamless) |
| **Stage 2 (남극)** | `stage2_antarctic.png` | `#0077B6` | 서늘한 아이스 블루, 거대 유빙과 오로라 광선 | 1920 × 1080 (Seamless) |
| **Stage 3 (열대산호초)** | `stage3_tropical_reef.png`| `#FF007F` | 핫핑크, 자줏빛 네온 산호 미로 | 1920 × 1080 (Seamless) |
| **Stage 4 (대서양심해)** | `stage4_atlantic_deep.png` | `#0B090A` | 미드나잇 칠흑, 난파선 잔해와 서치라이트 | 1920 × 1080 (Seamless) |
| **Stage 5 (마리아나해구)**| `stage5_mariana_trench.png`| `#DC2F02` | 보랏빛 암흑, 붉은 마그마 열수구 분출 | 1920 × 1080 (Seamless) |

---

## 🏆 5. 게임 결과 화면 (`assets/results/` 또는 `Assets/Art/Results/`)

* **권장 파일명**: `result_bg.png`
* **규격**: **840 × 580** 내외 (또는 1280 × 720)
* **내용**: STAGE CLEAR / GAME OVER 빅토리 카드 배경 (골드 네온 포인트, 물보라 효과)
* **용도**: 스테이지 정산, 등급 별(★1~3), 획득한 먹이 10종 리포트 창 배경

---

## 📱 6. 모바일 & 데스크톱 앱 아이콘 (`assets/icons/` 또는 `Assets/Art/Icons/`)

* **모바일 스퀘어 아이콘**: `app_icon_mobile.png`
  * **규격**: **1024 × 1024** (1:1 비율, 모바일 스퀘어클 형태)
  * **내용**: 물보라와 네온 시안 잔상을 남기며 도약하는 역동적인 3D 범고래
* **데스크톱 원형 엠블럼 아이콘**: `app_icon_desktop.png`
  * **규격**: **1024 × 1024** (1:1 비율, 원형 3D 메탈릭 엠블럼, 투명 배경 PNG)
  * **내용**: 소용돌이 물살을 가르는 범고래 지느러미 메탈 배지
