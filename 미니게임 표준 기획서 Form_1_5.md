**미니게임 표준 기획서 (Form\_1\_5)**

_프로젝트명: 범고래 (Killer Whale) — 횡스크롤 해양 아케이드 미니게임 마스터 기획서_

# **0\. 작성 규칙 적용 결과**

본 문서는 기존 Form\_1\_4 작성본을 바탕으로 브레인스토밍된 신규 기획 요소(5종 주인공 캐릭터 스탯/패시브/50종 전용 먹이, 5개 스테이지 배경 아트 시나리오 및 보스전/특수 이벤트, 인체공학 UI 레이아웃, 세팅/결과 UI 및 AI 프로덕션 프롬프트, Unity/Unreal 모바일 최적화 개발 가이드)를 완벽히 통합하여 개정한 Form\_1\_5 최종 사양서이다.

-   빈 칸은 표준 단위(px, ms, 초, 점, 횟수)의 기본값으로 명확히 정의하였다.
-   기존 결정 로그(D1~D8)를 계승하며, 추가 브레인스토밍 항목에 대해 D9~D16 신규 결정 로그를 수립하였다.
-   모바일 가로 화면(16:9 ~ 20:9)을 최우선 기준 해상도(1280x720)로 설정하며, Safe Area 기반 반응형 UI 스케일링을 적용한다.
-   주인공 캐릭터 5종(범고래, 상어, 청새치, 대왕오징어, 메갈로돈)은 각 10종씩 총 50종의 전용 먹이 아이콘과 고유 스탯/패시브/콤보 기믹을 가진다.
-   5개 스테이지는 각각 독자적인 보스전 패턴과 특수 환경 이벤트를 포함한다.
-   개발 단계에서 아트/엔진 리소스가 없는 경우에도 자리표시자(Placeholder)만으로 18절 1차 완료 판정을 통과하도록 설계한다.

# **1\. 문서 정보**

<table><tbody><tr><td><p><strong>항목</strong></p></td><td><p><strong>기입 / 사양 내용</strong></p></td></tr><tr><td><p>게임명</p></td><td><p>범고래 (Killer Whale)</p></td></tr><tr><td><p>영문 식별자</p></td><td><p>killer-whale-game</p></td></tr><tr><td><p>양식 ID &amp; 버전</p></td><td><p>Form_1_5 (v1.5)</p></td></tr><tr><td><p>작성일</p></td><td><p>2026년 10월 20일</p></td></tr><tr><td><p>한 줄 설명</p></td><td><p>양손 엄지 조작으로 바위, 그물, 잠수함, 사냥꾼을 피하며 캐릭터별 전용 먹이 10종을 먹고 고득점을 노리는 횡스크롤 해양 아케이드 미니게임</p></td></tr><tr><td><p>장르</p></td><td><p>2D 횡스크롤 해양 아케이드 / 도지(Dodge) &amp; 컬렉션</p></td></tr><tr><td><p>타깃 플랫폼</p></td><td><p>모바일 가로화면 최적화 (iOS / Android) 및 데스크톱 (HTML5/Web)</p></td></tr><tr><td><p>목표 플레이 시간</p></td><td><p>한 판 평균 2~3분 (패리타임 기준 총 5개 스테이지 313초 내외)</p></td></tr><tr><td><p>톤앤매너</p></td><td><p>Vibrant Aquatic Arcade (시원하고 경쾌한 네온 해양 아케이드 / Bold Outlines &amp; Glossy Water FX)</p></td></tr><tr><td><p>개발 엔진 &amp; 저장</p></td><td><p>Unity (URP) / Unreal Engine (Mobile Forward) / WebGL (Phaser 3 / Vite) | 저장: localStorage / PlayerPrefs (killerwhale.save.v1)</p></td></tr></tbody></table>

# **2\. 소스 및 참조 자료 목록**

