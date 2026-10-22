# 🚀 [Antigravity AI Agent Master Prompt] 횡스크롤 미니게임 '범고래 (Killer Whale)' 풀패키지 완제 개발 지시서

---

## 1. 프롬프트 개요 & 에이전트 미션 (Agent Mission)

* **수신 에이전트**: Antigravity (풀스택 게임 개발 & 풀패키지 프로덕션 코딩 AI 에이전트)
* **발신자**: Lead Game Producer & Architect
* **프로젝트명**: **미니게임 범고래 (Killer Whale)**
* **목표**: 제공된 **`미니게임 표준 기획서 Form_1_5`** 및 **`Killer_Whale_Game_Design_Doc`**의 모든 요구사항을 100% 충실히 반영하여, 단 하나의 기능 누락 없이 상용 배포 가능한 수준의 **모바일 가로화면 횡스크롤 아케이드 미니게임** 풀패키지 코드를 구축할 것.
* **개발 환경 표준**:
  * **Engine**: Unity 2022.3 LTS / 2023 LTS (Universal Render Pipeline - URP 2D) 또는 C# / C++ 기반 모바일 2D 프레임워크
  * **Target Platform**: Android / iOS (가로 모드 Landscape, 16:9 ~ 20:9 반응형 지원)
  * **Build Target**: APK / AAB / IPA 배포 가능 구조 + WebGL 포팅 호환성 유지

---

## 2. 참조 표준 문서 및 사양 준수 가이드

에이전트는 다음 두 문서의 모든 스펙을 연계하여 시스템을 구조화해야 합니다.
1. **`AEa15[KHS] 미니게임 표준 기획서 Form_1_5`**:
   * 0절~19절 표준 모듈 구조 (InputManager, GameLoop, Collision, Score/Combo, UI/UX, SaveSystem, Firebase Leaderboard)
2. **`Killer_Whale_Game_Design_Doc`**:
   * 주인공 5종 및 전용 먹이 50종 데이터
   * 5개 스테이지별 아트/보스전/특수 이벤트 파라미터
   * 캐릭터별 물리학적 조작감 & 패시브 스킬
   * 모바일 성능 최적화 (Object Pooling, GC 최소화, Canvas Scaling)

---

## 3. 핵심 아키텍처 & 스크립트 모듈 구조 (Architecture Design)

에이전트는 단일 모놀리식 스크립트를 배제하고, 다음과 같이 명확히 분리된 **모듈형 C# architecture**를 구축해야 합니다.

```
Assets/_Scripts/
├── Core/
│   ├── GameManager.cs              // 전체 게임 상태(Init, Title, Playing, Pause, Clear, GameOver) 관리
│   ├── GameState.cs                // Enum 모음
│   └── SaveSystem.cs               // PlayerPrefs 기반 옵션, 최고점수, 언락 현황 로컬 저장소
├── Input/
│   ├── InputManager.cs             // 양손 엄지 터치, 가상 D-Pad 및 JUMP 버튼, 터치 핫스팟/오프셋 처리
│   └── SafeAreaAdapter.cs          // 모바일 노치/펀치홀 Safe Area 자동 여백 조절
├── Entities/
│   ├── Player/
│   │   ├── PlayerController.cs     // 수중 물리(관성/가속/마찰), 4방향 이동 및 JUMP 부스트
│   │   ├── PlayerHitbox.cs         // 캐릭터별 피격 판정 및 먹이 자력(Magnet) 흡입
│   │   └── PlayerSkills.cs         // 5종 캐릭터별 고유 패시브/특수 스킬 로직
│   ├── Prey/
│   │   └── PreyItem.cs             // 먹이 아이콘 동작, 흡입 애니메이션, 점수 가산
│   ├── Hazards/
│   │   ├── HazardBase.cs           // 장애물 공통 (바위, 그물, 잠수함, 사냥꾼, 라이벌)
│   │   └── SubmarineMissile.cs     // 유도 어뢰 및 사냥꾼 작살 패턴
│   └── Boss/
│       ├── BossBase.cs             // 스테이지 보스 공통 FSM (Idle, Attack, Weak, Defeated)
│       └── StageBosses/            // 헤파이토스, 아이스 크라켄, 쏠배감펭 퀸, 네모-X, 레비아탄
├── Managers/
│   ├── StageManager.cs             // 5개 스테이지 진행률, 배경 파라락스 스크롤, 환경 전환
│   ├── SpawnManager.cs             // Object Pool 기반 먹이/장애물 패턴 스포너
│   ├── ScoreManager.cs             // 점수, 콤보 타이머(2.0s), Multiplier(x1.0~x4.0), 피버모드
│   ├── AudioManager.cs             // BGM, SFX, Pitch Shifted Combo Sound, Haptic 피드백
│   └── FirebaseManager.cs          // (선택) Firebase Realtime DB/Firestore 랭킹 연동
├── UI/
│   ├── UIMainTitle.cs              // 메인 타이틀, 3D/2D 배경 파라락스, START 버튼
│   ├── UIHUD.cs                    // 상단 LIVES, STAGE PROGRESS, SCORE, COMBO, Warning 인디케이터
│   ├── UISettingsModal.cs          // 목숨 설정(3~6회), 컨트롤 오프셋, 사운드 슬라이더
│   ├── UICharacterSelect.cs        // 5종 캐릭터 캐러셀, 스탯 그래프, 먹이 10종 프리뷰
│   └── UIResultModal.cs            // Clear/GameOver 리포트, 먹은 먹이 그리드, Retry/Home
└── Data/
    ├── ScriptableObjects/
    │   ├── CharacterData.cs        // 캐릭터 스탯, 히트박스, 먹이 목록, 스킬 파라미터
    │   ├── StageData.cs            // 스테이지 색상 팔레트, 스폰 테이블, 보스 데이터
    │   └── PreyData.cs             // 먹이 10종 아이콘, 점수, 파티클
    └── ObjectPool.cs               // 범용 오브젝트 풀링 클래스
```

