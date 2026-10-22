# 🐋 [기획서 & 개발 아트북] 횡스크롤 모바일 미니게임: 범고래 (Killer Whale)

> **Document Version**: 1.0.0  
> **Target Platform**: Mobile (Landscape / iOS & Android) & Desktop  
> **Core Theme**: Neon Oceanic Speed Arcade  

---

## 📋 목차 (Table of Contents)
1. [프로젝트 개요 (Project Overview)](#1-프로젝트-개요-project-overview)
2. [조작 방식 및 UI/UX 레이아웃 (Control Scheme & UI/UX)](#2-조작-방식-및-uiux-레이아웃-control-scheme--uiux)
3. [게임 코어 메커니즘 & 규칙 (Core Game Mechanics & Rules)](#3-게임-코어-메커니즘--규칙-core-game-mechanics--rules)
4. [주인공 캐릭터 & 전용 먹이 아이템 10종 (Characters & Prey Items)](#4-주인공-캐릭터--전용-먹이-아이템-10종-characters--prey-items)
5. [적 & 장애물 요소 (Enemies & Hazards)](#5-적--장애물-요소-enemies--hazards)
6. [스테이지 구성 & 시각 아트 시나리오 (5 Stages & Visual Scenarios)](#6-스테이지-구성--시각-아트-시나리오-5-stages--visual-scenarios)
7. [스테이지별 보스전 & 특수 이벤트 (Boss Fights & Special Events)](#7-스테이지별-보스전--특수-이벤트-boss-fights--special-events)
8. [캐릭터별 스탯, 물리 조작감 & 밸런스 설계 (Stats, Physics & Balance)](#8-캐릭터별-스탯-물리-조작감--밸런스-설계-stats-physics--balance)
9. [콤보 시스템 구조 (Combo System Architecture)](#9-콤보-시스템-구조-combo-system-architecture)
10. [인게임 UI 레이아웃 정밀 시안 (In-Game UI Specifications)](#10-인게임-ui-레이아웃-정밀-시안-in-game-ui-specifications)
11. [디자인 종합 아트북 & AI 생성 프롬프트 (Design Artbook & AI Prompts)](#11-디자인-종합-아트북--ai-생성-프롬프트-design-artbook--ai-prompts)
12. [Unity & Unreal 엔진 모바일 개발 최적화 가이드 (Engine Optimization Guide)](#12-unity--unreal-엔진-모바일-개발-최적화-가이드-engine-optimization-guide)

---

## 1. 프로젝트 개요 (Project Overview)

* **게임 제목**: **범고래 (Killer Whale)**
* **장르**: 횡스크롤 해양 아케이드 / 도지(Dodge) & 컬렉션 미니게임
* **플랫폼**: 모바일 (가로 화면 최적화, 16:9 ~ 20:9 대응) & 데스크톱 지원
* **타깃 유저**: 직관적인 양손 엄지 조작으로 짧은 시간 동안 빠르고 박진감 넘치는 액션을 즐기는 캐주얼/아케이드 유저
* **핵심 루프 (Core Loop)**:
  1. 왼쪽에서 오른쪽으로 자동/수동 진행
  2. 다채로운 장애물(바위, 그물, 잠수함, 사냥꾼, 라이벌)을 피하기
  3. 캐릭터별 고유 전용 먹이 아이템(10종)을 포식하여 포인트 및 콤보 스코어 경신
  4. 5개 해양 스테이지 및 보스전을 클리어하며 최고 기록 달성

---

## 2. 조작 방식 및 UI/UX 레이아웃 (Control Scheme & UI/UX)

모바일 기기를 양손 손바닥 위에 올려놓았을 때 가장 인체공학적으로 편안한 **양손 엄지 대각선 배치**를 적용합니다.

```
+---------------------------------------------------------------------------------+
| [Safe Area Left: 44pt]                                    [Safe Area Right: 44pt]|
| [≡]  (♥)(♥)(♥)(♡)       [ === Stage 1: Pacific (45%) 🐬===> ]      SCORE: 012,450 |
| PAUSE LIVES (3/4)                                                   COMBO x12!  |
+---------------------------------------------------------------------------------+
|                                                                                 |
|   <--- [배경: 3단계 파라랙스 수중 스크롤 Layer] --->                             |
|                                                                                 |
|               [!] WARNING                                                       |
|               (어뢰 접근)                                                       |
|                                🐬 (범고래) ---->   🍤 🐟 🦑                      |
|                                                  (먹이 아이콘)                  |
|                      🪨 (바위)          🕸️ (그물)                                |
|                                                                                 |
+---------------------------------------------------------------------------------+
|  [LEFT THUMB ZONE]                                        [RIGHT THUMB ZONE]    |
|   +----------------+                                     +------------------+   |
|   |   ( O JUMP )   |                                     |       ( ▲ )      |   |
|   |  [점프 부스트]  |                                     |   ( ◄  ▼  ► )    |   |
|   +----------------+                                     |     [D-PAD]      |   |
|   (Center: X:8%, Y:12%)                                  +------------------+   |
|                                                          (Center: X:88%, Y:10%)  |
+---------------------------------------------------------------------------------+
```

* **왼손 엄지**: **JUMP 버튼 (점프/부스트)**
  * 순간적인 수중 수직/사선 상승 및 부스트 회피 담당.
* **오른손 엄지**: **4방향 D-Pad (상/하/좌/우 화살표)**
  * 정밀한 수중 세로/가로 이동 및 적 회피 조작 담당.
* **상단 HUD 바**:
  * **좌측**: 일시정지(`[≡]`) 버튼, 설정된 남은 목숨(`LIVES 3~6개`) 아이콘.
  * **중앙**: 스테이지 진행 프로그레스 바 (`Stage Progress Bar`) 및 현재 위치 핀.
  * **우측**: 실시간 점수 (`SCORE`) 및 연속 포식 배율 (`COMBO`).

---

## 3. 게임 코어 메커니즘 & 규칙 (Core Game Mechanics & Rules)

### 3.1. 생명력 및 설정 (Lives System)
* **목숨 수 설정 (3회 ~ 6회)**: 옵션 메뉴에서 플레이어가 게임 시작 전 목숨 수를 **3회, 4회, 5회, 6회 중 선택** 가능.
* **피격 판정 & 무적 시간**:
  * 장애물/적과 충돌 시 목숨 1회가 차감되며, 화면 테두리에 붉은 비네팅 효과가 발생합니다.
  * 피격 직후 **1.5초간 깜빡이는 무적 시간(Invincibility Frame)**이 부여되어 연속 피격을 방지합니다.
* **게임 오버**: 설정된 목숨을 모두 소진하면 수중 아래로 가라앉는 연출과 함께 결과 화면으로 이동합니다.

### 3.2. 점수 및 콤보 시스템
* 필드에 등장하는 먹이 아이템 획득 시 포인트를 얻습니다.
* **2.0초 이내**에 다음 먹이를 먹으면 **콤보(Combo Multiplier)**가 쌓이며, 최대 x3.0 배율의 **FEVER MODE**가 발동됩니다.

---

## 4. 주인공 캐릭터 & 전용 먹이 아이템 10종 (Characters & Prey Items)

총 5종의 주인공 캐릭터가 존재하며, 각 캐릭터의 생태/콘셉트에 맞춘 **전용 먹이 아이템 10종**이 필드에 고유하게 생성됩니다.

| 캐릭터 | 특성 콘셉트 | 전용 먹이 아이템 10종 |
| :--- | :--- | :--- |
| **범고래** *(Killer Whale)* | **올라운더 / 밸런스형** (기본 캐릭터) | 1. 물개 <br> 2. 연어 <br> 3. 바다표범 <br> 4. 펭귄 <br> 5. 청어 <br> 6. 가오리 <br> 7. 바다사자 <br> 8. 오징어 <br> 9. 왕바다표범 <br> 10. 정어리 떼 |
| **상어** *(Shark)* | **기습 / 속도 특화형** | 1. 참치 <br> 2. 고등어 <br> 3. 바다거북 <br> 4. 정어리 <br> 5. 방어 <br> 6. 꽁치 <br> 7. 삼치 <br> 8. 날치 <br> 9. 갑각류(게) <br> 10. 쥐치 |
| **청새치** *(Blue Marlin)* | **초고속 직진 / 돌진형** | 1. 무늬오징어 <br> 2. 만새기 <br> 3. 날치 <br> 4. 멸치 떼 <br> 5. 삼치 <br> 6. 고등어 <br> 7. 전갱이 <br> 8. 청새치 치어 <br> 9. 꽁치 <br> 10. 바다새 |
| **대왕오징어** *(Giant Squid)* | **심해 / 특수 궤적 유연형** | 1. 심해어 <br> 2. 랜턴피시 <br> 3. 심해 새우 <br> 4. 갯지렁이 <br> 5. 갑오징어 <br> 6. 명태 <br> 7. 대구 <br> 8. 심해 게 <br> 9. 암모나이트 <br> 10. 크릴새우 떼 |
| **메갈로돈** *(Megalodon)* | **고대 파워 / 돌파형** | 1. 고대 고래 <br> 2. 대형 바다거북 <br> 3. 대형 매너티 <br> 4. 바다사자 떼 <br> 5. 대형 참치 <br> 6. 대형 가오리 <br> 7. 고대 상어 <br> 8. 해양 파충류 <br> 9. 향고래 <br> 10. 고대 다랑어 |

---

## 5. 적 & 장애물 요소 (Enemies & Hazards)

충돌 시 목숨이 1회 차감되는 위협 요소입니다.

1. **바위 (Rocks)**: 고정 지형 구조물 및 해저에서 무너져 내리는 아치형 암석.
2. **그물 (Nets)**: 넓은 수중 구역을 차단하며 상하로 천천히 부유하는 장애물.
3. **잠수함 (Submarines)**: 일정 간격으로 유도 어뢰를 발사하거나 직진 이동하는 기계식 적.
4. **인간 잠수부 사냥꾼 (Human Divers)**: 작살총을 발사하거나 서치라이트 수색 패턴을 가진 적.
5. **라이벌 캐릭터 (Rival Marine Life)**: 플레이어가 선택하지 않은 다른 주인공 캐릭터가 난입하여 교차 돌진.

---

## 6. 스테이지 구성 & 시각 아트 시나리오 (5 Stages & Visual Scenarios)

```
[ Stage 1: 태평양 ]       [ Stage 2: 남극 ]         [ Stage 3: 열대산호초 ]     [ Stage 4: 대서양 심해 ]    [ Stage 5: 마리아나 해구 ]
 에메랄드 / 청랑함        서늘한 아이스 블루        화려한 네온 산호초        칠흑의 스텔스 미드나잇       마그마 연풍 & 심연
```

### Stage 1: 태평양 (Pacific Ocean) — *청량하고 화창한 입문 해양*
* **비주얼 아트**: 수면 위로 산란하는 따스한 햇살(God Rays)이 내리쬐는 투명한 에메랄드 빛 바다. 연두빛 해초와 부드럽고 잔잔한 물결.
* **대표 컬러**: `#00B4D8` (Cyan), `#90E0EF` (Light Blue), `#E9C46A` (Warm Gold)

### Stage 2: 남극 (Antarctic Ocean) — *차갑고 몽환적인 극지의 빙하 바다*
* **비주얼 아트**: 수면에 거대한 유빙이 떠 있고, 수심 아래는 서늘한 아이스 블루와 보랏빛 오로라 광선이 반사되는 신비로운 바다.
* **대표 컬러**: `#03045E` (Deep Navy), `#0077B6` (Ice Blue), `#E0FAFF` (Crystal White)

### Stage 3: 열대 산호초 (Tropical Coral Reef) — *화려하고 복잡한 형광빛 미로*
* **비주얼 아트**: 핫핑크, 퍼플, 옐로우 등 원색의 산호초와 수풀이 빽빽하게 우거진 네온 감성의 화려한 해저 미로.
* **대표 컬러**: `#FF007F` (Neon Pink), `#7B2CBF` (Deep Purple), `#FFB703` (Vibrant Yellow)

### Stage 4: 대서양 심해 (Atlantic Deep Sea) — *칠흑의 정적과 심해 스텔스*
* **비주얼 아트**: 빛이 닿지 않는 칠흑 같은 미드나잇 바다. 침몰한 난파선 잔해 사이로 잠수함의 노란 서치라이트와 자발광 플랑크톤이 반짝임.
* **대표 컬러**: `#0B090A` (Charcoal Black), `#161A1D` (Deep Midnight), `#52B788` (Bio-Green)

### Stage 5: 마리아나 해구 (Mariana Trench) — *심연의 열수구와 태고의 바다*
* **비주얼 아트**: 해저 지각이 갈라져 마그마가 뿜어져 나오는 최후의 스테이지. 보랏빛 암흑과 열수 분출구의 붉은 불꽃이 시각적 대조를 이룸.
* **대표 컬러**: `#240046` (Ultraviolet), `#DC2F02` (Magma Red), `#E85D04` (Fire Orange)

---

## 7. 스테이지별 보스전 & 특수 이벤트 (Boss Fights & Special Events)

### 1. Stage 1: 태평양
* **보스**: **사냥꾼 포획 모선 '헤파이토스 호' & 수중 탐사 드론**
  * 수면 위 모선에서 투하되는 작살 드론을 JUMP 부스트로 유도하여 바위나 서로에게 충돌시켜 파괴.
* **특수 이벤트**: **‘정어리 떼의 피딩 프렌지 (Feeding Frenzy)’**
  * 수천 마리의 정어리 떼가 피버 타임으로 등장, 무적 상태로 먹이를 휩쓰는 카타르시스 구간.

### 2. Stage 2: 남극
* **보스**: **'고대 아이스 크라켄 (Ice Kraken)'**
  * 화면 상/하단 및 우측에서 얼음 촉수가 사방으로 출현. 붉은 경고 가이드라인을 정밀 회피하며 약점 타격.
* **특수 이벤트**: **‘유빙 대붕괴 (Iceberg Collapse)’**
  * 수면 위 얼음산이 깨지며 거대한 유빙 조각들이 무작위 낙하. 상하 조작과 점프로 탈출.

### 3. Stage 3: 열대 산호초
* **보스**: **'쏠배감펭 퀸 (Lionfish Queen)'**
  * 전 방위 독가시 방출 및 산호초 미로 뒤로 숨는 기습형 보스. 유도 어뢰를 산호초로 유인해 파괴 후 노출시킴.
* **특수 이벤트**: **‘해저 급류 래프팅 (Current Rush)’**
  * 이동 속도가 2배로 증가하는 거센 급류 구간. 좁은 산호초 통로를 빠른 반사신경으로 통과.

### 4. Stage 4: 대서양 심해
* **보스**: **군용 스텔스 잠수함 '네모-X (Nemo-X)'**
  * 붉은 서치라이트와 음파 탐지기, 어뢰 발사. 서치라이트를 피해 암영지대에 숨으며 어뢰를 잠수함에 역충돌시킴.
* **특수 이벤트**: **‘자발광 암전 타임 (Bioluminescent Mode)’**
  * 화면 전체가 칠흑으로 바뀌고 플레이어의 눈/지느러미와 먹이만 형광빛으로 발광하는 긴장감 높은 연출.

### 5. Stage 5: 마리아나 해구
* **보스**: **심연의 군주 '용암 레비아탄 (Magma Leviathan)'**
  * **1페이즈**: 거대 몸통 휘두르기와 거품 브레스 회피.
  * **2페이즈**: 해저 열수구 마그마 폭발과 함께 화면 우측 전체에서 집어삼키는 한계 회피전.
* **특수 이벤트**: **‘심연의 소용돌이 (Abyssal Vortex)’**
  * 화면 중앙의 거대 해저 소용돌이가 플레이어와 파편을 강하게 끌어당기는 기믹.

---

## 8. 캐릭터별 스탯, 물리 조작감 & 밸런스 설계 (Stats, Physics & Balance)

### 8.1. 캐릭터 스탯 매트릭스 (5점 만점)

| 캐릭터 | 이동 속도 | 점프/부스트 | 피격 판정(Hitbox) | 먹이 흡입 | 추천 플레이 스타일 |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **범고래** | ★3 | ★3 | 보통 (3) | ★3 | **[입문자용]** 올라운더 / 균형 잡힌 물리 |
| **상어** | ★4 | ★4 | 작음 (2) | ★2 | **[중급자용]** 칼 같은 즉각 반응 & 콤보 특화 |
| **청새치** | ★5 | ★5 | 길고 가늘음 (2) | ★1 | **[상급자용]** 초고속 직진 돌진 & 드리프트 |
| **대왕오징어** | ★2 | ★2 | 유동적 (3) | ★5 | **[초/중급자용]** 펄스 이동 & 강력한 수집 |
| **메갈로돈** | ★2 | ★3 | 매우 큼 (5) | ★4 | **[중/상급자용]** 묵직한 중량감 & 장애물 파괴 |

### 8.2. 고유 패시브 & 특수 스킬

1. **범고래 (Echolocation - 초음파 탐지)**:
   * 다가오는 위험 요소(어뢰, 사냥꾼)의 위치를 미리 알려주는 경고 화살표 인디케이터 상시 활성화.
2. **상어 (Blood Frenzy - 피의 포식)**:
   * 피격 없이 먹이 연속 포식 시 이동 속도 최대 +20% 증가 및 콤보 가산점 증대.
3. **청새치 (Needle Dash - 바늘 돌진)**:
   * JUMP 버튼 사용 시 전방 초고속 돌진하며 소형 그물/일반 적 1회 관통 파괴 (쿨타임 5초).
4. **대왕오징어 (Ink Screen - 먹물 은신)**:
   * 위험 시 자동으로 먹물을 뿜어 적들을 1.5초간 느리게 만들고 무적 시간 획득 (판당 2회).
5. **메갈로돈 (Apex Armor - 최상위 포식자 장갑)**:
   * 소형 바위/잠수함 충돌 시 목숨 차감 대신 장애물을 부수며 그냥 통과 (보호막 게이지 충전 방식).

---

## 9. 콤보 시스템 구조 (Combo System Architecture)

### 9.1. 기본 메커니즘
* **타이머 (2.0s)**: 먹이 획득 시 2.0초 유효 타이머 게이지 작동.
* **배율 스케일링**:
  * 1~4 Combo: x1.0
  * 5~9 Combo: x1.5 + SFX 피치 상승
  * 10~19 Combo: x2.0 + Speed Lines 연출
  * 20+ Combo (MAX): **x3.0 + FEVER MODE (화면 형광 발광 & 스크린 셰이크)**
* **리셋**: 타이머 소진 시 리셋, 피격 시 즉시 완전 파괴.

### 9.2. 캐릭터별 콤보 특화기믹
* **범고래**: 콤보 유효 시간 2.8초로 증가 (콤보 유지 최강).
* **상어**: 10콤보 이상 시 배율 한도 x4.0 확장.
* **청새치**: JUMP 돌진 중 포식 시 타이머 즉시 100% 충전 + 콤보 +2.
* **대왕오징어**: 광범위 흡입력으로 공중/해저 먹이 동시 수집.
* **메갈로돈**: 장애물 파괴 후 포식 시 SMASH COMBO 판정 (점수 2배).

---

## 10. 인게임 UI 레이아웃 정밀 시안 (In-Game UI Specifications)

### 10.1. 컨트롤러 정밀 스펙

```
[ JUMP 버튼 레이아웃 ]                      [ 4방향 D-PAD 레이아웃 ]

      Outer Ring (84dp)                           ( ▲ )  Up Key (36dp)
    +-------------------+                       +-------+
    |   Inner Button    |                       |       |
    |     (68dp)        |         Left Key (36dp)|       | Right Key (36dp)
    |    (( JUMP ))     |          +-------+    +-------+    +-------+
    |                   |          |  ◄    |    | Dead  |    |    ►  |
    +-------------------+          +-------+    | Zone  |    +-------+
       Ripple Effect                             +-------+
       (터치 시 수중 파동)                       |  ▼    |
                                                +-------+
                                              Down Key (36dp)
```

* **JUMP 버튼 (Left 8%, Bottom 12% 중심)**:
  * 내부 버튼 68dp, 외부 핫스팟 링 84dp.
  * Normal: Semi-transparent White (`#FFFFFF`, 35% opacity)
  * Pressed: Neon Cyan (`#00E5FF`, 80% opacity) + Ripple FX.
* **4방향 D-Pad (Right 8%, Bottom 10% 중심)**:
  * 전체 모듈 130 × 130dp, 방향 키 각각 36 × 36dp, 중앙 데드존 24 × 24dp.
  * Pressed: Neon Orange (`#FF9E00`) 발광.

---

## 11. 디자인 종합 아트북 & AI 생성 프롬프트 (Design Artbook & AI Prompts)

### 11.1. 비주얼 브랜딩 & 컬러 코드
* **Main Black/Navy**: `#0B132B` (깊은 심해 블랙)
* **Main White/Cyan**: `#00E5FF` (전기 네온 시안)
* **Accent Red/Coral**: `#FF3366` (경고 및 포인트 코랄)
* **Highlight Gold**: `#FFE66D` (점수 및 획득 골드)

### 11.2. 6초 인트로 동영상 시나리오 & Sora 프롬프트
* **시나리오**: 칠흑의 심해(0~1.5s) → 범고래 초고속 카메라 돌진(1.5~3.5s) → 수면 위 수직 점프 & 파도 Splash(3.5~5.0s) → 수중 입수 및 `KILLER WHALE` 네온 로고 임팩트(5.0~6.0s).
> **Sora Video Prompt**:  
> `A 6-second cinematic 3D arcade game intro video. Starts in dark deep ocean with red flashing warning lights and rising bubbles. Suddenly, a sleek stylized Orca (Killer Whale) with glowing cyan neon lines on its fins rushes directly toward the camera at high speed. The Orca breaches the ocean surface into a dramatic sunset with splashing water particles and god rays, then dives back down creating a powerful shockwave. High contrast, octane render, 8k resolution, Unreal Engine 5 render, cinematic lighting, hyper-detailed water physics, ultra-action, 60fps --ar 16:9`

### 11.3. 첫 화면 (타이틀/메인 화면) 디자인 & 프롬프트
> **Title Screen Image Prompt**:  
> `Mobile game main title screen for a horizontal arcade game named "Killer Whale". Deep blue underwater background with rays of sunlight filtering through the water surface. In the center, a majestic 3D stylized Orca swims dynamically surrounded by glowing cyan plankton and bubbles. Bold 3D typography logo reading "KILLER WHALE" at the top center with glossy water-bubble texture and neon glow. Glowing cyan round button at the bottom center with text "START". Clean UI, game start screen design, semi-realistic vibrant art style, 8k, detailed UI layout --ar 16:9`

### 11.4. 스테이지 1~5 배경 이미지 프롬프트

* **Stage 1 (태평양)**: `Side-scrolling game background stage 1, crystal clear Pacific Ocean underwater scene, vibrant turquoise and light blue water, soft sunlight rays filtering from surface, gentle green seaweed, coral reefs at bottom, clean arcade style, seamless parallax layer --ar 16:9`
* **Stage 2 (남극)**: `Side-scrolling game background stage 2, cold Antarctic Ocean, deep ice-blue and violet water, massive submerged icebergs, glowing aurora lights reflecting through the water surface, floating ice particles, crisp icy atmosphere, seamless parallax --ar 16:9`
* **Stage 3 (열대산호초)**: `Side-scrolling game background stage 3, tropical coral reef, vibrant neon pink, purple and golden yellow corals, glowing bioluminescent flora, dense underwater maze, colorful fish schools in background, seamless parallax --ar 16:9`
* **Stage 4 (대서양 심해)**: `Side-scrolling game background stage 4, deep Atlantic sea, dark midnight blue and charcoal water, sunken shipwreck silhouettes, yellow submarine searchlight beams piercing through dark water, green bioluminescent plankton, moody stealth tone, seamless parallax --ar 16:9`
* **Stage 5 (마리아나 해구)**: `Side-scrolling game background stage 5, Mariana Trench deep ocean abyss, dark ultraviolet water background, glowing red magma vents and volcanic hydrothermal chimneys, rising heat bubbles, dangerous lava cracks, dramatic high-contrast lighting, seamless parallax --ar 16:9`

### 11.5. 게임 설정 화면 (Settings Modal) 프롬프트
> **Settings UI Prompt**:  
> `Game UI settings modal pop-up window for mobile game "Killer Whale". Glassmorphism dark navy frosted glass panel overlaying an underwater scene. UI elements include toggle buttons for "Lives: 3, 4, 5, 6" with glowing cyan border, slider bars for Music and Sound SFX with water bubble knobs, a button labeled "Adjust Controls", clean modern UI icons, high readability, glossy arcade style UI design --ar 16:9`

### 11.6. 스코어 / 결과 화면 (Score/Result Screen) 프롬프트
> **Score UI Prompt**:  
> `Game score result screen UI for mobile game "Killer Whale". A polished victory card modal floating over a splashing water background. Displays "STAGE CLEAR" in glowing golden 3D text at the top, a large digital score counter reading "124,500", combo stats, and a grid showing 10 collected prey item icons. Three arcade action buttons at the bottom: Green "RETRY", Blue "HOME", Yellow "RANKING". Clean UX, glossy aquatic theme, particle effects, victory mood --ar 16:9`

### 11.7. 모바일 & 데스크톱 앱 아이콘 프롬프트
* **모바일 스퀘어 아이콘**: `Mobile game app icon, squircle shape with rounded corners. Features a dynamic 3D stylized Orca (Killer Whale) leaping out of a vibrant blue ocean with splashing water drops and glowing cyan light trails. Dark navy background, high contrast, glossy finish, modern app icon design, 3D render, highly recognizable --ar 1:1`
* **데스크톱 원형 엠블럼 아이콘**: `Desktop game app icon, transparent background, circular 3D metallic badge style. Features a powerful Orca fin slicing through a swirling water vortex ring with glowing neon blue water particles. Premium metallic texture, high-end 3D icon render, polished game launcher icon --ar 1:1`

---

## 12. Unity & Unreal 엔진 모바일 개발 최적화 가이드 (Engine Optimization Guide)

### 12.1. 그래픽 & 렌더링 최적화
1. **드로우콜(Draw Call / Batches) 최소화**:
   * **Sprite Atlas (Unity) / Texture Groups (Unreal)**: UI 및 2D 먹이/장애물 에셋을 하나의 큰 아틀라스 텍스처로 묶어 드로우콜을 대폭 감소.
   * **Dynamic Batching & SRP Batcher**: Unity URP(Universal Render Pipeline) 및 Unreal Mobile Forward Renderer를 채택하여 셰이더 패스 최적화.
2. **라이팅 & 셰이더**:
   * 실시간 조명(Real-time Light) 대신 **라이트맵(Lightmap)**을 베이킹하고, 모바일 전용 Unlit / Simple Lit 셰이더 활용.

### 12.2. 메모리 관리 & 가비지 컬렉션 (GC)
1. **오브젝트 풀링 (Object Pooling) 필수 도입**:
   * 먹이 아이콘, 수중 기포 파티클, 어뢰, 장애물 등에 `Instantiate / Destroy` (Unity) 또는 `SpawnActor / DestroyActor` (Unreal)를 절대 쓰지 않고 미리 생성된 풀에서 재사용.
2. **C# Managed Heap 파편화 방지 (Unity)**:
   * Update() 함수 내 문자열 합성(`+`) 금지 -> `StringBuilder` 사용.
   * `LINQ` 및 임시 배열 할당(`new`)을 틱 단위 코드에서 배제하여 가비지 컬렉터 스파이크(Lag Spike) 예방.

### 12.3. 반응형 UI 스케일링 & Safe Area
1. **해상도 대응**:
   * Unity: `Canvas Scaler`를 **Scale With Screen Size (1920x1080 / Match 0.5)**로 설정.
   * Unreal: `DPI Scaling Rule`을 디바이스 가로/세로 비율에 맞게 픽셀 커브 세팅.
2. **Safe Area (노치/펀치홀 대응)**:
   * Screen.safeArea 값을 읽어와 HUD 패널의 Anchor Margin(좌우 44pt 여백)을 동적으로 조정.

### 12.4. 발열, 배터리 소모 & 프로파일링
1. **프레임 제한 (Target Frame Rate)**:
   * `Application.targetFrameRate = 60`으로 설정하여 모바일 기기 디스플레이 무제한 연산으로 인한 발열 및 열 스로틀링(Thermal Throttling) 방지.
2. **에셋 동적 로딩**:
   * `Addressables` (Unity) 또는 `Asset Manager / Chunking` (Unreal)을 활용하여 스테이지별 배경 및 보스 에셋을 필요한 시점에 메모리에 얹고 즉시 해제.
3. **디바이스 온보드 프로파일링**:
   * `Unity Profiler` 및 `Unreal Insights`를 통해 CPU GC Alloc, GPU Frame Time, Overdraw 픽셀율을 상시 검증.

---
*End of Game Design Document - Killer Whale (범고래)*