<table><tbody><tr><td><p><strong>번호</strong></p></td><td><p><strong>자료명</strong></p></td><td><p><strong>종류</strong></p></td><td><p><strong>채택 및 반영 내용</strong></p></td></tr><tr><td><p>S1</p></td><td><p>AEa15[KHS] 미니게임 표준 기획서 Form_1_4</p></td><td><p>표준 양식</p></td><td><p>표준 문서 구조(0~19절), InputManager, 점수/콤보 구조 및 완료 기준 뼈대</p></td></tr><tr><td><p>S2</p></td><td><p>범고래 브레인스토밍 종합 기획안</p></td><td><p>기획 메모</p></td><td><p>주인공 5종 및 전용 먹이 50종, 5개 스테이지 산호초/남극/심해/해구 설정, 보스전 및 특수 이벤트</p></td></tr><tr><td><p>S3</p></td><td><p>인체공학 UI/UX 레이아웃 규격서</p></td><td><p>UI/UX 가이드</p></td><td><p>양손 엄지 터치 핫스팟(Left JUMP 88dp, Right D-Pad 130dp), Safe Area, Custom Edit Mode</p></td></tr><tr><td><p>S4</p></td><td><p>범고래 비주얼 브랜딩 &amp; AI 프롬프트 시트</p></td><td><p>아트 가이드</p></td><td><p>Sora 6초 인트로, Midjourney/SD 타이틀, 스테이지 배경 5종, 설정/결과 UI, 앱 아이콘 2종</p></td></tr><tr><td><p>S5</p></td><td><p>Unity &amp; Unreal 모바일 최적화 기술 보고서</p></td><td><p>기술 보고서</p></td><td><p>드로우콜 배치, Object Pooling, GC 예방, Canvas/DPI Scaling, Addressables, 60fps 제한</p></td></tr></tbody></table>

# **3\. 확정 결정 로그 (Decision Log)**

<table><tbody><tr><td><p><strong>ID</strong></p></td><td><p><strong>주제</strong></p></td><td><p><strong>확정 사양</strong></p></td><td><p><strong>근거 및 비고</strong></p></td></tr><tr><td><p>D1</p></td><td><p>시점 &amp; 이동 방식</p></td><td><p>2D 횡스크롤 (왼쪽에서 오른쪽 진행). 4방향 D-Pad 수중 자유 이동 + JUMP 부스트 버튼</p></td><td><p>S2 브레인스토밍 조작 규격 확정</p></td></tr><tr><td><p>D2</p></td><td><p>기준 화면 &amp; 조작</p></td><td><p>모바일 가로(1280x720) 기준. 왼손 엄지 JUMP, 오른손 엄지 4방향 D-Pad 대각선 배치</p></td><td><p>인체공학적 양손 엄지 가동범위 반영</p></td></tr><tr><td><p>D3</p></td><td><p>목숨 &amp; 난이도</p></td><td><p>설정 메뉴에서 목숨 3회~6회 선택 가능. 피격 시 1회 차감 및 1.5초 무적(깜빡임)</p></td><td><p>유저 접근성 및 난이도 조절 기능</p></td></tr><tr><td><p>D4</p></td><td><p>캐릭터 &amp; 먹이</p></td><td><p>주인공 5종(범고래, 상어, 청새치, 대왕오징어, 메갈로돈). 각 캐릭터별 전용 먹이 10종(총 50종) 필드 생성</p></td><td><p>캐릭터별 개성 및 수집 재미 극대화</p></td></tr><tr><td><p>D5</p></td><td><p>스테이지 구성</p></td><td><p>총 5개 스테이지 (1: 태평양, 2: 남극, 3: 열대산호초, 4: 대서양심해, 5: 마리아나해구)</p></td><td><p>해양 생태계 변화 및 난이도 에스컬레이션</p></td></tr><tr><td><p>D6</p></td><td><p>보스전 &amp; 특수이벤트</p></td><td><p>스테이지별 고유 보스전(헤파이토스호, 크라켄, 쏠배감펭, 네모-X, 레비아탄) 및 특수 이벤트 배치</p></td><td><p>플레이 단조로움 방지 및 클라이맥스 제공</p></td></tr><tr><td><p>D7</p></td><td><p>조작키 커스텀</p></td><td><p>설정 화면에서 JUMP/D-Pad 버튼의 위치(X/Y Offset), 크기(80%~120%), 투명도(20%~100%) 자유 조절</p></td><td><p>디바이스 해상도 및 손 크기 개별 대응</p></td></tr><tr><td><p>D8</p></td><td><p>인게임 콤보</p></td><td><p>먹이 획득 간격 2.0초 내 연속 먹기 시 Multiplier 상승 (최대 x3.0 FEVER MODE, SFX 피치 상승)</p></td><td><p>아케이드적 몰입감 및 고득점 동기 부여</p></td></tr><tr><td><p>D9</p></td><td><p>UI/UX 디자인</p></td><td><p>Vibrant Aquatic Arcade (Glassmorphism 반투명 버블 UI, 네온 시안/골드 포인트 컬러)</p></td><td><p>S4 AI 프로덕션 프롬프트 및 아트북 통일</p></td></tr><tr><td><p>D10</p></td><td><p>엔진 최적화</p></td><td><p>Object Pooling 필수 구현, URP/Mobile Forward, Canvas Scaler Match 0.5, Target 60fps</p></td><td><p>S5 모바일 최적화 가이드 준수</p></td></tr></tbody></table>

