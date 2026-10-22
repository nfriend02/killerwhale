using System;

namespace KillerWhale.Core
{
    /// <summary>
    /// 게임의 전체 라이프사이클 상태를 정의하는 열거형
    /// </summary>
    public enum GameState
    {
        Boot,
        Intro,
        Title,
        CharacterSelect,
        StageSelect,
        Playing,
        Paused,
        StageClear,
        GameOver,
        Ending
    }

    /// <summary>
    /// 선택 가능한 플레이어 캐릭터 5종
    /// </summary>
    public enum CharacterType
    {
        KillerWhale,    // 범고래 (올라운더 / 밸런스형)
        Shark,          // 상어 (기습 / 속도 특화형)
        BlueMarlin,     // 청새치 (초고속 직진 / 돌진형)
        GiantSquid,     // 대왕오징어 (심해 / 유연 흡입형)
        Megalodon       // 메갈로돈 (고대 파워 / 돌파형)
    }

    /// <summary>
    /// 5개 스테이지 식별자
    /// </summary>
    public enum StageIndex
    {
        Stage1_Pacific = 1,         // 태평양 (입문)
        Stage2_Antarctic = 2,       // 남극 (얼음/오로라)
        Stage3_TropicalReef = 3,    // 열대 산호초 (네온 미로/급류)
        Stage4_AtlanticDeep = 4,    // 대서양 심해 (스텔스/암전)
        Stage5_MarianaTrench = 5    // 마리아나 해구 (소용돌이/용암)
    }

    /// <summary>
    /// 접촉 및 충돌 규칙 클래스 (기획서 8절 준수)
    /// </summary>
    public enum CollisionType
    {
        Pickup,         // 먹이 획득
        Hazard,         // 일반 위험 (목숨 -1, 1.5초 무적)
        Solid,          // 지형/대형 오브젝트 (이동 경로 차단)
        Slow,           // 감속 구간 (속도 x0.6)
        BossAttack,     // 보스 패턴 공격
        GoalExit        // 스테이지 완료
    }

    /// <summary>
    /// 장애물 종류
    /// </summary>
    public enum HazardKind
    {
        Rock,               // 바위 지형
        Net,                // 그물
        Submarine,          // 잠수함 본체
        Torpedo,            // 유도 어뢰
        HumanDiver,         // 잠수부
        Harpoon,            // 작살
        RivalMarineLife,    // 라이벌 생물
        FallingIce,         // 낙하 유빙
        PoisonSpike,        // 독가시
        MagmaBubble         // 마그마 기포
    }

    /// <summary>
    /// 보스 FSM 상태
    /// </summary>
    public enum BossState
    {
        Idle,
        AttackPattern1,
        AttackPattern2,
        SpecialAttack,
        WeakPhase,
        Defeated
    }

    /// <summary>
    /// 인게임 특수 환경 이벤트 종류
    /// </summary>
    public enum StageEventType
    {
        None,
        FeedingFrenzy,      // Stage 1: 정어리 떼 피버 타임
        IcebergCollapse,    // Stage 2: 유빙 대붕괴
        CurrentRush,        // Stage 3: 해저 급류 래프팅
        BioluminescentMode, // Stage 4: 자발광 암전 타임
        AbyssalVortex       // Stage 5: 심연의 소용돌이
    }
}