---

## 4. 세부 시스템 구현 스펙 (Detailed Specifications)

### 4.1. 주인공 캐릭터 5종 & 스탯/패시브 스킬 구현 스펙 (`CharacterData.cs` & `PlayerSkills.cs`)

| 캐릭터 | 이동 속도 | 부스트 | 히트박스 | 자력 범위 | 수중 물리 감각 | 고유 패시브 스킬 구현 요구사항 |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **범고래** | 3.0 | 3.0 | 보통 (1.0) | 3.0 | 균형 잡힌 가속 & 제동 | **Echolocation**: 화면 우측에 적/어뢰 출현 1.5초 전 점멸 인디케이터 항시 표시 |
| **상어** | 4.0 | 4.0 | 작음 (0.8) | 2.0 | 관성 없는 민첩한 스냅 반응 | **Blood Frenzy**: 노미스 먹이 획득 시 이동속도 누적 +20% (최대) & 콤보 가산점 |
| **청새치** | 5.0 | 5.0 | 가늘음 (0.7) | 1.0 | 빠른 최고속도, 사선 돌진, 둔한 제동 | **Needle Dash**: JUMP 입력 시 전방 사선 순간 돌진 & 소형 그물/일반 적 1회 관통 (쿨타임 5s) |
| **대왕오징어** | 2.0 | 2.0 | 유동적 (0.9) | 5.0 | 펄스(Pulse) 단위 틱 이동 | **Ink Screen**: 먹이 흡입 범위 극대화, 피격 위기 시 먹물 분사로 적 1.5초 감속 & 무적 (판당 2회) |
| **메갈로돈** | 2.0 | 3.0 | 매우 큼 (1.4) | 4.0 | 큰 관성, 묵직한 중량감 | **Apex Armor**: 보호막 게이지 충전 시 소형 바위/잠수함 충돌 파괴하며 목숨 차감 방어 |

* **물리 엔진 설정**: `Rigidbody2D` (Kinematic 또는 Dynamic with linear/angular drag) 사용. C# 레벨에서 `FixedUpdate()` 내 가속도 및 마찰력 커스텀 계산.

### 4.2. 전용 먹이 50종 및 점수/콤보 구조 (`ScoreManager.cs` & `PreyData.cs`)