# **4\. 게임 개요 및 공통 표준**

**• 플레이어 역할:** 주인공 해양 생물(범고래, 상어, 청새치, 대왕오징어, 메갈로돈)이 되어 왼쪽에서 오른쪽으로 진행하며 다양한 인간 사냥꾼과 장애물을 피하고 먹이를 포식한다.  
**• 승리 조건:** 설정된 목숨을 유지한 채 각 스테이지의 진행률 100% 지점(GOAL / EXIT)에 도달한다. 5개 스테이지를 모두 클리어하면 엔딩이 연출된다.  
**• 패배 조건:** 적, 장애물, 보스 공격과의 충돌로 설정된 목숨(3~6회)이 모두 소진되면 게임 오버(Game Over)가 된다.  
**• 핵심 반복 동기:** 최고 점수(Score) 경신, 별 3개 등급 달성, 캐릭터 5종 해금, 전용 먹이 50종 도감 완성, 글로벌 랭킹 경쟁.  
**• 표준 해상도:** 모바일 가로 1280x720 (16:9 기준, 20:9까지 반응형 확장), 모바일 세로 720x1280, 데스크톱 1600x900.

# **5\. 코어 루프 및 화면 흐름 (Core Loop & Flow)**

## **5.1 코어 루프 (Core Loop)**

-   1\. 스테이지 진입: 주인공 캐릭터가 화면 좌측에서 수중 헤엄치며 오른쪽으로 진행한다.
-   2\. 회피 & 조작: 오른손 4방향 D-Pad로 상하좌우 미세 이동, 왼손 JUMP 버튼으로 순간 부스트 상승을 수행한다.
-   3\. 포식 & 콤보: 화면에 등장하는 전용 먹이 아이콘을 2.0초 내 연속 획득하여 콤보 Multiplier(x1.0~x3.0)를 쌓는다.
-   4\. 위협 회피 & 장애물: 바위, 그물, 잠수함 어뢰, 인간 잠수부, 라이벌 캐릭터의 공격을 피해 목숨을 보존한다.
-   5\. 클라이맥스 & 보스: 스테이지 후반부 특수 이벤트 및 보스전을 통과하여 클리어하고, 정산 후 다음 스테이지로 진입한다.

## **5.2 화면 흐름 (Screen Flow)**

Boot → Intro (6초 인트로 동영상, 최초 1회/스킵 가능) → Title/Main Menu → Character Select / Settings → Stage Select (1~5 순차) → Game Play (HUD) → Pause Modal → Stage Result → (Stage 5 Clear) → Ending → Title/Main Menu

# **6\. 연출 시나리오 (Opening, Interstitial, Ending)**

## **6.1 6초 인트로 동영상 시나리오 (Intro Video)**

<table><tbody><tr><td><p><strong>타임라인</strong></p></td><td><p><strong>화면 연출</strong></p></td><td><p><strong>시각 효과 &amp; 파티클</strong></p></td><td><p><strong>사운드 / SFX</strong></p></td></tr><tr><td><p>0.0s - 1.5s</p></td><td><p>칠흑 같은 심해 속, 붉은 경고등 점멸 및 기포 상승</p></td><td><p>깊은 네이비 암전, 붉은 비네팅 글로우, 수중 버블</p></td><td><p>저주파 수중 울림, 경고 사이렌 SFX</p></td></tr><tr><td><p>1.5s - 3.5s</p></td><td><p>주인공 범고래가 네온 잔상을 내뿜으며 카메라를 향해 초고속 돌진</p></td><td><p>지느러미 네온 시안 발광, 수중 스피드 라인, 카메라 줌인</p></td><td><p>묵직한 수중 돌진음, 물살 가르는 소리</p></td></tr><tr><td><p>3.5s - 5.0s</p></td><td><p>수면 위로 수직 점프! 노을빛 햇살과 파도가 사방으로 튀어 오름</p></td><td><p>God Rays 사선 빛줄기, 물방울 물보라 파티클</p></td><td><p>수면 파열음, 경쾌한 물보라 튀는 소리</p></td></tr><tr><td><p>5.0s - 6.0s</p></td><td><p>수중 재입수와 동시에 강력한 충격파 속 로고 박힘</p></td><td><p>KILLER WHALE 네온 3D 로고, 수중 파동 Ripple FX</p></td><td><p>범고래 포효음 + 타이틀 임팩트 SFX</p></td></tr></tbody></table>

## **6.2 스테이지 클리어 간 브릿지 문구**

**• 1 클리어 (태평양):** "화창한 태평양을 지나 극지의 차가운 유빙 바다로 들어섭니다."

**• 2 클리어 (남극):** "빙하 동굴을 탈출하여 화려한 네온 산호초 미로에 다다릅니다."

**• 3 클리어 (열대산호초):** "산호초 숲을 넘어 빛이 닿지 않는 대서양 칠흑의 심해로 침투합니다."

**• 4 클리어 (대서양심해):** "잠수함의 탐지를 뚫고 지각이 갈라지는 마리아나 해구의 심연으로 내려갑니다."

**• 5 클리어 (마리아나해구):** "용암 레비아탄을 제압하고 바다의 최상위 군주로 거듭납니다!"

# **7\. 조작 체계 및 인체공학 UI 레이아웃**

양손으로 모바일 기기를 감싸 쥐었을 때 엄지손가락의 자연스러운 가동 범위(Arc Range)에 맞추어 대각선 하단 배치를 적용한다.

## **7.1 논리 입력 및 물리 수치**

<table><tbody><tr><td><p><strong>논리 입력</strong></p></td><td><p><strong>영역 / 버튼</strong></p></td><td><p><strong>크기 / 핫스팟</strong></p></td><td><p><strong>반응 / 물리 효과</strong></p></td><td><p><strong>비주얼 피드백</strong></p></td></tr><tr><td><p>JUMP (점프)</p></td><td><p>좌측 하단 (Left 8%, Bottom 12%)</p></td><td><p>직경 68dp (가이드 링 84dp)</p></td><td><p>순간 상승 부스트 (Y축 가속)</p></td><td><p>수중 파동(Ripple) FX, 네온 시안 발광</p></td></tr><tr><td><p>D-PAD (방향키)</p></td><td><p>우측 하단 (Right 8%, Bottom 10%)</p></td><td><p>130x130dp 모듈 (각 키 36dp)</p></td><td><p>상하좌우 4방향 자유 수중 이동</p></td><td><p>누른 화살표 네온 옐로우 발광</p></td></tr><tr><td><p>PAUSE (일시정지)</p></td><td><p>좌측 상단 (Top 4%, Left 4%)</p></td><td><p>36x36dp (터치영역 48dp)</p></td><td><p>게임 일시정지 및 설정 모달</p></td><td><p>반투명 유리 버튼 press 효과</p></td></tr><tr><td><p>SWIPE (세로모드)</p></td><td><p>화면 전체 스와이프</p></td><td><p>임계값 24px (방향) / 28px (점프)</p></td><td><p>스와이프 방향으로 이동/부스트</p></td><td><p>터치 궤적 수중 꼬리 파티클</p></td></tr><tr><td><p>KEYBOARD (PC)</p></td><td><p>Space (점프), WASD/화살표 (이동)</p></td><td><p>표준 키보드 매핑</p></td><td><p>키보드 즉시 반응 (호버 우선)</p></td><td><p>인게임 UI 버튼 눌림 연출</p></td></tr></tbody></table>