* **캐릭터별 전용 먹이 10종 매핑 Table**:
  * **범고래**: 물개, 연어, 바다표범, 펭귄, 청어, 가오리, 바다사자, 오징어, 왕바다표범, 정어리 떼
  * **상어**: 참치, 고등어, 바다거북, 정어리, 방어, 꽁치, 삼치, 날치, 게, 쥐치
  * **청새치**: 무늬오징어, 만새기, 날치, 멸치 떼, 삼치, 고등어, 전갱이, 청새치 치어, 꽁치, 바다새
  * **대왕오징어**: 심해어, 랜턴피시, 심해 새우, 갯지렁이, 갑오징어, 명태, 대구, 심해 게, 암모나이트, 크릴새우 떼
  * **메갈로돈**: 고대 고래, 대형 바다거북, 대형 매너티, 바다사자 떼, 대형 참치, 대형 가오리, 고대 상어, 해양 파충류, 향고래, 고대 다랑어
* **콤보 타이머 & 배율 로직**:
  * 먹이 먹을 시 `comboTimer = 2.0f` 리셋.
  * 콤보 수치에 따른 배율: `1~4` (x1.0), `5~9` (x1.5), `10~19` (x2.0), `20+` (x3.0 Fever Mode).
  * (상어) 스킬 활성화 시 최대 배율 **x4.0**까지 확장.
  * **Pitch Shifting SFX**: 먹이를 먹을 때마다 SFX AudioSource의 `pitch` 값을 `1.0f`에서 `1.05f`씩 상승 (최대 `2.0f`), 콤보 리셋 시 `1.0f`로 복귀.

### 4.3. 5개 스테이지 & 아트 파라락스 / 이벤트 / 보스전 구현 (`StageManager.cs` & `BossBase.cs`)

1. **Stage 1: 태평양 (Pacific Ocean)**
   * **아트**: 에메랄드/시안 팔레트 (`#00B4D8`), God Rays 수면 햇살 효과.
   * **이벤트**: '정어리 떼 피딩 프렌지' (무적 피버 타임).
   * **보스**: '헤파이토스 호 & 탐사 드론' (드론 작살 회피 및 바위 유도 충돌 파괴).
2. **Stage 2: 남극 (Antarctic Ocean)**
   * **아트**: 딥네이비/아이스블루 팔레트 (`#0077B6`), 오로라 반사광, 얼음 입자 파티클.
   * **이벤트**: '유빙 대붕괴' (무작위 수직 낙하 유빙 회피).
   * **보스**: '고대 아이스 크라켄' (붉은 경고선 가이드 후 사방 촉수 공격).
3. **Stage 3: 열대 산호초 (Tropical Coral Reef)**
   * **아트**: 네온 핑크/자줏빛 산호 미로 (`#FF007F`), 형광 파티클.
   * **이벤트**: '해저 급류 래프팅' (이동 속도 2배 고속 회피 파트).
   * **보스**: '쏠배감펭 퀸' (전 방위 독가시 방출 및 산호초 은신 기습).
4. **Stage 4: 대서양 심해 (Atlantic Deep Sea)**
   * **아트**: 미드나잇 차콜 바다 (`#0B090A`), 서치라이트 및 발광 플랑크톤.
   * **이벤트**: '자발광 암전 타임' (플레이어/먹이 유닛만 형광 발광).
   * **보스**: '스텔스 잠수함 네모-X' (서치라이트 스텔스 & 유도 어뢰 역충돌 유도).
5. **Stage 5: 마리아나 해구 (Mariana Trench)**
   * **아트**: 울트라바이올렛/마그마 레드 (`#DC2F02`), 열수 분출 가스.
   * **이벤트**: '심연의 소용돌이' (화면 중앙 강제 흡입 및 파편 회피).
   * **보스**: '용암 레비아탄' (1페이즈 수중 격돌 → 2페이즈 마그마 대폭발 및 화면 우측 거대 돌진).

### 4.4. 조작계 & 인체공학적 UI/UX (`InputManager.cs` & `UIHUD.cs`)

* **가상 컨트롤러 규격**:
  * **왼손 영역**: JUMP 버튼 (Center: Left 8%, Bottom 12%, 크기 68dp, 터치시 수중 파동 Ripple FX).
  * **오른손 영역**: 4방향 D-Pad (Center: Right 8%, Bottom 10%, 크기 130dp, 데드존 24dp).
* **Safe Area & 커스텀 UI 오프셋**:
  * `SafeAreaAdapter.cs`를 통해 `Screen.safeArea` 기반 자동 여백(좌우 44pt, 상하 16pt) 확보.
  * 설정 메뉴에서 점프/D-Pad 위치(X/Y Offset) 및 투명도(20~100%), 크기(80~120%) 드래그 조절 기능 구현.