# **8\. 규칙 모듈 및 피격/충돌 클래스**

<table><tbody><tr><td><p><strong>접촉 클래스</strong></p></td><td><p><strong>판정 규칙 및 효과</strong></p></td><td><p><strong>피격/무효 조건</strong></p></td><td><p><strong>대표 오브젝트 예시</strong></p></td></tr><tr><td><p>pickup</p></td><td><p>획득 즉시 점수/콤보 반영 후 제거</p></td><td><p>해당 없음</p></td><td><p>캐릭터별 전용 먹이 10종</p></td></tr><tr><td><p>hazard</p></td><td><p>충돌 시 목숨 -1, 1.5초 무적, 콤보 리셋</p></td><td><p>메갈로돈 장갑 스킬로 소형 소멸</p></td><td><p>바위, 그물, 어뢰, 사냥꾼 작살</p></td></tr><tr><td><p>solid</p></td><td><p>이동 경로를 차단하거나 밀려남</p></td><td><p>청새치 돌진 스킬로 소형 관통</p></td><td><p>대형 잠수함, 암벽 지형, 라이벌</p></td></tr><tr><td><p>slow</p></td><td><p>구간 통과 동안 이동 속도 x0.6 감속</p></td><td><p>대왕오징어/오리 감속 무시</p></td><td><p>열대 해저 급류, 심해 점성 수풀</p></td></tr><tr><td><p>boss_attack</p></td><td><p>충돌 시 목숨 -1, 화면 흔들림 및 충격음</p></td><td><p>무적 상태일 때 판정 무시</p></td><td><p>크라켄 촉수, 레비아탄 브레스</p></td></tr><tr><td><p>goal/exit</p></td><td><p>스테이지 진행률 100% 진입 시 클리어 연출</p></td><td><p>해당 없음</p></td><td><p>GOAL / EXIT 텍스트 엠블럼</p></td></tr></tbody></table>

# **9\. 점수, 콤보 및 난이도 시스템**

**• 기본 점수:** 주행 100px당 10점 | 일반 먹이 100점 | 희귀 먹이 300점 | 스테이지 클리어 보너스 1,000점 | 무피격 클리어 보너스 1,500점.  
**• 콤보 배율 (Multiplier):** 먹이 획득 후 2.0초 이내에 다음 먹이를 먹으면 콤보 유지.  

-   1 ~ 4 콤보: x1.0 기본 배율
-   5 ~ 9 콤보: x1.5 배율 + 피치 상승 SFX
-   10 ~ 19 콤보: x2.0 배율 + 속도감 스피드 라인 연출
-   20+ 콤보 (MAX): x3.0 배율 + FEVER MODE (화면 외곽 형광 발광 & 점수 흔들림)

**• 별 3개 등급 판정:** ★1: 스테이지 클리어 | ★2: 목숨 2개 이상 남김 & 먹이 60% 이상 획득 | ★3: 무피격 클리어 & 먹이 85% 이상 획득.

# **10\. 콘텐츠 시트 (5개 스테이지 상세)**

<table><tbody><tr><td><p><strong>스테이지명</strong></p></td><td><p><strong>시각적 톤앤매너</strong></p></td><td><p><strong>패리타임</strong></p></td><td><p><strong>보스전 콘셉트</strong></p></td><td><p><strong>특수 환경 이벤트</strong></p></td></tr><tr><td><p>Stage 1: 태평양</p></td><td><p>에메랄드 청랑함, God Rays 햇살</p></td><td><p>58초</p></td><td><p>사냥꾼 포획 모선 '헤파이토스 호' &amp; 드론</p></td><td><p>정어리 떼 '피딩 프렌지' (피버 타임)</p></td></tr><tr><td><p>Stage 2: 남극</p></td><td><p>서늘한 아이스 블루, 오로라 빛</p></td><td><p>60초</p></td><td><p>빙하 속 봉인 '고대 아이스 크라켄'</p></td><td><p>'유빙 대붕괴' (낙하하는 얼음산 회피)</p></td></tr><tr><td><p>Stage 3: 열대산호초</p></td><td><p>화려한 네온 핑크/옐로우 미로</p></td><td><p>60초</p></td><td><p>네온 독가시 '쏠배감펭 퀸'</p></td><td><p>'해저 급류 래프팅' (속도 2배 급류 코스)</p></td></tr><tr><td><p>Stage 4: 대서양심해</p></td><td><p>칠흑의 미드나잇, 스텔스 연출</p></td><td><p>65초</p></td><td><p>군용 스텔스 잠수함 '네모-X'</p></td><td><p>'자발광 암전 타임' (자기 발광체만 노출)</p></td></tr><tr><td><p>Stage 5: 마리아나해구</p></td><td><p>보랏빛 암흑 &amp; 마그마 열수구</p></td><td><p>70초</p></td><td><p>심연의 군주 '용암 레비아탄' (2페이즈)</p></td><td><p>'심연의 소용돌이' (중앙 흡인 소용돌이)</p></td></tr></tbody></table>

# **11\. 주인공 캐릭터 5종 & 전용 먹이 50종 명부**

<table><tbody><tr><td><p><strong>캐릭터</strong></p></td><td><p><strong>스탯 (속도/부스트/판정/흡입)</strong></p></td><td><p><strong>물리 조작감</strong></p></td><td><p><strong>고유 패시브 스킬</strong></p></td><td><p><strong>전용 먹이 아이콘 10종</strong></p></td></tr><tr><td><p>범고래 (Killer Whale)</p></td><td><p>속도3 / 부스트3 / 판정3 / 흡입3</p></td><td><p>부드러운 스탠다드, 자연스러운 관성</p></td><td><p>초음파 탐지 (위험 요소 미리 경고 인디케이터)</p></td><td><p>물개, 연어, 바다표범, 펭귄, 청어, 가오리, 바다사자, 오징어, 왕바다표범, 정어리 떼</p></td></tr><tr><td><p>상어 (Shark)</p></td><td><p>속도4 / 부스트4 / 판정2 / 흡입2</p></td><td><p>날카로운 칼 회피, 즉각 제동 스냅 점프</p></td><td><p>피의 포식 (연속 포식 시 속도+20% &amp; 콤보x4)</p></td><td><p>참치, 고등어, 바다거북, 정어리, 방어, 꽁치, 삼치, 날치, 게, 쥐치</p></td></tr><tr><td><p>청새치 (Blue Marlin)</p></td><td><p>속도5 / 부스트5 / 판정2 / 흡입1</p></td><td><p>초고속 직진, 드리프트 관성 선회</p></td><td><p>바늘 돌진 (JUMP 시 소형 그물/적 관통 파괴)</p></td><td><p>무늬오징어, 만새기, 날치, 멸치 떼, 삼치, 고등어, 전갱이, 청새치치어, 꽁치, 바다새</p></td></tr><tr><td><p>대왕오징어 (Giant Squid)</p></td><td><p>속도2 / 부스트2 / 판정3 / 흡입5</p></td><td><p>파동형 펄스 분사 이동, 대각 유연 회피</p></td><td><p>먹물 은신 (피격 위기 시 자동 먹물/1.5초 무적)</p></td><td><p>심해어, 랜턴피시, 심해새우, 갯지렁이, 갑오징어, 명태, 대구, 심해게, 암모나이트, 크릴새우 떼</p></td></tr><tr><td><p>메갈로돈 (Megalodon)</p></td><td><p>속도2 / 부스트3 / 판정5 / 흡입4</p></td><td><p>묵직한 중량감, 둔직한 강행 돌파</p></td><td><p>최상위 장갑 (소형 바위/잠수함 파괴 통과)</p></td><td><p>고대고래, 대형바다거북, 매너티, 바다사자 떼, 대형참치, 대형가오리, 고대상어, 해양파충류, 향고래, 고대다랑어</p></td></tr></tbody></table>

# **12\. 상대, 장애물 및 기믹 명부**

**• 바위 (Rocks):** 고정 지형 구조물. 해저에서 무너져 내리거나 돌출되어 상하 회피 유도.