* **설정 모달 및 옵션**:
  * **목숨 설정**: 3회, 4회, 5회, 6회 라디오 버튼 연동. (선택 수치만큼 HUD 상단에 하트/지느러미 아이콘 배치, 피격 시 깨짐 애니메이션).

---

## 5. 모바일 성능 최적화 필수 개발 지침 (Optimization Checklist)

Antigravity 에이전트는 코드 작성 시 모바일 기기의 발열 및 프레임 드랍을 방지하기 위해 다음 규칙을 **엄격히 준수**해야 합니다.

1. **오브젝트 풀링 (Object Pooling) 100% 적용**:
   * 먹이 50종, 장애물, 어뢰, 파티클, SFX AudioSource는 절대 `Instantiate()` / `Destroy()`를 런타임 게임루프 중에 호출하지 말 것.
   * `ObjectPool<T>` 클래스를 통해 씬 진입 시 미리 생성 후 `SetActive(true/false)`로 재사용할 것.
2. **가비지 컬렉터 (GC) 발생 최소화**:
   * `Update()` 내에서 `string` 결합(`+`) 금지 -> `StringBuilder` 또는 Caching 사용.
   * `GetComponent<T>()`는 `Awake()` / `Start()`에서 미리 캐싱할 것.
   * `LINQ` 및 `foreach` 사용 자제 (배열 또는 `List<T>` Index 기반 `for` 문 사용).
3. **드로우콜 및 그래픽 최적화**:
   * 모든 2D 스프라이트는 `Sprite Atlas`로 패킹하여 단일 BATCH로 처리.
   * 모바일 가벼운 셰이더 (URP 2D Unlit / Lit) 적용.
   * `Application.targetFrameRate = 60;` 및 `Screen.sleepTimeout = SleepTimeout.NeverSleep;` 설정.

---

## 6. 에이전트 실행 단계별 로드맵 (Execution Roadmap)

에이전트는 다음 7단계 시퀀스에 맞춰 순차적으로 코드를 작성하고 검증해야 합니다.

* **[Phase 1: 코어 프레임워크 구축]**
  * `GameManager.cs`, `GameState.cs`, `SaveSystem.cs` 작성.
  * `InputManager.cs` 및 `SafeAreaAdapter.cs` 기반 가상 JUMP/D-Pad 입력 바인딩.
* **[Phase 2: 데이터 모델 & 플레이어 물리학]**
  * `CharacterData.cs`, `PreyData.cs`, `StageData.cs` ScriptableObject 인프라 구축.
  * `PlayerController.cs` 내 5종 수중 물리 감각 및 `PlayerSkills.cs` 패시브 스킬 구현.
* **[Phase 3: 스포너, 먹이 & 장애물]**
  * `ObjectPool.cs` 및 `SpawnManager.cs` 패턴 생성기 작성.
  * `ScoreManager.cs` 콤보 타이머, Multiplier, Pitch Shifted SFX 및 50종 먹이 수집 로직 연결.
* **[Phase 4: 스테이지 진행 및 보스 FSM]**
  * `StageManager.cs` 파라락스 배경 스크롤.
  * 5개 스테이지별 보스전 FSM 및 특수 이벤트(피딩 프렌지, 유빙 낙하, 암전 등) 완성.
* **[Phase 5: UI/UX & 설정 모달]**
  * `UIMainTitle`, `UIHUD`, `UISettingsModal` (3~6회 목숨 설정, UI 위치 변경), `UIResultModal` 구축.
* **[Phase 6: 오디오, 파티클 & 폴리싱]**
  * `AudioManager.cs` 연동, Haptic 피드백, 스크린 셰이크, 비네팅 피격 플래시 연출.
* **[Phase 7: 최종 최적화 & 빌드 검증]**
  * GC 스캔, Object Pool 메모리 누수 점검, Android APK/AAB 및 WebGL 빌드 파이프라인 완성.

---

## 7. 에이전트 최종 출력 및 완료 조건 (Final Deliverables)

Antigravity 에이전트는 본 프롬프트 수신 즉시 프로젝트의 **전체 C# 소스 코드 모듈**, **ScriptableObject 데이터 구조체**, **UI/UX 스크립트**, **오브젝트 풀링 및 빌드 셋업 가이드**를 완성형 코드로 제시해야 합니다. 

단 하나의 TODO나 생략 없이 완전 구현된 풀패키지 게임 시스템을 작성하십시오!