**• 그물 (Nets):** 넓은 수중 범위를 차단하며 상하로 천천히 이동하는 위험 요소.

**• 잠수함 (Submarines):** 일정 간격으로 어뢰를 발사하거나 직진 이동하는 기계적 적.

**• 인간 잠수부 사냥꾼 (Human Divers):** 작살총을 발사하거나 서치라이트 수색을 진행하는 사냥꾼.

**• 라이벌 캐릭터 (Rival Marine Life):** 선택하지 않은 다른 주인공 생물이 난입하여 먹이를 경쟁하거나 장애물로 작용.

# **13\. 상세 화면 구성 (HUD, Settings, Results)**

## **13.1 인게임 HUD**

상단 불투명도 40% 다크 네이비 패널 (\`#0B192C\`).  
\- 좌측: 일시정지 \`\[≡\]\` 버튼 + 남은 LIVES 아이콘 (3~6개, 네온 핑크 지느러미).  
\- 중앙: STAGE PROGRESS 프로로그 바 (가로 220dp, 이동하는 범고래 핀).  
\- 우측: SCORE (네온 옐로우 22pt) + COMBO 배지 및 타이머 바.

## **13.2 설정 화면 (Settings Modal)**

반투명 수중 샌드블라스트 유리 모달 (Glassmorphism).  
\- 목숨 수 선택: \`\[ 3회 \]\` \`\[ 4회 \]\` \`\[ 5회 \]\` \`\[ 6회 \]\` 라디오 버튼.  
\- 조작키 위치 미세조정: \`\[ 🛠️ UI 위치/크기 변경 \]\` 버튼으로 X/Y 오프셋, 크기(80%~120%), 투명도(20%~100%) 커스텀.  
\- 사운드 & 햅틱: BGM, SFX, Haptic 슬라이더.

## **13.3 결과 화면 (Score Result Screen)**

STAGE CLEAR / GAME OVER 타이틀, 카운팅 점수, MAX COMBO, 획득한 먹이 아이콘 10종 그리드, NEW RECORD 🏆 배지, 액션 버튼 3종 (\`\[RETRY\]\`, \`\[MAIN\]\`, \`\[LEADERBOARD\]\`).

# **14\. 오디오 사운드 사양 (Audio Specification)**

• BGM: 메인 타이틀(몽환적 수중 BGM), Stage 1~5(경쾌한 아케이드 수중 리듬 → 해구 마그마 중저음 BGM), 콤보 피버(템포 x1.15 BGM).  
• SFX: 먹이 획득(Pling!), 콤보 피치 상승, 충돌/피격(Thud!), JUMP 수중 파열음, 보스 포효음.

# **15\. 기술, 모바일 최적화 및 저장 스키마**

## **15.1 엔진 모바일 최적화 가이드 (Unity & Unreal)**

-   1\. 드로우콜 최적화: Static/Dynamic Batching, SRP Batcher, UI Sprite Atlas 필수 적용.
-   2\. 메모리 & GC 관리: Object Pooling 패턴으로 Instantiate/Destroy 및 Spawn/Destroy 제거, C# StringBuilder 사용 및 임시 메모리 할당 차단.
-   3\. UI 스케일링: Unity Canvas Scaler (Scale With Screen Size, Reference 1280x720, Match 0.5) & Unreal DPI Scaling Curve 적용.
-   4\. Safe Area 대응: Screen.safeArea 스크립트로 노치 및 펀치홀 영역 자동 렌더링 세이프존 확보.
-   5\. 발열 & 프레임 제한: targetFrameRate = 60 고정, Addressables / Pak Files 에셋 분할 로딩, 온디바이스 프로파일링(Unity Profiler / Unreal Insights) 수행.

## **15.2 저장 데이터 스키마 (Save Schema)**

type SaveData = {  
introSeen: boolean;  
selectedLives: number; // 3, 4, 5, 6  
unlockedStage: number; // 1 ~ 5  
unlockedCharacters: string\[\]; // \['killer\_whale', 'shark', ...\]  
selectedCharacter: string;  
controlOffset: { jumpX: number, jumpY: number, dpadX: number, dpadY: number, opacity: number };  
bestScoreByStage: Record<string, number>;  
bestStarsByStage: Record<string, number>;  
preyCollection: Record<string, boolean>; // 50종 먹이 수집 여부  
};

# **16\. 에셋 프로덕션 AI 프롬프트 시트 (Prompts)**

## **16.1 6초 인트로 Sora 비디오 프롬프트**

PROMPT: "A 6-second cinematic 3D arcade game intro video. Starts in dark deep ocean with red flashing warning lights and rising bubbles. A sleek stylized Orca with glowing cyan neon lines rushes directly toward camera. Breaches ocean surface into dramatic sunset with splashing water particles and god rays, dives back down with shockwave. High contrast, Unreal Engine 5 render, 8k --ar 16:9"

## **16.2 첫 화면 (타이틀) 이미지 프롬프트**

PROMPT: "Mobile game main title screen for horizontal arcade game named KILLER WHALE. Deep blue underwater background with rays of sunlight. Majestic 3D stylized Orca swimming dynamically surrounded by glowing cyan plankton. Bold 3D typography logo reading KILLER WHALE with glossy water-bubble texture. Glowing cyan round button at bottom center START. 8k --ar 16:9"

## **16.3 앱 아이콘 프롬프트 (모바일 & 데스크톱)**

Mobile Icon (Squircle): "Mobile game app icon, squircle shape with rounded corners. Dynamic 3D stylized Orca leaping out of vibrant blue ocean with splashing water drops and glowing cyan trails. High contrast, 3D render --ar 1:1"  
Desktop Icon (Circular Emblem): "Desktop game app icon, transparent background, circular 3D metallic badge style. Orca fin slicing through swirling water vortex ring with glowing neon blue particles. Metallic texture, 3D badge --ar 1:1"

# **17\. 코딩 에이전트 전달문 (Senior Developer Brief)**

• 역할: 시니어 모바일 게임 개발자.  
• 목표: 본 Form\_1\_5 기획서 사양을 100% 준수하여 범고래 (Killer Whale) 게임을 구현한다.  
• 핵심 규칙: D1~D10 결정 로그 엄수, Object Pooling 필수 적용, 가로 해상도 반응형 대응, 자리표시자만으로도 18절 1차 완료를 통과할 수 있도록 구조화할 것.

# **18\. 완료 기준 및 착수 검토 (Completion Criteria)**

<table><tbody><tr><td><p><strong>번호</strong></p></td><td><p><strong>완료 검증 기준</strong></p></td><td><p><strong>확인 방법</strong></p></td></tr><tr><td><p>1</p></td><td><p>자리표시자만으로 타이틀부터 5개 스테이지 진입 및 클리어 가능</p></td><td><p>에셋 미적용 상태에서 플레이 루프 검증</p></td></tr><tr><td><p>2</p></td><td><p>양손 엄지 조작(JUMP, 4방향 D-Pad) 및 컨트롤 오프셋 커스텀 동작</p></td><td><p>설정 메뉴에서 UI 위치 변경 후 세이브 검증</p></td></tr><tr><td><p>3</p></td><td><p>주인공 5종 패시브 스킬 및 전용 먹이 50종 획득/콤보 반영</p></td><td><p>캐릭터 선택 및 인게임 먹이 콤보 테스트</p></td></tr><tr><td><p>4</p></td><td><p>5개 스테이지별 보스전 패턴 및 특수 이벤트 정상 발동</p></td><td><p>각 스테이지 후반부 클라이맥스 검증</p></td></tr><tr><td><p>5</p></td><td><p>설정된 목숨(3~6회) 소진 시 정상 게임 오버 및 스코어 정산</p></td><td><p>피격 및 결과 화면 로컬 데이터 저장 검증</p></td></tr></tbody></table>

# **19\. 착수 판정 (Sign-off)**

**• 기획 검토 결과:** 기존 Form\_1\_4의 모든 요구사항을 충족하고, 신규 브레인스토밍 사양이 완전하게 통합되어 즉시 엔진 개발 및 에셋 프로덕션에 착수 가능함을 확인함.  
**• 최종 착수 판정:** 개발 착수 가능 (APPROVED FOR PRODUCTION)
