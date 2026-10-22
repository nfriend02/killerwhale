/**
 * [미니게임 범고래 (Killer Whale)]
 * 횡스크롤 해양 아케이드 풀패키지 완제 게임 엔진 스크립트
 * Form_1_5 및 KillerWhale_Game_Design_Doc 100% 충실 반영
 */

// --- 1. 전용 먹이 50종 데이터베이스 (AI 생성 고화질 PNG 연동) ---
const PREY_DATABASE = {
    killer_whale: [
        { id: "kw_1", name: "물개", score: 100, icon: "🦭", imgPath: "assets/prey/killer_whale/kw_1_seal.png", rare: false },
        { id: "kw_2", name: "연어", score: 100, icon: "🐟", imgPath: "assets/prey/killer_whale/kw_2_salmon.png", rare: false },
        { id: "kw_3", name: "바다표범", score: 100, icon: "🦭", imgPath: "assets/prey/killer_whale/kw_3_fur_seal.png", rare: false },
        { id: "kw_4", name: "펭귄", score: 100, icon: "🐧", imgPath: "assets/prey/killer_whale/kw_4_penguin.png", rare: false },
        { id: "kw_5", name: "청어", score: 100, icon: "🐟", imgPath: "assets/prey/killer_whale/kw_5_herring.png", rare: false },
        { id: "kw_6", name: "가오리", score: 100, icon: "🐡", imgPath: "assets/prey/killer_whale/kw_6_stingray.png", rare: false },
        { id: "kw_7", name: "바다사자", score: 100, icon: "🦭", imgPath: "assets/prey/killer_whale/kw_7_sea_lion.png", rare: false },
        { id: "kw_8", name: "오징어", score: 100, icon: "🦑", imgPath: "assets/prey/killer_whale/kw_8_squid.png", rare: false },
        { id: "kw_9", name: "왕바다표범", score: 300, icon: "🦭", imgPath: "assets/prey/killer_whale/kw_9_elephant_seal.png", rare: true },
        { id: "kw_10", name: "정어리 떼", score: 300, icon: "🐟", imgPath: "assets/prey/killer_whale/kw_10_sardines.png", rare: true }
    ],
    shark: [
        { id: "sk_1", name: "참치", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_1_tuna.png", rare: false },
        { id: "sk_2", name: "고등어", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_2_mackerel.png", rare: false },
        { id: "sk_3", name: "바다거북", score: 300, icon: "🐢", imgPath: "assets/prey/shark/sk_3_turtle.png", rare: true },
        { id: "sk_4", name: "정어리", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_4_sardine.png", rare: false },
        { id: "sk_5", name: "방어", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_5_yellowtail.png", rare: false },
        { id: "sk_6", name: "꽁치", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_6_saury.png", rare: false },
        { id: "sk_7", name: "삼치", score: 100, icon: "🐟", imgPath: "assets/prey/shark/sk_7_spanish_mackerel.png", rare: false },
        { id: "sk_8", name: "날치", score: 300, icon: "🐟", imgPath: "assets/prey/shark/sk_8_flying_fish.png", rare: true },
        { id: "sk_9", name: "갑각류(게)", score: 100, icon: "🦀", imgPath: "assets/prey/shark/sk_9_crab.png", rare: false },
        { id: "sk_10", name: "쥐치", score: 100, icon: "🐠", imgPath: "assets/prey/shark/sk_10_filefish.png", rare: false }
    ],
    blue_marlin: [
        { id: "bm_1", name: "무늬오징어", score: 300, icon: "🦑", imgPath: "assets/prey/blue_marlin/bm_1_reef_squid.png", rare: true },
        { id: "bm_2", name: "만새기", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_2_mahimahi.png", rare: false },
        { id: "bm_3", name: "날치", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_3_flying_fish.png", rare: false },
        { id: "bm_4", name: "멸치 떼", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_4_anchovy.png", rare: false },
        { id: "bm_5", name: "삼치", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_5_spanish_mackerel.png", rare: false },
        { id: "bm_6", name: "고등어", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_6_mackerel.png", rare: false },
        { id: "bm_7", name: "전갱이", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_7_horse_mackerel.png", rare: false },
        { id: "bm_8", name: "청새치 치어", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_8_young_marlin.png", rare: false },
        { id: "bm_9", name: "꽁치", score: 100, icon: "🐟", imgPath: "assets/prey/blue_marlin/bm_9_saury.png", rare: false },
        { id: "bm_10", name: "바다새", score: 300, icon: "🕊️", imgPath: "assets/prey/blue_marlin/bm_10_seabird.png", rare: true }
    ],
    giant_squid: [
        { id: "gs_1", name: "심해어", score: 100, icon: "🐟", imgPath: "assets/prey/giant_squid/gs_1_anglerfish.png", rare: false },
        { id: "gs_2", name: "랜턴피시", score: 100, icon: "🏮", imgPath: "assets/prey/giant_squid/gs_2_lanternfish.png", rare: false },
        { id: "gs_3", name: "심해 새우", score: 100, icon: "🦐", imgPath: "assets/prey/giant_squid/gs_3_shrimp.png", rare: false },
        { id: "gs_4", name: "갯지렁이", score: 100, icon: "🪱", imgPath: "assets/prey/giant_squid/gs_4_worm.png", rare: false },
        { id: "gs_5", name: "갑오징어", score: 100, icon: "🦑", imgPath: "assets/prey/giant_squid/gs_5_cuttlefish.png", rare: false },
        { id: "gs_6", name: "명태", score: 100, icon: "🐟", imgPath: "assets/prey/giant_squid/gs_6_pollock.png", rare: false },
        { id: "gs_7", name: "대구", score: 100, icon: "🐟", imgPath: "assets/prey/giant_squid/gs_7_cod.png", rare: false },
        { id: "gs_8", name: "심해 게", score: 100, icon: "🦀", imgPath: "assets/prey/giant_squid/gs_8_crab.png", rare: false },
        { id: "gs_9", name: "암모나이트", score: 300, icon: "🐚", imgPath: "assets/prey/giant_squid/gs_9_ammonite.png", rare: true },
        { id: "gs_10", name: "크릴새우 떼", score: 300, icon: "🦐", imgPath: "assets/prey/giant_squid/gs_10_krill.png", rare: true }
    ],
    megalodon: [
        { id: "mg_1", name: "고대 고래", score: 100, icon: "🐋", imgPath: "assets/prey/megalodon/mg_1_ancient_whale.png", rare: false },
        { id: "mg_2", name: "대형 바다거북", score: 100, icon: "🐢", imgPath: "assets/prey/megalodon/mg_2_giant_turtle.png", rare: false },
        { id: "mg_3", name: "대형 매너티", score: 100, icon: "🦭", imgPath: "assets/prey/megalodon/mg_3_manatee.png", rare: false },
        { id: "mg_4", name: "바다사자 떼", score: 100, icon: "🦭", imgPath: "assets/prey/megalodon/mg_4_sea_lion_pack.png", rare: false },
        { id: "mg_5", name: "대형 참치", score: 100, icon: "🐟", imgPath: "assets/prey/megalodon/mg_5_bluefin.png", rare: false },
        { id: "mg_6", name: "대형 가오리", score: 100, icon: "🐡", imgPath: "assets/prey/megalodon/mg_6_manta_ray.png", rare: false },
        { id: "mg_7", name: "고대 상어", score: 300, icon: "🦈", imgPath: "assets/prey/megalodon/mg_7_ancient_shark.png", rare: true },
        { id: "mg_8", name: "해양 파충류", score: 100, icon: "🐊", imgPath: "assets/prey/megalodon/mg_8_mosasaur.png", rare: false },
        { id: "mg_9", name: "향고래", score: 300, icon: "🐳", imgPath: "assets/prey/megalodon/mg_9_sperm_whale.png", rare: true },
        { id: "mg_10", name: "고대 다랑어", score: 100, icon: "🐟", imgPath: "assets/prey/megalodon/mg_10_giant_tuna.png", rare: false }
    ]
};

// --- 2. 5종 캐릭터 사양 (AI 생성 3D 고화질 PNG 연동, 1.7배 스케일업) ---
const CHARACTERS = [
    {
        key: "killer_whale",
        name: "범고래 (Killer Whale)",
        avatar: "🐋",
        imgPath: "assets/characters/killer_whale.png",
        trait: "올라운더 / 밸런스형",
        skill: "초음파 탐지: 위험 요소 1.5초 전 경고 점멸",
        speed: 0.6, boost: 0.6, hitbox: 0.6, magnet: 0.6,
        baseSpeed: 5.8, boostPower: 6.5, drag: 0.88, magnetRadius: 135, hitboxRadius: 40,
        comboDuration: 2.8
    },
    {
        key: "shark",
        name: "상어 (Shark)",
        avatar: "🦈",
        imgPath: "assets/characters/shark.png",
        trait: "기습 / 속도 특화형",
        skill: "피의 포식: 연속 포식 시 이속 누적 +20% & 최대 콤보 x4.0",
        speed: 0.8, boost: 0.8, hitbox: 0.4, magnet: 0.4,
        baseSpeed: 7.0, boostPower: 7.8, drag: 0.94, magnetRadius: 115, hitboxRadius: 34,
        comboDuration: 2.0
    },
    {
        key: "blue_marlin",
        name: "청새치 (Blue Marlin)",
        avatar: "🐟",
        imgPath: "assets/characters/blue_marlin.png",
        trait: "초고속 직진 / 돌진형",
        skill: "바늘 돌진: 점프 시 전방 순간 돌진 & 소형 그물/적 1회 관통 파괴",
        speed: 1.0, boost: 1.0, hitbox: 0.35, magnet: 0.2,
        baseSpeed: 8.5, boostPower: 9.0, drag: 0.82, magnetRadius: 85, hitboxRadius: 30,
        comboDuration: 2.0
    },
    {
        key: "giant_squid",
        name: "대왕오징어 (Giant Squid)",
        avatar: "🦑",
        imgPath: "assets/characters/giant_squid.png",
        trait: "심해 / 특수 궤적 유연형",
        skill: "먹물 은신: 초광범위 흡입. 피격 위기 시 먹물 분사 감속 & 무적 2회",
        speed: 0.4, boost: 0.4, hitbox: 0.6, magnet: 1.0,
        baseSpeed: 4.8, boostPower: 5.5, drag: 0.86, magnetRadius: 210, hitboxRadius: 38,
        comboDuration: 2.0
    },
    {
        key: "megalodon",
        name: "메갈로돈 (Megalodon)",
        avatar: "🦈",
        imgPath: "assets/characters/megalodon.png",
        trait: "고대 파워 / 돌파형",
        skill: "최상위 장갑: 보호막 충전 시 소형 바위/잠수함 파괴 통과",
        speed: 0.4, boost: 0.6, hitbox: 1.0, magnet: 0.8,
        baseSpeed: 4.5, boostPower: 6.2, drag: 0.80, magnetRadius: 160, hitboxRadius: 52,
        comboDuration: 2.0
    }
];

// --- 3. 5개 스테이지 사양 (스토리 & King of Enemies 라이벌 보스 연동) ---
const STAGES = [
    {
        index: 1,
        name: "Stage 1: 태평양의 패자",
        sub: "Pacific Ocean - Rise of the Predator",
        primaryColor: "#00B4D8",
        bgGrad: ["#0077B6", "#00B4D8", "#90E0EF"],
        parTime: 58,
        totalDist: 9000,
        event: "feeding_frenzy",
        eventText: "정어리 떼 피딩 프렌지! (FEVER TIME)",
        bossName: "헤파이토스 호 & 드론",
        rivalKingKey: "shark",
        rivalKingName: "King of Enemies: 황제 백상아리",
        lore: "눈부신 햇살이 비치는 태평양 표층. 그러나 깊은 수중에서는 영해의 패권을 노리는 거대 상어가 도사리고 있습니다.",
        bridge: "태평양의 패권을 노리던 거대 백상아리의 맹렬한 습격을 극적인 3D 공중제비로 회피하고, 차가운 극지의 빙하 해역으로 진입합니다!"
    },
    {
        index: 2,
        name: "Stage 2: 남극의 유빙 해협",
        sub: "Antarctic Ocean - Frozen Frontier",
        primaryColor: "#0077B6",
        bgGrad: ["#03045E", "#0077B6", "#E0FAFF"],
        parTime: 60,
        totalDist: 9500,
        event: "iceberg_collapse",
        eventText: "경고: 유빙 대붕괴! 낙하하는 빙하를 회피하세요!",
        bossName: "고대 아이스 크라켄",
        rivalKingKey: "blue_marlin",
        rivalKingName: "King of Enemies: 초음속 청새치",
        lore: "거대한 유빙과 크레바스가 뒤엉킨 극한의 남극해. 음속으로 얼음 바다를 가르는 청새치의 영역입니다.",
        bridge: "빙하 협곡을 음속으로 꿰뚫는 청새치의 치명적인 바늘 돌진을 연속 회피하여 생환했습니다. 이제 화려한 네온 산호초 미로로 향합니다!"
    },
    {
        index: 3,
        name: "Stage 3: 열대 산호초의 미궁",
        sub: "Tropical Coral Reef - Neon Labyrinth",
        primaryColor: "#FF007F",
        bgGrad: ["#3A0CA3", "#7209B7", "#FF007F"],
        parTime: 60,
        totalDist: 10000,
        event: "current_rush",
        eventText: "해저 급류 래프팅! (이동속도 2배 가속)",
        bossName: "쏠배감펭 퀸",
        rivalKingKey: "giant_squid",
        rivalKingName: "King of Enemies: 심해 제왕 대왕오징어",
        lore: "화려한 네온 산호초와 위험한 급류가 소용돌이치는 곳. 어둠 속에서 뻗어 나오는 무수한 촉수가 먹이를 노립니다.",
        bridge: "빛나는 네온 산호초 심연에서 뻗쳐나온 대왕오징어의 초거대 촉수 포획을 뚫고, 빛이 전혀 닿지 않는 대서양 칠흑의 심해로 침투합니다!"
    },
    {
        index: 4,
        name: "Stage 4: 대서양 심해의 암전",
        sub: "Atlantic Deep Sea - Abyssal Darkness",
        primaryColor: "#0B090A",
        bgGrad: ["#050505", "#0F141C", "#1E293B"],
        parTime: 65,
        totalDist: 11000,
        event: "bioluminescent",
        eventText: "자발광 암전 타임! (생체 발광체 감지 모드)",
        bossName: "스텔스 잠수함 네모-X",
        rivalKingKey: "megalodon",
        rivalKingName: "King of Enemies: 고대 폭군 메갈로돈",
        lore: "영겁의 암흑이 지배하는 대서양의 깊은 해구. 멸종된 줄 알았던 고대 괴수 메갈로돈이 침묵 속에 도사립니다.",
        bridge: "칠흑 같은 심해의 암흑 속에서 덮쳐오는 고대 최상위 포식자 메갈로돈의 강철 턱을 완벽히 피해냈습니다! 마침내 지각이 갈라지는 최종 결전지, 마리아나 해구로 강하합니다!"
    },
    {
        index: 5,
        name: "Stage 5: 마리아나 해구의 심연",
        sub: "Mariana Trench - Sovereign of the Abyss",
        primaryColor: "#DC2F02",
        bgGrad: ["#240046", "#7A0026", "#DC2F02"],
        parTime: 70,
        totalDist: 12000,
        event: "abyssal_vortex",
        eventText: "심연의 소용돌이! (중앙 흡인 탈출)",
        bossName: "심연의 군주 용암 레비아탄",
        rivalKingKey: "killer_whale",
        rivalKingName: "King of Enemies: 심연의 지배자 황제 범고래",
        lore: "지구상 가장 깊고 위험한 마리아나 해구. 끓어오르는 열수구와 수압 속에서 바다의 단 한 마리 절대 군주가 결정됩니다.",
        bridge: "마리아나 해구의 심연 속에서 모든 포식자들의 지배자를 상대로 완벽한 전설적 회피를 달성했습니다! 당신은 이제 전 바다의 유일무이한 절대 군주입니다!"
    }
];

// --- 4. Web Audio 사운드 신디사이저 ---
class SoundManager {
    constructor() {
        this.ctx = null;
        this.bgmGain = null;
        this.sfxGain = null;
        this.bgmVolume = 0.8;
        this.sfxVolume = 0.9;
        this.pitchRatio = 1.0;
        this.bgmOsc = null;
        this.isMuted = false;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.gain.value = this.bgmVolume;
        this.sfxGain.gain.value = this.sfxVolume;

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
    }

    setVolumes(bgm, sfx) {
        this.bgmVolume = bgm;
        this.sfxVolume = sfx;
        if (this.bgmGain) this.bgmGain.gain.value = bgm;
        if (this.sfxGain) this.sfxGain.gain.value = sfx;
    }

    playPreyEat(pitch) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        const baseFreq = 523.25; // C5
        osc.frequency.setValueAtTime(baseFreq * pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * pitch * 1.5, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
    }

    playHit() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.5 * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
    }

    playJump() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.19);
    }

    // 3D 에어로배틱 회피(Dodge) 바람 가르는 스위시 SFX
    playDodgeWhoosh() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(820, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.35);

        gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // 회피 성공 시 번쩍거리는 번개 폭풍 & 천둥 SFX
    playLightningStrike() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // 1. 강렬한 전기 크래시 (Sawtooth Spark)
        const zap = this.ctx.createOscillator();
        const zGain = this.ctx.createGain();
        zap.type = "sawtooth";
        zap.frequency.setValueAtTime(920, now);
        zap.frequency.exponentialRampToValueAtTime(120, now + 0.28);
        zGain.gain.setValueAtTime(0.65 * this.sfxVolume, now);
        zGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        zap.connect(zGain);
        zGain.connect(this.sfxGain);
        zap.start(now);
        zap.stop(now + 0.35);

        // 2. 묵직한 천둥 저음 폭발 (Thunder Rumble)
        const thun = this.ctx.createOscillator();
        const tGain = this.ctx.createGain();
        thun.type = "triangle";
        thun.frequency.setValueAtTime(130, now);
        thun.frequency.exponentialRampToValueAtTime(32, now + 0.55);
        tGain.gain.setValueAtTime(0.7 * this.sfxVolume, now);
        tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        thun.connect(tGain);
        tGain.connect(this.sfxGain);
        thun.start(now);
        thun.stop(now + 0.65);
    }

    // King of Enemies 습격 충전 포효
    playKingRoar() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const roar = this.ctx.createOscillator();
        const rGain = this.ctx.createGain();
        roar.type = "sawtooth";
        roar.frequency.setValueAtTime(90, now);
        roar.frequency.linearRampToValueAtTime(180, now + 0.25);
        roar.frequency.exponentialRampToValueAtTime(45, now + 0.6);
        rGain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
        rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        roar.connect(rGain);
        rGain.connect(this.sfxGain);
        roar.start(now);
        roar.stop(now + 0.7);
    }

    // 스테이지 클리어 미션 성공 찬란한 승리 팡파레 SFX
    playMissionSuccess() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = idx % 2 === 0 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(0.35 * this.sfxVolume, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.85);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.9);
        });
    }

    // 스테이지 클리어 미션 실패 시무룩 멜랑콜리 SFX
    playMissionFail() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [392.00, 349.23, 311.13, 261.63, 220.00];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, now + idx * 0.22);
            gain.gain.setValueAtTime(0.28 * this.sfxVolume, now + idx * 0.22);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.22 + 0.55);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.22);
            osc.stop(now + idx * 0.22 + 0.6);
        });
    }

    // 기획서 6.1절 시네마틱 6초 인트로 사운드트랙 (하이브리드 신디사이저)
    playCinematicIntroAudio() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. [0.0s ~ 2.0s] 저주파 심해 울림 (Sub-bass rumble)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(65, now);
        subOsc.frequency.linearRampToValueAtTime(85, now + 1.5);
        subGain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
        subGain.gain.linearRampToValueAtTime(0.6 * this.sfxVolume, now + 1.8);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 3.0);
        subOsc.connect(subGain);
        subGain.connect(this.sfxGain);
        subOsc.start(now);
        subOsc.stop(now + 3.0);

        // 2. [0.5s ~ 1.5s] 경고 사이렌 펄스
        for (let i = 0; i < 2; i++) {
            const beep = this.ctx.createOscillator();
            const bGain = this.ctx.createGain();
            beep.type = "triangle";
            beep.frequency.setValueAtTime(580, now + 0.4 + i * 0.6);
            bGain.gain.setValueAtTime(0.25 * this.sfxVolume, now + 0.4 + i * 0.6);
            bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + i * 0.6);
            beep.connect(bGain);
            bGain.connect(this.sfxGain);
            beep.start(now + 0.4 + i * 0.6);
            beep.stop(now + 0.75 + i * 0.6);
        }

        // 3. [1.8s ~ 3.5s] 범고래 초고속 수중 돌진음 (Water whoosh)
        const whoosh = this.ctx.createOscillator();
        const wGain = this.ctx.createGain();
        whoosh.type = "sawtooth";
        whoosh.frequency.setValueAtTime(120, now + 1.8);
        whoosh.frequency.exponentialRampToValueAtTime(450, now + 3.4);
        wGain.gain.setValueAtTime(0.05 * this.sfxVolume, now + 1.8);
        wGain.gain.linearRampToValueAtTime(0.35 * this.sfxVolume, now + 3.2);
        wGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
        whoosh.connect(wGain);
        wGain.connect(this.sfxGain);
        whoosh.start(now + 1.8);
        whoosh.stop(now + 3.6);

        // 4. [3.5s ~ 5.0s] 수면 수직 점프 & 파도 Splash 물보라
        const splash = this.ctx.createOscillator();
        const spGain = this.ctx.createGain();
        splash.type = "sine";
        splash.frequency.setValueAtTime(800, now + 3.5);
        splash.frequency.exponentialRampToValueAtTime(200, now + 4.8);
        spGain.gain.setValueAtTime(0.45 * this.sfxVolume, now + 3.5);
        spGain.gain.exponentialRampToValueAtTime(0.01, now + 4.9);
        splash.connect(spGain);
        spGain.connect(this.sfxGain);
        splash.start(now + 3.5);
        splash.stop(now + 4.9);

        // 5. [5.0s ~ 6.0s] 수중 재입수 충격파 & 타이틀 엠블럼 임팩트
        const impact = this.ctx.createOscillator();
        const impGain = this.ctx.createGain();
        impact.type = "triangle";
        impact.frequency.setValueAtTime(160, now + 5.0);
        impact.frequency.exponentialRampToValueAtTime(35, now + 5.8);
        impGain.gain.setValueAtTime(0.6 * this.sfxVolume, now + 5.0);
        impGain.gain.exponentialRampToValueAtTime(0.001, now + 5.95);
        impact.connect(impGain);
        impGain.connect(this.sfxGain);
        impact.start(now + 5.0);
        impact.stop(now + 6.0);
    }
}

// --- 5. Main Game Engine Class ---
class KillerWhaleGame {
    constructor() {
        window.gameInstance = this;
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.audio = new SoundManager();

        // Runtime State: first -> intro -> login -> nickname -> play -> ending -> still -> result -> mypage
        this.state = "first";
        this.selectedCharIndex = 0;
        this.currentStageIndex = 1;
        this.maxLives = 4;
        this.currentLives = 4;
        this.settingsSourceState = "title";
        this.isDevPaused = false;
        this.isAdminAuthorized = false;
        this.isInvincible = false;
        this.invincibleTimer = 0;

        // Score and Combo Metrics
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.multiplier = 1.0;
        this.comboTimer = 0;
        this.isFever = false;

        // Stage Progress
        this.distance = 0;
        this.stageData = STAGES[0];
        this.specialEventActive = false;
        this.bossActive = false;
        this.boss = null;

        // 3D Jump Evasion & Invincibility Save State
        this.dodgeTimer = 0;
        this.isDodging = false;
        this.dodgeRollAngle = 0;

        // King of Enemies Rival Boss & Lightning Evasion Mission State
        this.kingActive = false;
        this.king = null;
        this.evasionSuccessCount = 0;
        this.requiredEvasions = 4;
        this.lightningFlash = 0;
        this.lightningBolts = [];
        this.dodgeSuccessBannerTimer = 0;
        this.dodgeSuccessBannerText = "";
        this.isKingMissionBoxVisible = false; // King of Enemies description box is NOT visible by default

        // Player Physics
        this.player = {
            x: 200,
            y: 360,
            vx: 0,
            vy: 0,
            angle: 0,
            radius: 28,
            magnetRadius: 90
        };

        // Input State
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            jump: false
        };

        // Skill State
        this.skillCooldown = 0;
        this.inkScreenCharges = 2;
        this.armorGauge = 100;
        this.bloodFrenzyBonus = 0;

        // Entity Pools
        this.preyList = [];
        this.hazardList = [];
        this.particles = [];
        this.bubbles = [];

        // Timers
        this.lastTime = performance.now();
        this.spawnPreyTimer = 0;
        this.spawnHazardTimer = 0;

        // Custom Assets and 3D Asset Loader
        this.customImages = {};
        this.characterImages = {};
        this.preyImages = {};
        this.hazardImages = {};
        this.gameTimer = 0;
        this.swimTimer = 0;
        this.loadCustomAssets();

        this.initBubbles();
        this.bindEvents();
        this.updateCharacterSelectUI();
        this.checkAdminStatus();

        // Initialize i18n switcher, auth lifecycle listeners, and gateway screen
        this.setupLanguageSwitcher();
        this.setupAuthEventListeners();
        this.setupFirstScreen();

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    loadCustomAssets() {
        // 1. 배경 및 모달 텍스처
        const assetMap = {
            title: "assets/title/title_bg.png",
            settings: "assets/settings/settings_modal_bg.png",
            results: "assets/results/result_bg.png",
            stage_1: "assets/stages/stage1_pacific.png",
            stage_2: "assets/stages/stage2_antarctic.png",
            stage_3: "assets/stages/stage3_tropical_reef.png",
            stage_4: "assets/stages/stage4_atlantic_deep.png",
            stage_5: "assets/stages/stage5_mariana_trench.png"
        };

        for (const [key, path] of Object.entries(assetMap)) {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                this.customImages[key] = img;
                if (key === "title") {
                    const bgLayer = document.getElementById("title-bg-layer");
                    if (bgLayer) bgLayer.style.backgroundImage = `url('${path}')`;
                }
                if (key === "settings") {
                    const card = document.getElementById("settings-card");
                    if (card) {
                        card.style.backgroundImage = `url('${path}')`;
                        card.style.backgroundSize = "cover";
                    }
                }
                if (key === "results") {
                    const card = document.getElementById("result-card");
                    if (card) {
                        card.style.backgroundImage = `url('${path}')`;
                        card.style.backgroundSize = "cover";
                    }
                }
            };
        }

        // 2. 캐릭터 5종 고화질 투명 스프라이트 로드
        CHARACTERS.forEach(char => {
            if (char.imgPath) {
                const cImg = new Image();
                cImg.src = char.imgPath;
                cImg.onload = () => {
                    this.characterImages[char.key] = cImg;
                    if (CHARACTERS[this.selectedCharIndex].key === char.key) {
                        this.updateCharacterSelectUI();
                    }
                };
            }
        });

        // 3. 전용 먹이 50종 고화질 투명 아이콘 로드 (3D 클린 에셋 캐시 갱신)
        Object.entries(PREY_DATABASE).forEach(([charKey, items]) => {
            items.forEach(item => {
                if (item.imgPath) {
                    const pImg = new Image();
                    pImg.src = `${item.imgPath}?v=3d_clean_20261021_v3`;
                    pImg.onload = () => {
                        this.preyImages[item.id] = pImg;
                    };
                }
            });
        });

        // 4. 3D 장애물 & 적 9종 고화질 투명 에셋 로드 (백그라운드 0 Alpha)
        const hazardFiles = [
            "hazard_mine", "hazard_torpedo", "hazard_submarine",
            "hazard_jellyfish", "hazard_diver", "hazard_iceberg",
            "hazard_net", "hazard_barracuda", "hazard_lionfish"
        ];
        hazardFiles.forEach(hid => {
            const hImg = new Image();
            hImg.src = `assets/hazards/${hid}.png`;
            hImg.onload = () => {
                this.hazardImages[hid] = hImg;
            };
        });
    }

    setupFirstScreen() {
        this.showScreen("screen-first");
        this.state = "first";

        const handleStartTransition = (e) => {
            if (e) {
                e.stopPropagation();
            }
            // 1. Audio Gesture: Unlock Web Audio API via first user interaction
            if (!this.audio.ctx) {
                this.audio.init();
            }
            // 2. Transition directly to login screen for user authentication!
            if (!window.authManager || !window.authManager.currentUser) {
                this.showScreen("screen-login");
                this.state = "login";
            } else if (!window.authManager.currentUser.nickname) {
                this.showScreen("screen-nickname");
                this.state = "nickname";
                const input = document.getElementById("input-nickname");
                if (input) input.focus();
            } else {
                this.showScreen("screen-title");
                this.state = "title";
                window.authManager.updateHeaderUI();
            }
        };

        const screenFirst = document.getElementById("screen-first");
        const firstStartBtn = document.getElementById("btn-first-start");

        if (screenFirst) {
            screenFirst.onclick = handleStartTransition;
            screenFirst.onpointerdown = handleStartTransition;
        }
        if (firstStartBtn) {
            firstStartBtn.onclick = handleStartTransition;
            firstStartBtn.onpointerdown = handleStartTransition;
        }
    }

    playIntroExplicitly() {
        const video = document.getElementById("intro-video");
        const introScreen = document.getElementById("screen-intro");
        const soundBtn = document.getElementById("btn-intro-sound");

        if (video && introScreen) {
            video.currentTime = 0;
            // Default audio is Off (Muted)
            video.muted = true;
            let isAudioActive = false;

            if (soundBtn) {
                soundBtn.innerText = "🔇 Sound Off (Default)";
                soundBtn.onclick = (e) => {
                    e.stopPropagation();
                    isAudioActive = !isAudioActive;
                    if (isAudioActive) {
                        video.removeAttribute("muted");
                        video.muted = false;
                        video.volume = 1.0;
                        if (!this.audio.ctx) this.audio.init();
                        this.audio.playCinematicIntroAudio();
                        soundBtn.innerText = "🔊 Sound On";
                    } else {
                        video.muted = true;
                        soundBtn.innerText = "🔇 Sound Off";
                    }
                };
            }

            const skipBtn = document.getElementById("btn-intro-skip");
            if (skipBtn) {
                skipBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.skipIntro();
                };
            }

            // Tapping on intro video screen also skips
            introScreen.onclick = () => this.skipIntro();

            video.onended = () => this.skipIntro();
            video.onerror = () => {
                console.log("[KillerWhaleGame] Video stream fallback. Transitioning to auth/title.");
                this.skipIntro();
            };

            this.showScreen("screen-intro");
            this.state = "intro";
            video.play().catch(() => this.skipIntro());
        } else {
            this.skipIntro();
        }
    }

    skipIntro() {
        const video = document.getElementById("intro-video");
        const introScreen = document.getElementById("screen-intro");
        if (video) video.pause();
        if (introScreen) introScreen.classList.add("hidden");

        // Auth Lifecycle Redirection: Check user session
        if (!window.authManager || !window.authManager.currentUser) {
            this.showScreen("screen-login");
            this.state = "login";
        } else if (!window.authManager.currentUser.nickname) {
            this.showScreen("screen-nickname");
            this.state = "nickname";
            const input = document.getElementById("input-nickname");
            if (input) input.focus();
        } else {
            this.showScreen("screen-title");
            this.state = "title";
            window.authManager.updateHeaderUI();
        }
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll(".lang-btn");
        langButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetLang = btn.dataset.lang;
                if (!targetLang || !window.i18n) return;

                langButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                window.i18n.setLang(targetLang);

                // Update phone code and placeholder based on country rules
                const phoneCodeInput = document.getElementById("login-phone-code");
                const phoneMainInput = document.getElementById("login-phone");
                if (phoneCodeInput && phoneMainInput) {
                    if (targetLang === "ja") {
                        phoneCodeInput.value = "+81";
                        phoneMainInput.placeholder = "090-1234-5678";
                    } else if (targetLang === "en") {
                        phoneCodeInput.value = "+1";
                        phoneMainInput.placeholder = "(555) 123-4567";
                    } else {
                        phoneCodeInput.value = "+82";
                        phoneMainInput.placeholder = "10-1234-5678";
                    }
                }

                // Refresh character select UI and MyPage if active
                if (this.state === "character_select") {
                    this.updateCharacterSelectUI();
                }
                if (this.state === "mypage") {
                    this.updateMyPageUI();
                }
            });
        });
    }

    setupAuthEventListeners() {
        // 1. Auth Tabs Switcher (Guest, Google, Email, Phone)
        const tabButtons = document.querySelectorAll(".auth-tab-btn");
        const tabPanels = document.querySelectorAll(".auth-tab-panel");
        const loginErrorMsg = document.getElementById("login-error-msg");

        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                tabButtons.forEach(b => b.classList.remove("active"));
                tabPanels.forEach(p => p.classList.remove("active"));

                btn.classList.add("active");
                const targetTab = btn.dataset.tab;
                const activePanel = document.getElementById(`tab-content-${targetTab}`);
                if (activePanel) activePanel.classList.add("active");

                if (loginErrorMsg) {
                    loginErrorMsg.classList.add("hidden");
                    loginErrorMsg.innerText = "";
                }
            });
        });

        // 2. Password Visibility Toggle (Show / Hide)
        document.querySelectorAll(".btn-toggle-password").forEach(toggleBtn => {
            toggleBtn.addEventListener("click", () => {
                const targetInputId = toggleBtn.dataset.target;
                const inputEl = document.getElementById(targetInputId);
                if (inputEl) {
                    const isMasked = inputEl.type === "password";
                    inputEl.type = isMasked ? "text" : "password";
                    toggleBtn.innerText = isMasked ? window.i18n.t("hidePassword") : window.i18n.t("showPassword");
                }
            });
        });

        // 3. Guest Login Button
        const btnGuest = document.getElementById("btn-login-guest");
        if (btnGuest) {
            btnGuest.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                const user = window.authManager.loginAsGuest();
                this.showScreen("screen-nickname");
                this.state = "nickname";
                const input = document.getElementById("input-nickname");
                if (input) input.focus();
            });
        }

        // 4. Google Login Button
        const btnGoogle = document.getElementById("btn-login-google");
        if (btnGoogle) {
            btnGoogle.addEventListener("click", async () => {
                if (!this.audio.ctx) this.audio.init();
                try {
                    const user = await window.authManager.loginWithGoogle();
                    if (!user.nickname) {
                        this.showScreen("screen-nickname");
                        this.state = "nickname";
                        const input = document.getElementById("input-nickname");
                        if (input) input.focus();
                    } else {
                        this.showScreen("screen-title");
                        this.state = "title";
                        window.authManager.updateHeaderUI();
                    }
                } catch (err) {
                    if (loginErrorMsg) {
                        loginErrorMsg.classList.remove("hidden");
                        loginErrorMsg.innerText = err.message || window.i18n.t("errLoginFailedEmail");
                    }
                }
            });
        }

        // 5. Email Auth (Login / Register Mode Toggle)
        let isEmailRegisterMode = false;
        const btnToggleEmailMode = document.getElementById("btn-toggle-email-mode");
        const emailConfirmGroup = document.getElementById("email-confirm-group");
        const btnSubmitEmail = document.getElementById("btn-submit-email");

        if (btnToggleEmailMode && emailConfirmGroup && btnSubmitEmail) {
            btnToggleEmailMode.addEventListener("click", () => {
                isEmailRegisterMode = !isEmailRegisterMode;
                if (isEmailRegisterMode) {
                    emailConfirmGroup.classList.remove("hidden");
                    btnSubmitEmail.innerText = window.i18n.t("btnRegister");
                    btnToggleEmailMode.innerText = window.i18n.t("toggleToLogin");
                } else {
                    emailConfirmGroup.classList.add("hidden");
                    btnSubmitEmail.innerText = window.i18n.t("btnLogin");
                    btnToggleEmailMode.innerText = window.i18n.t("toggleToRegister");
                }
                if (loginErrorMsg) loginErrorMsg.classList.add("hidden");
            });

            btnSubmitEmail.addEventListener("click", async () => {
                if (!this.audio.ctx) this.audio.init();
                const emailVal = document.getElementById("login-email")?.value;
                const passVal = document.getElementById("login-email-password")?.value;
                const confirmVal = document.getElementById("login-email-confirm")?.value;

                try {
                    const user = await window.authManager.loginWithEmail(emailVal, passVal, isEmailRegisterMode, confirmVal);
                    if (loginErrorMsg) loginErrorMsg.classList.add("hidden");

                    if (user.isNew || !user.nickname) {
                        this.showScreen("screen-nickname");
                        this.state = "nickname";
                        const input = document.getElementById("input-nickname");
                        if (input) input.focus();
                    } else {
                        this.showScreen("screen-title");
                        this.state = "title";
                        window.authManager.updateHeaderUI();
                    }
                } catch (err) {
                    if (loginErrorMsg) {
                        loginErrorMsg.classList.remove("hidden");
                        loginErrorMsg.innerText = err.message;
                    }
                }
            });
        }

        // 6. Phone Auth (Login / Register Mode Toggle)
        let isPhoneRegisterMode = false;
        const btnTogglePhoneMode = document.getElementById("btn-toggle-phone-mode");
        const phoneConfirmGroup = document.getElementById("phone-confirm-group");
        const btnSubmitPhone = document.getElementById("btn-submit-phone");

        if (btnTogglePhoneMode && phoneConfirmGroup && btnSubmitPhone) {
            btnTogglePhoneMode.addEventListener("click", () => {
                isPhoneRegisterMode = !isPhoneRegisterMode;
                if (isPhoneRegisterMode) {
                    phoneConfirmGroup.classList.remove("hidden");
                    btnSubmitPhone.innerText = window.i18n.t("btnRegister");
                    btnTogglePhoneMode.innerText = window.i18n.t("toggleToLogin");
                } else {
                    phoneConfirmGroup.classList.add("hidden");
                    btnSubmitPhone.innerText = window.i18n.t("btnLogin");
                    btnTogglePhoneMode.innerText = window.i18n.t("toggleToRegister");
                }
                if (loginErrorMsg) loginErrorMsg.classList.add("hidden");
            });

            btnSubmitPhone.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                const codeVal = document.getElementById("login-phone-code")?.value || "+82";
                const phoneVal = document.getElementById("login-phone")?.value;
                const passVal = document.getElementById("login-phone-password")?.value;
                const confirmVal = document.getElementById("login-phone-confirm")?.value;

                try {
                    const user = window.authManager.loginWithPhone(codeVal, phoneVal, passVal, isPhoneRegisterMode, confirmVal);
                    if (loginErrorMsg) loginErrorMsg.classList.add("hidden");

                    if (user.isNew || !user.nickname) {
                        this.showScreen("screen-nickname");
                        this.state = "nickname";
                        const input = document.getElementById("input-nickname");
                        if (input) input.focus();
                    } else {
                        this.showScreen("screen-title");
                        this.state = "title";
                        window.authManager.updateHeaderUI();
                    }
                } catch (err) {
                    if (loginErrorMsg) {
                        loginErrorMsg.classList.remove("hidden");
                        loginErrorMsg.innerText = err.message;
                    }
                }
            });
        }

        // 7. Nickname Setup Submission (Enter key + Button click)
        const nicknameInput = document.getElementById("input-nickname");
        const btnSubmitNickname = document.getElementById("btn-submit-nickname");
        const nicknameErrorMsg = document.getElementById("nickname-error-msg");

        const handleNicknameSubmission = () => {
            if (!nicknameInput) return;
            const val = nicknameInput.value;
            try {
                window.authManager.setNickname(val);
                if (nicknameErrorMsg) nicknameErrorMsg.classList.add("hidden");

                this.showScreen("screen-title");
                this.state = "title";
                window.authManager.updateHeaderUI();
            } catch (err) {
                if (nicknameErrorMsg) {
                    nicknameErrorMsg.classList.remove("hidden");
                    nicknameErrorMsg.innerText = err.message;
                }
            }
        };

        if (nicknameInput) {
            nicknameInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleNicknameSubmission();
                }
            });
        }
        if (btnSubmitNickname) {
            btnSubmitNickname.addEventListener("click", handleNicknameSubmission);
        }

        // 8. Header Buttons (MyPage, Logout)
        const btnHeaderMyPage = document.getElementById("btn-header-mypage");
        if (btnHeaderMyPage) {
            btnHeaderMyPage.addEventListener("click", () => {
                this.openMyPage();
            });
        }

        const btnHeaderLogout = document.getElementById("btn-header-logout");
        if (btnHeaderLogout) {
            btnHeaderLogout.addEventListener("click", () => {
                window.authManager.logout();
                this.showScreen("screen-first");
                this.state = "first";
            });
        }

        // 9. MyPage Modal Actions
        const btnMyPageClose = document.getElementById("btn-mypage-close");
        if (btnMyPageClose) {
            btnMyPageClose.addEventListener("click", () => {
                const mypageScreen = document.getElementById("screen-mypage");
                if (mypageScreen) mypageScreen.classList.add("hidden");
                this.showScreen("screen-title");
                this.state = "title";
            });
        }

        const btnEditNick = document.getElementById("btn-mypage-edit-nickname");
        if (btnEditNick) {
            btnEditNick.addEventListener("click", () => {
                const current = window.authManager.currentUser?.nickname || "";
                const newNick = prompt(window.i18n.t("nicknameTitle"), current);
                if (newNick !== null) {
                    try {
                        window.authManager.setNickname(newNick);
                        this.updateMyPageUI();
                    } catch (err) {
                        alert(err.message);
                    }
                }
            });
        }

        const btnChangePass = document.getElementById("btn-mypage-change-password");
        if (btnChangePass) {
            btnChangePass.addEventListener("click", () => {
                const newPass = prompt(window.i18n.t("newPasswordLabel"));
                if (newPass !== null) {
                    try {
                        window.authManager.changePassword(newPass);
                        alert(window.i18n.t("save") + "!");
                    } catch (err) {
                        alert(err.message);
                    }
                }
            });
        }

        const btnDeleteAccount = document.getElementById("btn-delete-account");
        if (btnDeleteAccount) {
            btnDeleteAccount.addEventListener("click", () => {
                const result = window.authManager.deleteAccount();
                const noticeBox = document.getElementById("delete-account-notice-box");

                if (!result.confirmed) {
                    // First click: Display warning and switch button label to "Confirm Delete"
                    if (noticeBox) noticeBox.classList.remove("hidden");
                    btnDeleteAccount.innerText = window.i18n.t("btnDeleteAccountConfirm");
                } else {
                    // Second click: Complete deletion and redirect to initial gateway
                    alert(result.message);
                    const mypageScreen = document.getElementById("screen-mypage");
                    if (mypageScreen) mypageScreen.classList.add("hidden");
                    this.showScreen("screen-first");
                    this.state = "first";
                }
            });
        }
    }

    openMyPage() {
        this.updateMyPageUI();
        const mypageScreen = document.getElementById("screen-mypage");
        if (mypageScreen) {
            mypageScreen.classList.remove("hidden");
        }
        this.state = "mypage";
    }

    updateMyPageUI() {
        const u = window.authManager.currentUser;
        if (!u) return;

        const nickEl = document.getElementById("mypage-current-nickname");
        if (nickEl) nickEl.innerText = u.nickname || "-";

        const providerEl = document.getElementById("mypage-account-provider");
        if (providerEl) providerEl.innerText = (u.provider || "Guest").toUpperCase();

        const btnDelete = document.getElementById("btn-delete-account");
        if (btnDelete) btnDelete.innerText = window.i18n.t("btnDeleteAccount");

        const noticeBox = document.getElementById("delete-account-notice-box");
        if (noticeBox) noticeBox.classList.add("hidden");
        window.authManager.deleteAccountConfirmStage = false;
    }

    initBubbles() {
        this.bubbles = [];
        for (let i = 0; i < 40; i++) {
            this.bubbles.push({
                x: Math.random() * 1280,
                y: Math.random() * 720,
                radius: Math.random() * 4 + 2,
                speedY: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    bindEvents() {
        // 1. 데스크톱 키보드 조작
        const jumpBtn = document.getElementById("virtual-jump");
        const dpadUp = document.querySelector('.dpad-key[data-dir="up"]');
        const dpadDown = document.querySelector('.dpad-key[data-dir="down"]');
        const dpadLeft = document.querySelector('.dpad-key[data-dir="left"]');
        const dpadRight = document.querySelector('.dpad-key[data-dir="right"]');

        const isTypingField = (el) => {
            if (!el) return false;
            const tag = el.tagName;
            return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
        };

        window.addEventListener("keydown", (e) => {
            // 텍스트 입력 필드(이메일, 비밀번호, 닉네임 등) 입력 중일 때는 게임 조작키 가로채기 금지
            if (isTypingField(e.target)) {
                return;
            }

            // 게임 플레이 상태가 아닐 때는 이동/점프 조작 처리 스킵
            if (this.state !== "playing") {
                return;
            }

            // 데스크톱: 스페이스 바 클릭 시 'Jump' 버튼이 클릭되어 회피 및 도약 동작
            if (e.code === "Space") {
                e.preventDefault();
                if (jumpBtn) jumpBtn.classList.add("pressed");
                this.handleJumpPress(true);
                return;
            }

            // 데스크톱: 화살표 키 및 WASD 키 원래대로 완벽 복원 (상, 하, 좌, 우 이동)
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                e.preventDefault();
                this.input.up = true;
                if (dpadUp) dpadUp.classList.add("pressed");
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                e.preventDefault();
                this.input.down = true;
                if (dpadDown) dpadDown.classList.add("pressed");
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                e.preventDefault();
                this.input.left = true;
                if (dpadLeft) dpadLeft.classList.add("pressed");
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                e.preventDefault();
                this.input.right = true;
                if (dpadRight) dpadRight.classList.add("pressed");
            }
        });

        window.addEventListener("keyup", (e) => {
            if (isTypingField(e.target)) {
                return;
            }

            if (e.code === "Space") {
                e.preventDefault();
                if (jumpBtn) jumpBtn.classList.remove("pressed");
                this.handleJumpPress(false);
                return;
            }

            if (e.code === "ArrowUp" || e.code === "KeyW") {
                e.preventDefault();
                this.input.up = false;
                if (dpadUp) dpadUp.classList.remove("pressed");
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                e.preventDefault();
                this.input.down = false;
                if (dpadDown) dpadDown.classList.remove("pressed");
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                e.preventDefault();
                this.input.left = false;
                if (dpadLeft) dpadLeft.classList.remove("pressed");
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                e.preventDefault();
                this.input.right = false;
                if (dpadRight) dpadRight.classList.remove("pressed");
            }
        });

        // 2. 모바일 가로/세로 화면: 왼손 엄지로 가상 'Jump' 버튼 클릭
        const onJumpStart = (e) => {
            if (e.cancelable) e.preventDefault();
            if (jumpBtn) jumpBtn.classList.add("pressed");
            this.handleJumpPress(true);
        };
        const onJumpEnd = (e) => {
            if (e.cancelable) e.preventDefault();
            if (jumpBtn) jumpBtn.classList.remove("pressed");
            this.handleJumpPress(false);
        };

        if (jumpBtn) {
            jumpBtn.addEventListener("pointerdown", onJumpStart);
            jumpBtn.addEventListener("pointerup", onJumpEnd);
            jumpBtn.addEventListener("pointercancel", onJumpEnd);
            jumpBtn.addEventListener("pointerleave", onJumpEnd);
        }

        // 3. 모바일 가로/세로 화면: 오른손 엄지로 가상 4방향 D-PAD 화살표 클릭 & 마우스 클릭 작동
        document.querySelectorAll(".dpad-key").forEach(btn => {
            const dir = btn.dataset.dir;
            const startDir = (e) => {
                if (e.cancelable) e.preventDefault();
                this.input[dir] = true;
                btn.classList.add("pressed");
                if (!this.audio.ctx) this.audio.init();
            };
            const endDir = (e) => {
                if (e.cancelable) e.preventDefault();
                this.input[dir] = false;
                btn.classList.remove("pressed");
            };

            btn.addEventListener("pointerdown", startDir);
            btn.addEventListener("pointerup", endDir);
            btn.addEventListener("pointercancel", endDir);
            btn.addEventListener("pointerleave", endDir);
        });

        // 4. 메인 타이틀 화면 버튼들
        const btnStart = document.getElementById("btn-title-start");
        if (btnStart) {
            btnStart.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                this.startStage(1);
            });
        }

        const btnTitleChar = document.getElementById("btn-title-character");
        if (btnTitleChar) {
            btnTitleChar.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                this.updateCharacterSelectUI();
                this.showScreen("screen-character");
            });
        }

        const btnTitleSettings = document.getElementById("btn-title-settings");
        if (btnTitleSettings) {
            btnTitleSettings.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                this.settingsSourceState = "title";
                this.updateSettingsUI();
                this.showScreen("screen-settings");
            });
        }

        const replayBtn = document.getElementById("btn-title-intro-replay");
        if (replayBtn) {
            replayBtn.addEventListener("click", () => {
                if (!this.audio.ctx) this.audio.init();
                this.playIntroExplicitly();
            });
        }

        // 5. 주인공 캐릭터 선택 화면 버튼들 (5종 캐릭터 탐색 및 출격)
        const btnCharPrev = document.getElementById("btn-char-prev");
        if (btnCharPrev) {
            btnCharPrev.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.selectedCharIndex = (this.selectedCharIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
                this.updateCharacterSelectUI();
                this.audio.playPreyEat(1.1);
            });
        }

        const btnCharNext = document.getElementById("btn-char-next");
        if (btnCharNext) {
            btnCharNext.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.selectedCharIndex = (this.selectedCharIndex + 1) % CHARACTERS.length;
                this.updateCharacterSelectUI();
                this.audio.playPreyEat(1.3);
            });
        }

        const btnCharPlay = document.getElementById("btn-char-select-play");
        if (btnCharPlay) {
            btnCharPlay.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.startStage(1);
            });
        }

        const btnCharBack = document.getElementById("btn-char-back");
        if (btnCharBack) {
            btnCharBack.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.showScreen("screen-title");
                this.state = "title";
            });
        }

        // 6. 환경 설정 모달 버튼 및 설정 요소들
        const btnPause = document.getElementById("btn-pause");
        if (btnPause) {
            btnPause.addEventListener("click", () => {
                if (this.state === "playing") {
                    this.state = "paused";
                    this.settingsSourceState = "playing";
                    this.updateSettingsUI();
                    this.showScreen("screen-settings");
                }
            });
        }

        const btnSettingsResume = document.getElementById("btn-settings-resume");
        if (btnSettingsResume) {
            btnSettingsResume.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                if (this.settingsSourceState === "playing") {
                    this.state = "playing";
                    this.hideModals();
                } else {
                    this.state = "title";
                    this.showScreen("screen-title");
                }
            });
        }

        const btnSettingsHome = document.getElementById("btn-settings-home");
        if (btnSettingsHome) {
            btnSettingsHome.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.state = "title";
                this.showScreen("screen-title");
            });
        }

        // 기본 목숨 (Lives) 라디오 버튼 (3회, 4회, 5회, 6회)
        document.querySelectorAll(".pill-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.maxLives = parseInt(btn.dataset.lives);
                this.currentLives = this.maxLives;
                this.requiredEvasions = this.maxLives;
                if (this.state === "playing") {
                    this.updateLivesHUD();
                    this.updateKingHUD();
                }
                this.audio.playPreyEat(1.5);
            });
        });

        // 사운드 슬라이더 (BGM, SFX)
        const sliderBgm = document.getElementById("slider-bgm");
        if (sliderBgm) {
            sliderBgm.addEventListener("input", (e) => {
                this.audio.setVolumes(parseFloat(e.target.value), this.audio.sfxVolume);
            });
        }
        const sliderSfx = document.getElementById("slider-sfx");
        if (sliderSfx) {
            sliderSfx.addEventListener("input", (e) => {
                this.audio.setVolumes(this.audio.bgmVolume, parseFloat(e.target.value));
            });
            sliderSfx.addEventListener("change", () => {
                this.audio.playPreyEat(1.2);
            });
        }

        // 가상 컨트롤러 커스텀 슬라이더 (투명도, 크기)
        const sliderOpacity = document.getElementById("slider-opacity");
        if (sliderOpacity) {
            sliderOpacity.addEventListener("input", (e) => {
                const controls = document.getElementById("virtual-controls");
                if (controls) controls.style.opacity = e.target.value;
            });
        }
        const sliderScale = document.getElementById("slider-scale");
        if (sliderScale) {
            sliderScale.addEventListener("input", (e) => {
                const sc = e.target.value;
                const vJump = document.getElementById("virtual-jump");
                const vDpad = document.getElementById("virtual-dpad");
                if (vJump) vJump.style.transform = `scale(${sc})`;
                if (vDpad) vDpad.style.transform = `scale(${sc})`;
            });
        }

        // 7. 결과 모달 버튼
        const btnResultRetry = document.getElementById("btn-result-retry");
        if (btnResultRetry) {
            btnResultRetry.addEventListener("click", () => {
                this.startStage(this.currentStageIndex);
            });
        }
        const btnResultNext = document.getElementById("btn-result-next");
        if (btnResultNext) {
            btnResultNext.addEventListener("click", () => {
                if (this.currentStageIndex < 5) {
                    this.startStage(this.currentStageIndex + 1);
                } else {
                    this.showScreen("screen-title");
                }
            });
        }
        const btnResultHome = document.getElementById("btn-result-home");
        if (btnResultHome) {
            btnResultHome.addEventListener("click", () => {
                this.showScreen("screen-title");
                this.state = "title";
            });
        }

        // 8. 메인 관리자(Admin) 전용 개발/디자인 조정 Pause/Go 토글
        const adminPauseBtn = document.getElementById("btn-admin-pause");
        if (adminPauseBtn) {
            adminPauseBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!this.audio.ctx) this.audio.init();
                this.toggleDevPause();
            });
        }

        // 관리자 전용 키보드 단축키 (P키 또는 F8로 순간 중단/재개 토글)
        window.addEventListener("keydown", (e) => {
            if (this.isAdminAuthorized && this.state === "playing") {
                if (e.code === "KeyP" || e.code === "F8") {
                    e.preventDefault();
                    this.toggleDevPause();
                }
            }

            // 관리자 비밀 인증 단축키 (Ctrl + Alt + A)
            if (e.ctrlKey && e.altKey && (e.code === "KeyA" || e.key === "a" || e.key === "A")) {
                e.preventDefault();
                if (window.authManager && window.authManager.isAdmin) {
                    this.isAdminAuthorized = true;
                    alert("인증 완료: 관리자 권한이 활성화되었습니다.\n상단 우측에 개발/디자인 조정용 Pause/Go 버튼이 활성화됩니다.");
                    this.checkAdminStatus();
                } else {
                    alert("안내: 관리자 전용 기능입니다. 등록된 관리자 계정으로 로그인해 주세요.");
                }
            }
        });

        // 타이틀 로고 5회 연속 클릭 시 관리자 권한 확인
        const logoEl = document.querySelector(".game-logo");
        if (logoEl) {
            let logoClicks = 0;
            let logoClickTimer = null;
            logoEl.addEventListener("click", () => {
                logoClicks++;
                clearTimeout(logoClickTimer);
                logoClickTimer = setTimeout(() => { logoClicks = 0; }, 1800);
                if (logoClicks >= 5) {
                    logoClicks = 0;
                    if (window.authManager && window.authManager.isAdmin) {
                        this.isAdminAuthorized = true;
                        alert("인증 완료: 관리자 권한이 활성화되었습니다.\n상단 우측에 개발/디자인 조정용 Pause/Go 버튼이 활성화됩니다.");
                        this.checkAdminStatus();
                    } else {
                        alert("안내: 관리자 전용 기능입니다. 등록된 관리자 계정으로 로그인해 주세요.");
                    }
                }
            });
        }

        // 9. King of Enemies 회피 미션 창 닫기(x) 및 상단 하트 옆 Mission 미니 버튼 토글
        const btnKingClose = document.getElementById("btn-king-mission-close");
        if (btnKingClose) {
            const handleClose = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.isKingMissionBoxVisible = false;
                this.updateKingHUD();
                if (this.audio && this.audio.playClick) this.audio.playClick();
            };
            btnKingClose.addEventListener("click", handleClose);
            btnKingClose.addEventListener("pointerdown", handleClose);
        }
        const btnKingToggle = document.getElementById("btn-king-mission-toggle");
        if (btnKingToggle) {
            const handleToggle = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.isKingMissionBoxVisible = !this.isKingMissionBoxVisible;
                this.updateKingHUD();
                if (this.audio && this.audio.playClick) this.audio.playClick();
            };
            btnKingToggle.addEventListener("click", handleToggle);
            btnKingToggle.addEventListener("pointerdown", handleToggle);
        }

        // 10. 미션 성공/실패 3초 후 하단 중앙에 생성되는 '스코어 보기' 버튼
        const btnViewScore = document.getElementById("btn-view-score");
        if (btnViewScore) {
            const handleViewScore = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                btnViewScore.classList.add("hidden");
                btnViewScore.style.display = "none";
                const celebScreen = document.getElementById("screen-celebration");
                if (celebScreen) {
                    celebScreen.classList.add("hidden");
                    celebScreen.style.display = "none";
                }
                if (this.audio && this.audio.playClick) this.audio.playClick();
                this.state = "result";
                this.showResultModal(this.celebration ? this.celebration.isSuccess : true);
            };
            btnViewScore.addEventListener("click", handleViewScore);
            btnViewScore.addEventListener("pointerdown", handleViewScore);
        }
    }

    updateSettingsUI() {
        document.querySelectorAll(".pill-btn").forEach(btn => {
            if (parseInt(btn.dataset.lives) === this.maxLives) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        const sliderBgm = document.getElementById("slider-bgm");
        const sliderSfx = document.getElementById("slider-sfx");
        if (sliderBgm && this.audio) sliderBgm.value = this.audio.bgmVolume;
        if (sliderSfx && this.audio) sliderSfx.value = this.audio.sfxVolume;

        const resumeBtn = document.getElementById("btn-settings-resume");
        if (resumeBtn) {
            resumeBtn.innerText = (this.settingsSourceState === "playing") ? "계속하기 (Resume)" : "설정 완료 / 닫기";
        }
    }

    // --- 메인 관리자 전용 개발/디자인 조정 제어 ---
    checkAdminStatus() {
        let authorized = false;

        if (window.authManager && window.authManager.isAdmin) {
            authorized = true;
        }

        this.isAdminAuthorized = authorized;

        // UI 버튼 노출 제어 (비인가 일반 사용자에게는 절대 노출 금지)
        const btn = document.getElementById("btn-admin-pause");
        if (btn) {
            if (authorized) {
                btn.classList.add("authorized");
                btn.classList.remove("hidden");
                btn.style.display = "inline-flex";
            } else {
                btn.classList.remove("authorized");
                btn.classList.add("hidden");
                btn.style.display = "none";
            }
        }
    }

    toggleDevPause() {
        if (!this.isAdminAuthorized) return; // 보안 재확인
        this.isDevPaused = !this.isDevPaused;
        const btn = document.getElementById("btn-admin-pause");

        if (this.isDevPaused) {
            if (btn) {
                btn.innerText = "▶️ Go";
                btn.classList.add("paused");
                btn.title = "[Admin Only] 게임 재개 (Go)";
            }
            if (this.audio) this.audio.playPreyEat(0.8);
        } else {
            if (btn) {
                btn.innerText = "⏸️ Pause";
                btn.classList.remove("paused");
                btn.title = "[Admin Only] 개발/디자인 조정용 순간 일시정지 (Pause)";
            }
            if (this.audio) this.audio.playPreyEat(1.4);
        }
    }

    // --- 3D 점프 급격 회피 & 세이브 핸들러 ---
    handleJumpPress(isDown) {
        if (!this.audio.ctx) this.audio.init();
        if (isDown) {
            this.input.jump = true;
            if (this.state === "playing") {
                this.triggerAcrobaticDodge();
            }
        } else {
            this.input.jump = false;
        }
    }

    triggerAcrobaticDodge() {
        if (this.dodgeTimer > 0) return; // 연속 스팸 방지
        this.dodgeTimer = 0.65; // 0.65초 3D 회피 곡예 기동
        this.isDodging = true;
        this.dodgeRollAngle = 0;

        // 급격한 회피 기동 세이브: 즉시 무적 부여로 위험/장애물 충돌 완전 무효화
        this.isInvincible = true;
        this.invincibleTimer = Math.max(this.invincibleTimer, 0.7);

        // 극적인 풍압 회피 사운드 재생
        this.audio.playDodgeWhoosh();

        // 3D 회피 스파이럴 기포 및 나선형 물보라 파티클 방출
        for (let i = 0; i < 18; i++) {
            const ang = (i / 18) * Math.PI * 2;
            this.particles.push({
                x: this.player.x + Math.cos(ang) * 40,
                y: this.player.y + Math.sin(ang) * 40,
                vx: Math.cos(ang) * 120 - 140,
                vy: Math.sin(ang) * 120,
                color: "rgba(0, 229, 255, 0.85)",
                radius: Math.random() * 6 + 4
            });
        }

        // King of Enemies 라이벌 보스 습격 중 회피 판정 즉각 실행
        if (this.kingActive && this.king) {
            this.checkKingEvasion();
        }
    }

    // --- King of Enemies 라이벌 보스 & 번개 회피 미션 시스템 ---
    spawnKingOfEnemies() {
        this.kingActive = true;
        this.bossActive = true; // 일반 보스 대신 킹 오브 에너미즈 활성화
        const playerChar = CHARACTERS[this.selectedCharIndex];

        // 현재 조종 중인 캐릭터와 겹치지 않게 다른 주인공 캐릭터 중 1마리를 라이벌 킹으로 선출
        let kingKey = this.stageData.rivalKingKey;
        if (kingKey === playerChar.key) {
            const others = CHARACTERS.filter(c => c.key !== playerChar.key);
            kingKey = others[(this.currentStageIndex) % others.length].key;
        }
        const kingDef = CHARACTERS.find(c => c.key === kingKey) || CHARACTERS[0];

        this.evasionSuccessCount = 0;
        this.requiredEvasions = this.maxLives; // "선택한 죽음 숫자와 동일한 횟수"

        this.king = {
            charKey: kingKey,
            name: this.stageData.rivalKingName || `King of Enemies: ${kingDef.name}`,
            avatar: kingDef.avatar,
            x: 1360,
            y: this.player.y,
            targetY: this.player.y,
            vx: 0,
            vy: 0,
            state: "enter", // enter -> stalk -> warn -> charge -> recoil -> cleared
            stateTimer: 0,
            laserAlpha: 0,
            dodgeEvaluated: false
        };

        this.audio.playKingRoar();
        // King of Enemies description box is NOT visible by default; Mission button is visible
        this.updateKingHUD();
    }

    updateKingHUD() {
        const kingHud = document.getElementById("hud-king-mission");
        const toggleBtn = document.getElementById("btn-king-mission-toggle");

        // When not in gameplay state (e.g. title, celebration, ending, result), hide both
        if (this.state !== "playing") {
            if (kingHud) {
                kingHud.classList.add("hidden");
                kingHud.style.display = "none";
            }
            if (toggleBtn) {
                toggleBtn.classList.add("hidden");
                toggleBtn.style.display = "none";
            }
            return;
        }

        // 1. Mission button is generated and visible by default on all screens beside hearts
        if (toggleBtn) {
            toggleBtn.classList.remove("hidden");
            toggleBtn.style.display = "inline-flex";
            if (this.king) {
                toggleBtn.innerHTML = `🎯 Mission (${this.evasionSuccessCount}/${this.requiredEvasions})`;
            } else {
                toggleBtn.innerHTML = `🎯 Mission`;
            }
        }

        // 2. 'King of Enemies:' description box is NOT visible by default; only shown when clicking 'Mission'
        if (kingHud) {
            if (this.isKingMissionBoxVisible) {
                kingHud.classList.remove("hidden");
                kingHud.style.display = "flex";
            } else {
                kingHud.classList.add("hidden");
                kingHud.style.display = "none";
            }
        }

        // 3. Update description box contents (King Name, Dodge Counts, Pips)
        const nameEl = document.getElementById("hud-king-name");
        const countEl = document.getElementById("hud-king-dodge-count");
        const pipsEl = document.getElementById("hud-king-dodge-pips");

        const targetKingName = this.king
            ? this.king.name
            : (this.stageData && this.stageData.rivalKingName ? this.stageData.rivalKingName : "King of Enemies");

        if (nameEl) nameEl.innerText = targetKingName.startsWith("👑") ? targetKingName : `👑 ${targetKingName}`;
        if (countEl) countEl.innerText = `${this.evasionSuccessCount} / ${this.requiredEvasions}`;
        if (pipsEl) {
            pipsEl.innerHTML = "";
            for (let i = 0; i < this.requiredEvasions; i++) {
                const pip = document.createElement("span");
                pip.className = `dodge-pip ${i < this.evasionSuccessCount ? "active" : ""}`;
                pip.innerText = "⚡";
                pipsEl.appendChild(pip);
            }
        }
    }

    updateKing(dt) {
        if (!this.king) return;
        const k = this.king;
        k.stateTimer += dt;

        if (k.state === "enter") {
            // 화면 우측에서 집요한 추적 위치로 진입
            k.x += (1020 - k.x) * dt * 2.5;
            k.y += (this.player.y - k.y) * dt * 3.0;
            if (k.stateTimer > 1.2 || Math.abs(k.x - 1020) < 20) {
                k.state = "stalk";
                k.stateTimer = 0;
            }
        } else if (k.state === "stalk") {
            // 플레이어 높이를 실시간 집요하게 조준 추적 (Stalking)
            k.x += (1000 - k.x) * dt * 3.0;
            k.y += (this.player.y - k.y) * dt * 4.5;
            k.laserAlpha = Math.min(0.4, k.stateTimer * 0.3);

            if (k.stateTimer > 1.4) {
                k.state = "warn";
                k.stateTimer = 0;
                k.dodgeEvaluated = false;
                this.audio.playKingRoar();
            }
        } else if (k.state === "warn") {
            // 급습 직전: 붉은 타겟 락온 레이저와 눈동자 발광
            k.y += (this.player.y - k.y) * dt * 5.0;
            k.laserAlpha = 0.5 + Math.sin(k.stateTimer * 20) * 0.5;

            if (k.stateTimer > 0.65) {
                k.state = "charge";
                k.stateTimer = 0;
                k.vx = -880; // 초고속 기습 돌진
                k.dodgeEvaluated = false;
            }
        } else if (k.state === "charge") {
            // 플레이어를 향해 맹렬하게 돌진!
            k.x += k.vx * dt;
            k.laserAlpha = 0.8;

            // 돌진 중 플레이어가 회피 동작 중이거나 JUMP 입력 시
            if (!k.dodgeEvaluated) {
                const dist = Math.hypot(this.player.x - k.x, this.player.y - k.y);
                const dx = k.x - this.player.x;

                // 충돌 직전 (닿기 전) 회피 판정:
                // 플레이어가 JUMP 회피 중(isDodging)이거나 거리가 닿기 직전 범위(160~280px)에 있을 때
                if (this.isDodging && dx > -40 && dx < 280 && Math.abs(this.player.y - k.y) < 130) {
                    this.onEvasionSuccess();
                } else if (dist < 65) {
                    // 미회피 피격 발생
                    k.dodgeEvaluated = true;
                    this.takeDamage();
                    k.state = "recoil";
                    k.stateTimer = 0;
                }
            }

            // 화면 왼쪽 끝을 완전히 지나쳤을 때
            if (k.x < -160) {
                k.x = 1350;
                k.y = this.player.y;
                k.state = "recoil";
                k.stateTimer = 0;
            }
        } else if (k.state === "recoil") {
            // 회피당하거나 충돌 후 다시 원위치로 복귀하여 다음 습격 준비
            k.x += (1020 - k.x) * dt * 3.5;
            k.y += (this.player.y - k.y) * dt * 2.5;
            k.laserAlpha = 0;

            if (k.stateTimer > 0.9 && Math.abs(k.x - 1020) < 60) {
                k.state = "stalk";
                k.stateTimer = 0;
            }
        } else if (k.state === "cleared") {
            // 미션 완료 후 심해 너머로 패배 후퇴
            k.x += 220 * dt;
            k.y += 180 * dt;
            k.laserAlpha = 0;
        }
    }

    checkKingEvasion() {
        if (!this.king || this.king.state !== "charge" || this.king.dodgeEvaluated) return;
        const dx = this.king.x - this.player.x;
        const dy = Math.abs(this.king.y - this.player.y);

        // 적이 닿기 전 사거리(dx: 0 ~ 320px, dy < 140px)에서 회피 판정
        if (dx >= -40 && dx <= 320 && dy <= 140) {
            this.onEvasionSuccess();
        }
    }

    onEvasionSuccess() {
        if (!this.king || this.king.dodgeEvaluated) return;
        this.king.dodgeEvaluated = true;
        this.evasionSuccessCount++;

        // 800점 보너스 가산
        this.score += 800;
        this.updateScoreHUD();
        this.updateKingHUD();

        // 1. 번쩍거리는 번개 발산 & 극적인 낙뢰 사운드
        this.lightningFlash = 1.0;
        this.createLightningBolts(this.player.x, this.player.y, this.king.x, this.king.y);
        this.audio.playLightningStrike();

        // 2. "*회 회피성공" 아케이드 메시지 팝업
        this.dodgeSuccessBannerText = `⚡ ${this.evasionSuccessCount}회 회피성공!`;
        this.dodgeSuccessBannerTimer = 1.8;

        // 3. 적 캐릭터 충격 넉백
        this.king.state = "recoil";
        this.king.stateTimer = 0;
        this.king.vx = 450;

        // 4. "선택한 죽음 숫자와 동일한 횟수만큼 회피를 성공하면 미션 성공으로 스테이지 완료"
        if (this.evasionSuccessCount >= this.requiredEvasions) {
            this.king.state = "cleared";
            this.king.stateTimer = 0;
            setTimeout(() => {
                const kingHud = document.getElementById("hud-king-mission");
                if (kingHud) {
                    kingHud.classList.add("hidden");
                    kingHud.style.display = "none";
                }
                const toggleBtn = document.getElementById("btn-king-mission-toggle");
                if (toggleBtn) {
                    toggleBtn.classList.add("hidden");
                    toggleBtn.style.display = "none";
                }
                this.kingActive = false;
                this.bossActive = false;
                this.stageClear();
            }, 1500);
        }
    }

    createLightningBolts(x1, y1, x2, y2) {
        this.lightningBolts = [];
        const boltCount = 8;
        for (let b = 0; b < boltCount; b++) {
            const points = [];
            const segments = 10;
            const startX = x1 + (Math.random() - 0.5) * 60;
            const startY = y1 + (Math.random() - 0.5) * 60;
            const endX = x2 + (Math.random() - 0.5) * 80;
            const endY = y2 + (Math.random() - 0.5) * 80;

            points.push({ x: startX, y: startY });
            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const bx = startX + (endX - startX) * t + (Math.random() - 0.5) * 90;
                const by = startY + (endY - startY) * t + (Math.random() - 0.5) * 90;
                points.push({ x: bx, y: by });
            }
            points.push({ x: endX, y: endY });
            this.lightningBolts.push({
                points: points,
                color: b % 2 === 0 ? "#00e5ff" : "#ffe66d",
                width: Math.random() * 3 + 2,
                life: 0.4
            });
        }
    }

    showScreen(screenId) {
        document.querySelectorAll(".ui-layer").forEach(el => el.classList.add("hidden"));
        const target = document.getElementById(screenId);
        if (target) target.classList.remove("hidden");

        // Manage header auth box visibility (Only on title, result, mypage)
        const headerAuthBox = document.getElementById("header-auth-box");
        if (headerAuthBox) {
            if (screenId === "screen-title" || screenId === "screen-result" || screenId === "screen-character") {
                if (window.authManager && window.authManager.currentUser && window.authManager.currentUser.nickname) {
                    window.authManager.updateHeaderUI();
                } else {
                    headerAuthBox.classList.add("hidden");
                    headerAuthBox.style.display = "none";
                }
            } else if (screenId === "screen-first" || screenId === "screen-intro" || screenId === "screen-login" || screenId === "screen-nickname" || screenId === "hud-overlay") {
                headerAuthBox.classList.add("hidden");
                headerAuthBox.style.display = "none";
            }
        }

        if (window.i18n) {
            window.i18n.applyTranslations();
        }
    }

    hideModals() {
        document.querySelectorAll(".modal-backdrop").forEach(el => el.classList.add("hidden"));
        document.getElementById("hud-overlay").classList.remove("hidden");
    }

    updateCharacterSelectUI() {
        const char = CHARACTERS[this.selectedCharIndex];
        const avatarEl = document.getElementById("char-avatar");
        if (avatarEl) {
            if (char.imgPath) {
                avatarEl.innerHTML = `<img src="${char.imgPath}" alt="${char.name}" style="width: 240px; height: auto; max-height: 130px; object-fit: contain; filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 28px rgba(0, 229, 255, 0.75));">`;
            } else {
                avatarEl.innerText = char.avatar;
            }
        }
        document.getElementById("char-name").innerText = char.name;
        document.getElementById("char-trait").innerText = char.trait;
        document.getElementById("char-skill-desc").innerText = char.skill;

        document.getElementById("stat-speed").style.width = `${char.speed * 100}%`;
        document.getElementById("stat-boost").style.width = `${char.boost * 100}%`;
        document.getElementById("stat-hitbox").style.width = `${char.hitbox * 100}%`;
        document.getElementById("stat-magnet").style.width = `${char.magnet * 100}%`;

        // 10종 먹이 프리뷰 고화질 3D 이미지 렌더링 (사이즈 1.5배 확대)
        const grid = document.getElementById("char-prey-grid");
        grid.innerHTML = "";
        const preys = PREY_DATABASE[char.key];
        preys.forEach(p => {
            const chip = document.createElement("div");
            chip.className = `prey-chip ${p.rare ? "rare" : ""}`;
            chip.innerHTML = `<img src="${p.imgPath}" alt="${p.name}" style="width:30px; height:30px; vertical-align:middle; margin-right:6px; object-fit:contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));"> ${p.name}`;
            grid.appendChild(chip);
        });
    }

    startStage(stageIdx) {
        this.currentStageIndex = stageIdx;
        this.stageData = STAGES[stageIdx - 1];
        this.state = "playing";

        this.currentLives = this.maxLives;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.multiplier = 1.0;
        this.comboTimer = 0;
        this.isFever = false;
        this.distance = 0;
        this.bossActive = false;
        this.boss = null;
        this.kingActive = false;
        this.king = null;
        this.evasionSuccessCount = 0;
        this.requiredEvasions = this.maxLives; // 사용자가 선택한 죽음(목숨) 숫자와 동일한 횟수
        this.lightningFlash = 0;
        this.lightningBolts = [];
        this.dodgeSuccessBannerTimer = 0;
        this.dodgeSuccessBannerText = "";
        this.dodgeTimer = 0;
        this.isDodging = false;
        this.dodgeRollAngle = 0;
        this.isKingMissionBoxVisible = false;
        const celebScreen = document.getElementById("screen-celebration");
        if (celebScreen) {
            celebScreen.classList.add("hidden");
            celebScreen.style.display = "none";
        }
        const viewScoreBtn = document.getElementById("btn-view-score");
        if (viewScoreBtn) {
            viewScoreBtn.classList.add("hidden");
            viewScoreBtn.style.display = "none";
        }
        const vControls = document.getElementById("virtual-controls");
        if (vControls) vControls.style.display = "block";

        // 플레이어 캐릭터 스탯 로드
        const char = CHARACTERS[this.selectedCharIndex];
        this.player.x = 200;
        this.player.y = 360;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.radius = char.hitboxRadius;
        this.player.magnetRadius = char.magnetRadius;

        this.inkScreenCharges = 2;
        this.armorGauge = 100;
        this.bloodFrenzyBonus = 0;

        this.preyList = [];
        this.hazardList = [];
        this.particles = [];

        // HUD 갱신
        this.showScreen("hud-overlay");
        document.getElementById("hud-stage-name").innerText = this.stageData.name;
        this.updateLivesHUD();
        this.updateScoreHUD();
        this.updateComboHUD();
        this.updateKingHUD();

        document.getElementById("hud-skill-name").innerText = char.name.split(" ")[0];
    }

    updateLivesHUD() {
        const container = document.getElementById("hud-lives-container");
        container.innerHTML = "";
        for (let i = 0; i < this.maxLives; i++) {
            const span = document.createElement("span");
            span.className = `life-fin-icon ${i < this.currentLives ? "" : "dead"}`;
            span.innerText = "❤️";
            container.appendChild(span);
        }
    }

    updateScoreHUD() {
        document.getElementById("hud-score").innerText = this.score.toLocaleString();
    }

    updateComboHUD() {
        const badge = document.getElementById("hud-combo-badge");
        if (this.combo > 0) {
            badge.classList.remove("hidden");
            document.getElementById("hud-combo-count").innerText = `COMBO x${this.combo} (${this.multiplier.toFixed(1)}x)`;
        } else {
            badge.classList.add("hidden");
        }
    }

    takeDamage() {
        if (this.isInvincible || this.state !== "playing") return;

        // 대왕오징어 Ink Screen 자동 방어
        const char = CHARACTERS[this.selectedCharIndex];
        if (char.key === "giant_squid" && this.inkScreenCharges > 0) {
            this.inkScreenCharges--;
            this.isInvincible = true;
            this.invincibleTimer = 1.5;
            this.audio.playJump();
            // 먹물 입자 생성
            this.spawnInkParticles();
            return;
        }

        this.currentLives--;
        this.isInvincible = true;
        this.invincibleTimer = 1.5;
        this.combo = 0;
        this.multiplier = 1.0;
        this.isFever = false;
        this.bloodFrenzyBonus = 0;
        this.audio.playHit();

        this.updateLivesHUD();
        this.updateComboHUD();

        if (this.currentLives <= 0) {
            this.currentLives = 0;
            this.gameOver();
        }
    }

    spawnInkParticles() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: "#161A1D",
                radius: Math.random() * 12 + 8,
                life: 1.0
            });
        }
    }

    // --- 2. 스테이지 클리어 (미션 성공) & 실패 (미션 실패) 3초 시네마틱 연출 시스템 ---
    startMissionCelebration(isSuccess) {
        this.state = "mission_celebration";

        // 보너스 점수 가산 및 전용 사운드
        if (isSuccess) {
            this.score += 1000; // 클리어 기본 보너스
            if (this.currentLives === this.maxLives) this.score += 1500; // 무피격 퍼펙트 보너스
            this.audio.playMissionSuccess();
        } else {
            this.audio.playMissionFail();
        }
        this.updateScoreHUD();

        // 불필요한 컨트롤 및 HUD 숨김
        const kingHud = document.getElementById("hud-king-mission");
        if (kingHud) {
            kingHud.classList.add("hidden");
            kingHud.style.display = "none";
        }
        const toggleBtn = document.getElementById("btn-king-mission-toggle");
        if (toggleBtn) {
            toggleBtn.classList.add("hidden");
            toggleBtn.style.display = "none";
        }
        const vControls = document.getElementById("virtual-controls");
        if (vControls) vControls.style.display = "none";

        // 주인공 캐릭터 화면 중앙 이동 및 3초 애니메이션 상태 초기화
        this.celebration = {
            isSuccess: isSuccess,
            timer: 0,
            duration: 3.0,
            startX: this.player.x,
            startY: this.player.y,
            targetX: this.canvas.width / 2, // 640
            targetY: this.canvas.height / 2 - 20, // 340
            shimmerAngle: 0,
            done: false
        };

        // 미션 성공 / 미션 실패 UI 오버레이 표시
        const celebScreen = document.getElementById("screen-celebration");
        if (celebScreen) {
            celebScreen.classList.remove("hidden");
            celebScreen.style.display = "flex";
        }
        const badge = document.getElementById("celebration-badge");
        if (badge) badge.innerText = `👑 STAGE ${this.currentStageIndex}: ${this.stageData.name}`;

        const title = document.getElementById("celebration-title");
        if (title) {
            title.innerText = isSuccess ? "미션 성공" : "미션 실패";
            title.className = `celebration-text ${isSuccess ? "success" : "fail"}`;
        }

        const sub = document.getElementById("celebration-sub");
        if (sub) {
            sub.innerText = isSuccess 
                ? `${this.stageData.rivalKingName || "King of Enemies"} 격파 완료! 전설적 수중 제왕의 탄생!` 
                : "심해의 위협을 극복하지 못하고 가라앉았습니다...";
        }

        // '스코어 보기' 버튼은 3초 동안 숨겨두었다가 3초 후 애니메이션이 멈출 때 생성
        const viewScoreBtn = document.getElementById("btn-view-score");
        if (viewScoreBtn) {
            viewScoreBtn.classList.add("hidden");
            viewScoreBtn.style.display = "none";
        }
    }

    updateCelebration(dt) {
        if (!this.celebration) return;
        const c = this.celebration;

        if (!c.done) {
            c.timer += dt;
            c.shimmerAngle += dt * 1.5;

            // 0 ~ 1.0초: 주인공 캐릭터가 화면 중앙으로 부드럽게 이동 (Smooth Cubic Ease-Out)
            const moveProgress = Math.min(1.0, c.timer / 1.0);
            const ease = 1 - Math.pow(1 - moveProgress, 3);
            this.player.x = c.startX + (c.targetX - c.startX) * ease;
            this.player.y = c.startY + (c.targetY - c.startY) * ease;

            if (c.isSuccess) {
                // [의기양양하게]: 위풍당당한 수평 자세 & 부드러운 상하 영웅 바운스
                this.player.angle = Math.sin(c.timer * 3.5) * 0.04;
                // 황금빛 & 네온 블루 광채 스파클 방출
                if (Math.random() < 0.45) {
                    this.particles.push({
                        x: this.player.x + (Math.random() - 0.5) * 140,
                        y: this.player.y + (Math.random() - 0.5) * 90,
                        vx: (Math.random() - 0.5) * 60,
                        vy: -Math.random() * 70 - 20,
                        color: Math.random() < 0.6 ? "rgba(255, 230, 109, 0.95)" : "rgba(0, 229, 255, 0.95)",
                        radius: Math.random() * 4.5 + 2,
                        life: 1.0
                    });
                }
            } else {
                // [시무룩하게]: 아래를 향해 처진 각도 & 슬프게 가라앉는 바이브
                this.player.angle = 0.22;
                // 어두운 빗방울/그림자 입자 하강
                if (Math.random() < 0.35) {
                    this.particles.push({
                        x: this.player.x + (Math.random() - 0.5) * 100,
                        y: this.player.y + Math.random() * 30,
                        vx: (Math.random() - 0.5) * 20,
                        vy: Math.random() * 65 + 35,
                        color: "rgba(110, 150, 190, 0.75)",
                        radius: Math.random() * 3 + 1.5,
                        life: 1.0
                    });
                }
            }

            // 3초 경과 시: 애니메이션을 멈추고 동시에 '스코어 보기' 버튼 하단 가운데 생성!
            if (c.timer >= 3.0) {
                c.done = true;
                this.player.x = c.targetX;
                this.player.y = c.targetY;

                const viewScoreBtn = document.getElementById("btn-view-score");
                if (viewScoreBtn) {
                    viewScoreBtn.classList.remove("hidden");
                    viewScoreBtn.style.display = "inline-flex";
                }
            }
        }
    }

    gameOver() {
        this.startMissionCelebration(false);
    }

    stageClear() {
        this.startMissionCelebration(true);
    }

    showResultModal(isClear) {
        const celebScreen = document.getElementById("screen-celebration");
        if (celebScreen) {
            celebScreen.classList.add("hidden");
            celebScreen.style.display = "none";
        }
        const viewScoreBtn = document.getElementById("btn-view-score");
        if (viewScoreBtn) {
            viewScoreBtn.classList.add("hidden");
            viewScoreBtn.style.display = "none";
        }
        this.showScreen("screen-result");
        const title = document.getElementById("result-title");
        const story = document.getElementById("result-bridge-text");
        const nextBtn = document.getElementById("btn-result-next");

        title.innerText = isClear ? "STAGE CLEAR" : "GAME OVER";
        title.style.color = isClear ? "#ffe66d" : "#ff3366";
        story.innerText = isClear ? this.stageData.bridge : "심해의 위협에 가라앉았습니다. 다시 도전하세요!";
        nextBtn.style.display = (isClear && this.currentStageIndex < 5) ? "inline-block" : "none";

        document.getElementById("result-score").innerText = this.score.toLocaleString();
        document.getElementById("result-max-combo").innerText = `x${this.maxCombo}`;

        // 별 등급 판정
        let stars = 1;
        if (isClear) {
            if (this.currentLives >= 2) stars = 2;
            if (this.currentLives === this.maxLives) stars = 3;
        } else {
            stars = 0;
        }

        document.getElementById("star-1").className = `star ${stars >= 1 ? "" : "dim"}`;
        document.getElementById("star-2").className = `star ${stars >= 2 ? "" : "dim"}`;
        document.getElementById("star-3").className = `star ${stars >= 3 ? "" : "dim"}`;

        // 결과 먹이 그리드
        const grid = document.getElementById("result-prey-grid");
        grid.innerHTML = "";
        const char = CHARACTERS[this.selectedCharIndex];
        PREY_DATABASE[char.key].forEach(p => {
            const chip = document.createElement("div");
            chip.className = `prey-chip ${p.rare ? "rare" : ""}`;
            chip.innerHTML = `<img src="${p.imgPath}" alt="${p.name}" style="width:30px; height:30px; vertical-align:middle; margin-right:6px; object-fit:contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));"> ${p.name}`;
            grid.appendChild(chip);
        });
    }

    // --- 메인 게임 루프 ---
    loop(timestamp) {
        try {
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
            this.lastTime = timestamp;

            if (this.state === "playing" || this.state === "mission_celebration") {
                this.update(dt);
            }

            this.render();
        } catch (err) {
            console.error("Game loop error caught:", err);
        } finally {
            requestAnimationFrame(this.loop);
        }
    }

    update(dt) {
        // 메인 관리자(Admin) 개발/디자인 조정 순간 일시정지 (Freeze)
        if (this.isDevPaused) {
            return;
        }

        if (this.state === "mission_celebration") {
            this.updateCelebration(dt);
            return;
        }

        const char = CHARACTERS[this.selectedCharIndex];

        // 3D 점프 회피 롤링 애니메이션 및 타이머 갱신
        if (this.dodgeTimer > 0) {
            this.dodgeTimer -= dt;
            this.dodgeRollAngle = (1.0 - this.dodgeTimer / 0.65) * Math.PI * 2;
            if (this.dodgeTimer <= 0) {
                this.isDodging = false;
                this.dodgeRollAngle = 0;
            }
        }

        // 회피 성공 번개 섬광 & 아케이드 배너 타이머
        if (this.lightningFlash > 0) {
            this.lightningFlash = Math.max(0, this.lightningFlash - dt * 2.8);
        }
        if (this.dodgeSuccessBannerTimer > 0) {
            this.dodgeSuccessBannerTimer -= dt;
        }

        // 1. 무적 타이머
        if (this.isInvincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) this.isInvincible = false;
        }

        // 2. 콤보 타이머
        if (this.combo > 0) {
            this.comboTimer -= dt;
            const maxDuration = char.comboDuration;
            const fillPct = Math.max(0, this.comboTimer / maxDuration) * 100;
            const comboFill = document.getElementById("hud-combo-timer-fill");
            if (comboFill) comboFill.style.width = `${fillPct}%`;

            if (this.comboTimer <= 0) {
                this.combo = 0;
                this.multiplier = 1.0;
                this.isFever = false;
                this.updateComboHUD();
            }
        }

        // 3. 거리 진행
        let scrollSpeed = 220;
        if (this.specialEventActive && this.stageData.event === "current_rush") scrollSpeed *= 2.0;

        if (!this.bossActive && !this.kingActive) {
            this.distance += scrollSpeed * dt;
            const norm = Math.min(1.0, this.distance / this.stageData.totalDist);
            const progFill = document.getElementById("hud-progress-fill");
            if (progFill) progFill.style.width = `${norm * 100}%`;
            const progPin = document.getElementById("hud-progress-pin");
            if (progPin) progPin.style.left = `${norm * 100}%`;

            // 거리 점수 가산
            this.score += Math.round(dt * 60);
            this.updateScoreHUD();

            // 특수 이벤트 검사 (50% 지점)
            if (norm >= 0.5 && norm < 0.75 && !this.specialEventActive) {
                this.specialEventActive = true;
                const banner = document.getElementById("hud-event-banner");
                banner.classList.remove("hidden");
                document.getElementById("hud-event-text").innerText = this.stageData.eventText;

                if (this.stageData.event === "feeding_frenzy") {
                    this.triggerFeedingFrenzy();
                }
            } else if (norm >= 0.75 && this.specialEventActive) {
                this.specialEventActive = false;
                document.getElementById("hud-event-banner").classList.add("hidden");
            }

            // 각 스테이지 마지막 85% 지점: King of Enemies 출현!
            if (norm >= 0.85 && !this.kingActive) {
                this.spawnKingOfEnemies();
            }
        }

        // 4. 플레이어 수중 물리 & 3D 다이내믹 유영 애니메이션
        this.gameTimer += dt;
        this.swimTimer += dt * (1.2 + (this.input.jump ? 3.5 : 0.8));

        let targetVx = 0;
        let targetVy = 0;
        let spd = char.baseSpeed * 60 * (1.0 + this.bloodFrenzyBonus);

        if (this.input.left) targetVx -= spd;
        if (this.input.right) targetVx += spd;
        if (this.input.up) targetVy -= spd;
        if (this.input.down) targetVy += spd;
        if (this.input.jump) {
            targetVy -= char.boostPower * 80;
            targetVx += char.boostPower * 30;
            this.audio.playJump();
        }

        this.player.vx += (targetVx - this.player.vx) * (1 - char.drag);
        this.player.vy += (targetVy - this.player.vy) * (1 - char.drag);

        this.player.x += this.player.vx * dt;
        this.player.y += this.player.vy * dt;

        // 경계 제한 (1.75배 확대된 210px 스프라이트 고려)
        this.player.x = Math.max(90, Math.min(1190, this.player.x));
        this.player.y = Math.max(70, Math.min(650, this.player.y));

        // 3D 수영 틸트 각도 & 몸체 파동(Undulation)
        const targetAngle = Math.max(-0.42, Math.min(0.42, this.player.vy * 0.0026)) + Math.sin(this.swimTimer * 4.5) * 0.04;
        this.player.angle += (targetAngle - this.player.angle) * 0.15;

        // 유영 시 꼬리와 지느러미 뒤로 연속 방출되는 3D 수류 & 기포 파티클
        if (Math.random() < 0.38 || this.input.jump) {
            this.particles.push({
                x: this.player.x - 85 + (Math.random() - 0.5) * 20,
                y: this.player.y + (Math.random() - 0.5) * 22,
                vx: -scrollSpeed * 0.45 - Math.random() * 90,
                vy: (Math.random() - 0.5) * 40,
                color: this.isFever ? "rgba(0, 229, 255, 0.75)" : "rgba(200, 245, 255, 0.55)",
                radius: Math.random() * 5 + 3,
                isBubble: true
            });
        }

        // 5. 스포너 (먹이 및 장애물) - 출현 빈도 대폭 증가!
        this.spawnPreyTimer += dt;
        if (this.spawnPreyTimer >= 0.75) {
            this.spawnPreyTimer = 0;
            this.spawnPrey();
        }

        this.spawnHazardTimer += dt;
        // 장애물 출현 간격을 기존 2.2초에서 1.15초로 대폭 단축하여 박진감 증대
        if (this.spawnHazardTimer >= 1.15 && !this.bossActive) {
            this.spawnHazardTimer = 0;
            this.spawnHazard();
            // 35% 확률로 0.3초 후 연달아 2연속 편대 출현
            if (Math.random() < 0.35) {
                setTimeout(() => {
                    if (this.state === "playing" && !this.bossActive) this.spawnHazard();
                }, 320);
            }
        }

        // 6. 먹이 갱신 & 자연스러운 물고기 수영 유영(Bobbing) & 자력 흡입
        for (let i = this.preyList.length - 1; i >= 0; i--) {
            const p = this.preyList[i];
            p.x -= scrollSpeed * 0.8 * dt;
            // 상하 부드러운 유영 파동
            p.y += Math.sin(this.gameTimer * (p.bobSpeed || 3.0) + (p.bobOffset || 0)) * 35 * dt;

            // 자력 흡입 판정
            const dx = this.player.x - p.x;
            const dy = this.player.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < char.magnetRadius) {
                p.x += (dx / dist) * 500 * dt;
                p.y += (dy / dist) * 500 * dt;
            }

            // 획득 판정 (먹이 크기 확대에 맞춤)
            if (dist < this.player.radius + 30) {
                this.collectPrey(p);
                this.preyList.splice(i, 1);
                continue;
            }

            if (p.x < -80) this.preyList.splice(i, 1);
        }

        // 7. 3D 장애물 및 적 갱신 & 역동적 움직임 애니메이션 & 충돌 판정
        for (let i = this.hazardList.length - 1; i >= 0; i--) {
            const h = this.hazardList[i];
            h.animTimer = (h.animTimer || 0) + dt;

            // 역동적 장애물별 특수 궤적 및 파티클
            if (h.type === "mine") {
                // 기뢰 수직 부유
                h.y += Math.sin(h.animTimer * (h.bobFreq || 2.5)) * (h.bobAmp || 35) * dt;
            } else if (h.type === "torpedo") {
                // 어뢰 추진제 화염 & 스크루 캐비테이션 기포 방출
                if (Math.random() < 0.6) {
                    this.particles.push({
                        x: h.x + 55,
                        y: h.y + (Math.random() - 0.5) * 8,
                        vx: 180 + Math.random() * 80,
                        vy: (Math.random() - 0.5) * 20,
                        color: Math.random() < 0.5 ? "rgba(255, 120, 0, 0.85)" : "rgba(220, 245, 255, 0.75)",
                        radius: Math.random() * 4 + 3
                    });
                }
            } else if (h.type === "jellyfish") {
                // 해파리 상하 유영
                h.y += Math.sin(h.animTimer * 3.5) * 45 * dt;
            } else if (h.type === "iceberg") {
                // 회전 낙하
                h.rot = (h.rot || 0) + dt * (h.rotSpeed || 1.4);
            } else if (h.type === "barracuda") {
                // 돌진 어류 꼬리 요동
                h.tailWhip = Math.sin(h.animTimer * 12) * 0.15;
            }

            h.x -= (h.speedX + scrollSpeed * 0.5) * dt;
            h.y += (h.speedY || 0) * dt;

            const dx = this.player.x - h.x;
            const dy = this.player.y - h.y;
            const dist = Math.hypot(dx, dy);

            if (dist < this.player.radius + h.radius) {
                // 3D 점프 급격 회피 동작 중에는 적 및 장애물을 완벽히 회피 (세이브)
                if (this.isDodging) {
                    continue;
                }

                // 메갈로돈 장갑 파괴 검사
                if (char.key === "megalodon" && this.armorGauge >= 100) {
                    this.armorGauge = 0;
                    this.hazardList.splice(i, 1);
                    this.score += 500;
                    this.audio.playHit();
                    continue;
                }

                // 청새치 점프 돌진 관통 검사
                if (char.key === "blue_marlin" && this.input.jump) {
                    this.hazardList.splice(i, 1);
                    this.score += 300;
                    continue;
                }

                this.takeDamage();
            }

            if (h.x < -140) this.hazardList.splice(i, 1);
        }

        // 8. King of Enemies 라이벌 보스 또는 일반 보스 갱신
        if (this.kingActive && this.king) {
            this.updateKing(dt);
        } else if (this.bossActive && this.boss) {
            this.updateBoss(dt);
        }

        // 9. 배경 버블 갱신
        this.bubbles.forEach(b => {
            b.y -= b.speedY;
            if (b.y < -10) b.y = 730;
        });

        // 10. 메갈로돈 장갑 점진 회복
        if (char.key === "megalodon" && this.armorGauge < 100) {
            this.armorGauge = Math.min(100, this.armorGauge + dt * 10);
            const bar = document.getElementById("hud-skill-bar");
            if (bar) bar.style.width = `${this.armorGauge * 0.8}px`;
        }
    }

    spawnPrey() {
        const char = CHARACTERS[this.selectedCharIndex];
        const preys = PREY_DATABASE[char.key];
        const item = preys[Math.floor(Math.random() * preys.length)];

        this.preyList.push({
            x: 1340,
            y: Math.random() * 520 + 90,
            item: item,
            bobOffset: Math.random() * Math.PI * 2,
            bobSpeed: 2.8 + Math.random() * 2.2
        });
    }

    triggerFeedingFrenzy() {
        const char = CHARACTERS[this.selectedCharIndex];
        const preys = PREY_DATABASE[char.key];
        const rare = preys[preys.length - 1];

        for (let i = 0; i < 22; i++) {
            this.preyList.push({
                x: 1300 + Math.random() * 700,
                y: Math.random() * 520 + 90,
                item: rare,
                bobOffset: Math.random() * Math.PI * 2,
                bobSpeed: 3.5
            });
        }
    }

    // --- 3D 장애물 & 적 9종 출현 (사이즈 1.5~2배 확대 & 역동적 애니메이션) ---
    spawnHazard() {
        const kinds = [
            { id: "hazard_mine", name: "스파이크 기뢰", type: "mine", w: 85, h: 85, radius: 38, speedX: 55, speedY: 0, bobFreq: 2.2, bobAmp: 35 },
            { id: "hazard_torpedo", name: "유도 어뢰", type: "torpedo", w: 120, h: 60, radius: 30, speedX: 320, speedY: 0 },
            { id: "hazard_submarine", name: "스텔스 잠수함", type: "submarine", w: 155, h: 125, radius: 55, speedX: 110, speedY: 0 },
            { id: "hazard_jellyfish", name: "발광 해파리", type: "jellyfish", w: 85, h: 100, radius: 38, speedX: 75, speedY: -35 },
            { id: "hazard_diver", name: "잠수부", type: "diver", w: 100, h: 110, radius: 40, speedX: 95, speedY: 20 },
            { id: "hazard_iceberg", name: "낙하 유빙", type: "iceberg", w: 95, h: 110, radius: 44, speedX: 140, speedY: 110, rot: 0, rotSpeed: 1.4 },
            { id: "hazard_net", name: "어망", type: "net", w: 95, h: 100, radius: 42, speedX: 50, speedY: 0 },
            { id: "hazard_barracuda", name: "바라쿠다", type: "barracuda", w: 125, h: 65, radius: 34, speedX: 250, speedY: 0 },
            { id: "hazard_lionfish", name: "쏠배감펭", type: "lionfish", w: 105, h: 95, radius: 40, speedX: 100, speedY: 0 }
        ];

        const selected = kinds[Math.floor(Math.random() * kinds.length)];
        const y = Math.random() * 500 + 100;

        // 범고래 초음파 탐지(Echolocation) 경고 & 고속 위협 사전 경고
        if (CHARACTERS[this.selectedCharIndex].key === "killer_whale" || selected.type === "torpedo" || selected.type === "barracuda") {
            const warn = document.getElementById("hud-warning-indicator");
            if (warn) {
                warn.classList.remove("hidden");
                setTimeout(() => warn.classList.add("hidden"), 1200);
            }
        }

        this.hazardList.push({
            x: 1350,
            y: y,
            animTimer: Math.random() * 10,
            seed: Math.random() * 100,
            ...selected
        });
    }

    spawnBoss() {
        this.boss = {
            name: this.stageData.bossName,
            hp: 100,
            maxHp: 100,
            x: 1050,
            y: 360,
            timer: 0
        };
    }

    updateBoss(dt) {
        this.boss.timer += dt;
        this.boss.y = 360 + Math.sin(this.boss.timer * 2) * 160;

        // 보스 공격 주기적 발사
        if (Math.random() < 0.03) {
            this.hazardList.push({
                x: this.boss.x,
                y: this.boss.y,
                icon: "⚡",
                radius: 20,
                speedX: 250,
                speedY: 0
            });
        }

        // 플레이어가 보스 주변에서 부스트 시 타격
        const dx = this.player.x - this.boss.x;
        const dy = this.player.y - this.boss.y;
        if (Math.hypot(dx, dy) < 140 && this.input.jump) {
            this.boss.hp -= 20;
            this.audio.playHit();
            if (this.boss.hp <= 0) {
                this.bossActive = false;
                this.boss = null;
                this.stageClear();
            }
        }
    }

    collectPrey(p) {
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        const char = CHARACTERS[this.selectedCharIndex];
        this.comboTimer = char.comboDuration;

        // 배율 계산
        if (this.combo < 5) this.multiplier = 1.0;
        else if (this.combo < 10) this.multiplier = 1.5;
        else if (this.combo < 20) this.multiplier = 2.0;
        else {
            this.multiplier = (char.key === "shark" && this.combo >= 25) ? 4.0 : 3.0;
            this.isFever = true;
        }

        // 상어 피의 포식 스피드 가산
        if (char.key === "shark") {
            this.bloodFrenzyBonus = Math.min(0.20, this.combo * 0.015);
        }

        const pts = Math.round(p.item.score * this.multiplier);
        this.score += pts;

        // Pitch Shifted SFX
        const pitch = Math.min(2.0, 1.0 + (this.combo * 0.05));
        this.audio.playPreyEat(pitch);

        this.updateScoreHUD();
        this.updateComboHUD();
    }

    // --- 렌더링 파이프라인 ---
    render() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 스테이지별 수중 배경 (커스텀 이미지 우선 적용, 없으면 그라데이션)
        const stageImg = this.customImages[`stage_${this.currentStageIndex}`];
        if (stageImg) {
            // 심리스 2단 파라락스 스크롤 렌더링
            const offsetX = (this.distance * 0.4) % canvas.width;
            ctx.drawImage(stageImg, -offsetX, 0, canvas.width, canvas.height);
            ctx.drawImage(stageImg, canvas.width - offsetX, 0, canvas.width, canvas.height);
        } else {
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, this.stageData.bgGrad[0]);
            grad.addColorStop(0.5, this.stageData.bgGrad[1]);
            grad.addColorStop(1, this.stageData.bgGrad[2]);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. 수면 햇살(God Rays) 효과
            ctx.save();
            ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.moveTo(100 + i * 220, 0);
                ctx.lineTo(250 + i * 220, 720);
                ctx.lineTo(180 + i * 220, 720);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }

        // 3. 부유 수중 버블
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.bubbles.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 4. 먹이 렌더링 (1.7배 확대, 자연스러운 3D 종횡비, 배경 및 그림자 100% 완전 제거 & 3D 역동적 수영 애니메이션)
        this.preyList.forEach(p => {
            const pImg = this.preyImages[p.item.id];
            const baseSize = p.item.rare ? 92 : 76;

            ctx.save();
            ctx.translate(p.x, p.y);

            // 3D 역동적 수영 틸트 (상하 유영 방향에 따른 3D Pitch 각도)
            const swimPitch = Math.sin(this.gameTimer * (p.bobSpeed || 3.0) + (p.bobOffset || 0)) * 0.14;
            ctx.rotate(swimPitch);

            // 3D 꼬리 추진 와글 & Squash/Stretch (역동적 수영 움직임)
            const waggle = Math.sin(this.gameTimer * 8.5 + (p.bobOffset || 0));
            const scaleX = 1.0 + waggle * 0.08;
            const scaleY = 1.0 - waggle * 0.05;
            ctx.scale(scaleX, scaleY);

            if (pImg && pImg.complete && pImg.naturalWidth > 0) {
                const aspect = pImg.naturalWidth / pImg.naturalHeight;
                let pw = baseSize;
                let ph = baseSize;
                if (aspect > 1) {
                    pw = baseSize * Math.min(aspect, 1.75);
                    ph = pw / aspect;
                } else {
                    ph = baseSize * (1 / Math.max(aspect, 0.55));
                    pw = ph * aspect;
                }

                // 투명 3D 먹이 렌더링
                ctx.drawImage(pImg, -pw / 2, -ph / 2, pw, ph);

                // 3D 수중 입체 광택 및 스펙큘러 셰이딩 (은은한 수중 광원 반사 - 안전한 좌표 오프셋 방식)
                ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                const shimmerX = Math.sin(this.gameTimer * 2.2 + (p.bobOffset || 0)) * (pw * 0.55);
                const lightGrad = ctx.createLinearGradient(shimmerX - 22, -ph / 2, shimmerX + 22, ph / 2);
                lightGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
                lightGrad.addColorStop(0.5, "rgba(230, 250, 255, 0.28)");
                lightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.fillStyle = lightGrad;
                ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
                ctx.restore();
            } else {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${p.item.rare ? 44 : 38}px sans-serif`;
                ctx.fillText(p.item.icon, 0, 0);
            }

            ctx.restore();
        });

        // 5. 3D 장애물 & 적 렌더링 (사이즈 1.5~2배 확대 & 바닥 사각 그림자 제거 & 역동적 애니메이션)
        this.hazardList.forEach(h => {
            const hImg = this.hazardImages[h.id];
            const hw = (h.w || 90);
            const hh = (h.h || 90);

            if (hImg && hImg.complete && hImg.naturalWidth > 0) {
                ctx.save();
                ctx.translate(h.x, h.y);

                if (h.type === "torpedo") {
                    // 유도 어뢰: 후방 추진 화염 & 전방 락온 레이저
                    ctx.save();
                    const thrustGrad = ctx.createLinearGradient(hw * 0.45, 0, hw * 0.45 + 35, 0);
                    thrustGrad.addColorStop(0, "rgba(255, 140, 0, 0.9)");
                    thrustGrad.addColorStop(1, "rgba(255, 50, 0, 0)");
                    ctx.fillStyle = thrustGrad;
                    ctx.beginPath();
                    ctx.moveTo(hw * 0.45, -10);
                    ctx.lineTo(hw * 0.45 + 35 + Math.sin(h.animTimer * 20) * 10, 0);
                    ctx.lineTo(hw * 0.45, 10);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "submarine") {
                    // 잠수함: 전방 탐조등 원뿔 빔(Searchlight Beam)
                    ctx.save();
                    const beamGrad = ctx.createRadialGradient(-hw * 0.4, 0, 10, -hw * 0.4 - 180, 0, 220);
                    beamGrad.addColorStop(0, "rgba(255, 245, 180, 0.45)");
                    beamGrad.addColorStop(1, "rgba(255, 245, 180, 0)");
                    ctx.fillStyle = beamGrad;
                    ctx.beginPath();
                    ctx.moveTo(-hw * 0.4, -15);
                    ctx.lineTo(-hw * 0.4 - 200, -75);
                    ctx.lineTo(-hw * 0.4 - 200, 75);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "mine") {
                    // 스파이크 기뢰: 중심 적색 경고 비콘 점멸
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                    const beaconAlpha = 0.5 + Math.sin(h.animTimer * 8) * 0.5;
                    ctx.fillStyle = `rgba(255, 30, 30, ${beaconAlpha})`;
                    ctx.shadowColor = "#ff0000";
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(0, 0, 7, 0, Math.PI * 2);
                    ctx.fill();
                } else if (h.type === "jellyfish") {
                    // 발광 해파리: 주기적 수축/팽창 펄스 애니메이션
                    const scaleY = 1.0 + Math.sin(h.animTimer * 4.5) * 0.16;
                    const scaleX = 1.0 - Math.sin(h.animTimer * 4.5) * 0.08;
                    ctx.scale(scaleX, scaleY);
                    ctx.shadowColor = "#00e5ff";
                    ctx.shadowBlur = 22;
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "iceberg") {
                    // 낙하 유빙: 3D 회전 애니메이션
                    ctx.rotate(h.rot || 0);
                    ctx.shadowColor = "#90e0ef";
                    ctx.shadowBlur = 18;
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "diver") {
                    // 잠수부: 핀 킥 각도 요동
                    const kickTilt = Math.sin(h.animTimer * 5) * 0.09;
                    ctx.rotate(kickTilt);
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "net") {
                    // 어망: 조류 흔들림
                    const sway = Math.sin(h.animTimer * 2) * 0.12;
                    ctx.rotate(sway);
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "barracuda") {
                    // 바라쿠다: 꼬리 지느러미 채찍질
                    const whip = Math.sin(h.animTimer * 14) * 0.08;
                    ctx.rotate(whip);
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else if (h.type === "lionfish") {
                    // 쏠배감펭: 독침 지느러미 파동
                    const fin = Math.sin(h.animTimer * 6) * 0.06;
                    ctx.rotate(fin);
                    ctx.shadowColor = "#ff007f";
                    ctx.shadowBlur = 15;
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                } else {
                    ctx.drawImage(hImg, -hw / 2, -hh / 2, hw, hh);
                }

                ctx.restore();
            } else {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "42px sans-serif";
                ctx.fillText(h.icon || "⚠️", h.x, h.y);
            }
        });

        // 6. King of Enemies 라이벌 보스 또는 일반 보스 렌더링
        if (this.kingActive && this.king) {
            const k = this.king;
            // 타겟 레이저 라인 (경고 및 돌진 시)
            if (k.laserAlpha > 0) {
                ctx.save();
                ctx.strokeStyle = `rgba(255, 30, 80, ${k.laserAlpha})`;
                ctx.lineWidth = 3.5;
                ctx.setLineDash([12, 8]);
                ctx.shadowColor = "#ff0055";
                ctx.shadowBlur = 16;
                ctx.beginPath();
                ctx.moveTo(k.x, k.y);
                ctx.lineTo(this.player.x, this.player.y);
                ctx.stroke();
                ctx.restore();
            }

            // 수중 바닥 3D 심도 그림자
            ctx.save();
            ctx.fillStyle = "rgba(0, 10, 30, 0.4)";
            ctx.beginPath();
            ctx.ellipse(k.x, Math.min(680, k.y + 85), 110, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // King 스프라이트 렌더링 (플레이어 방향으로 좌우 반전 & 1.85배 대형 스케일)
            const kingImg = this.characterImages[k.charKey];
            ctx.save();
            ctx.translate(k.x, k.y);
            ctx.scale(-1, 1);
            ctx.shadowColor = "#ff0055";
            ctx.shadowBlur = 38;

            if (kingImg && kingImg.complete && kingImg.naturalWidth > 0) {
                ctx.drawImage(kingImg, -125, -69, 250, 138);

                // 사나운 붉은 안광(Predatory Red Eye Glow)
                ctx.save();
                ctx.fillStyle = "#ff0033";
                ctx.shadowColor = "#ff0000";
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(65, -12, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.font = "95px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(k.avatar || "🦈", 0, 0);
            }
            ctx.restore();

            // King 머리 위 왕관 및 타이틀 표시
            ctx.save();
            ctx.font = "900 16px 'Outfit', sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffe66d";
            ctx.shadowColor = "#ff0055";
            ctx.shadowBlur = 14;
            ctx.fillText(`👑 ${k.name}`, k.x, k.y - 82);
            ctx.restore();
        } else if (this.bossActive && this.boss) {
            ctx.save();
            ctx.shadowColor = "#ff007f";
            ctx.shadowBlur = 35;
            ctx.font = "96px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("👾", this.boss.x, this.boss.y);

            // 보스 HP 바
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(this.boss.x - 100, this.boss.y - 85, 200, 16);
            ctx.fillStyle = "#ff3366";
            ctx.fillRect(this.boss.x - 100, this.boss.y - 85, (this.boss.hp / this.boss.maxHp) * 200, 16);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(this.boss.x - 100, this.boss.y - 85, 200, 16);
            ctx.restore();
        }

        // 7. 먹물/효과 파티클 렌더링
        this.particles.forEach((pt, idx) => {
            ctx.fillStyle = pt.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fill();
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.radius *= 0.96;
            if (pt.radius < 0.8) this.particles.splice(idx, 1);
        });

        // 8. 플레이어 캐릭터 렌더링 (1.75배 확대 & 3D 아크로바틱 배럴롤 회피 & 파동 유영 & 수면 코스틱)
        if (this.state === "playing" || this.state === "mission_celebration") {
            const char = CHARACTERS[this.selectedCharIndex];
            const cImg = this.characterImages[char.key];

            // 미션 성공 찬란한 광채 방출 (Sunburst Rays) 또는 미션 실패 어두운 비네팅
            if (this.state === "mission_celebration" && this.celebration) {
                const c = this.celebration;
                if (c.isSuccess) {
                    ctx.save();
                    ctx.translate(this.player.x, this.player.y);
                    const rayCount = 18;
                    for (let r = 0; r < rayCount; r++) {
                        const ang = (r / rayCount) * Math.PI * 2 + c.shimmerAngle;
                        const rayLen = 260 + Math.sin(this.gameTimer * 5 + r) * 35;
                        const rayGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, rayLen);
                        rayGrad.addColorStop(0, "rgba(255, 230, 109, 0.45)");
                        rayGrad.addColorStop(0.5, "rgba(255, 183, 3, 0.18)");
                        rayGrad.addColorStop(1, "rgba(255, 183, 3, 0)");

                        ctx.fillStyle = rayGrad;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.arc(0, 0, rayLen, ang - 0.1, ang + 0.1);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.restore();
                } else {
                    ctx.save();
                    ctx.translate(this.player.x, this.player.y);
                    const gloomGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 220);
                    gloomGrad.addColorStop(0, "rgba(30, 40, 60, 0.45)");
                    gloomGrad.addColorStop(0.7, "rgba(10, 15, 25, 0.25)");
                    gloomGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = gloomGrad;
                    ctx.beginPath();
                    ctx.arc(0, 0, 220, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            // 수중 바닥 3D 심도 그림자 (Depth Shadow)
            ctx.save();
            ctx.fillStyle = "rgba(0, 15, 40, 0.35)";
            ctx.beginPath();
            ctx.ellipse(this.player.x, Math.min(680, this.player.y + 75), 90, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 3D 유영 몸체 파동(Undulation) 오프셋
            const swimBob = Math.sin(this.swimTimer * 5.0) * 5;

            ctx.save();
            ctx.translate(this.player.x, this.player.y + swimBob);
            ctx.rotate(this.player.angle);

            // 3D 점프 급격 회피 (3D Somersault / Barrel Roll Evasion) 곡예 기동
            if (this.state === "mission_celebration" && this.celebration) {
                if (this.celebration.isSuccess) {
                    ctx.scale(1.15, 1.15);
                    ctx.shadowColor = "#ffe66d";
                    ctx.shadowBlur = 48;
                } else {
                    ctx.scale(0.95, 0.95);
                    ctx.shadowColor = "#3a506b";
                    ctx.shadowBlur = 18;
                    ctx.globalAlpha = 0.85;
                }
            } else if (this.isDodging) {
                ctx.rotate(this.dodgeRollAngle);
                const depthScale = 1.0 + Math.sin(this.dodgeRollAngle * 0.5) * 0.42;
                ctx.scale(depthScale, depthScale);
                ctx.shadowColor = "#00ffff";
                ctx.shadowBlur = 48;
            } else {
                // 유영 가속 시 3D 몸체 신축(Squash & Stretch Flex)
                const flexX = 1.0 + Math.sin(this.swimTimer * 5.0) * 0.035;
                const flexY = 1.0 - Math.sin(this.swimTimer * 5.0) * 0.035;
                ctx.scale(flexX, flexY);
                ctx.shadowColor = "#00e5ff";
                ctx.shadowBlur = this.isFever ? 35 : 18;
            }

            // 무적 상태 깜빡임
            if (this.isInvincible && Math.floor(Date.now() / 80) % 2 === 0) {
                ctx.globalAlpha = 0.3;
            }

            if (cImg && cImg.complete && cImg.naturalWidth > 0) {
                // 고화질 캐릭터 3D 투명 PNG 렌더링 (가로 210, 세로 115)
                ctx.drawImage(cImg, -105, -57, 210, 115);

                // 3D 수면 햇살(Caustics) 및 스펙큘러 셰이딩 광택 효과 (source-atop - 안전한 좌표 오프셋)
                ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                const causticsX = Math.sin(this.gameTimer * 1.5) * 80;
                const causticsGrad = ctx.createLinearGradient(causticsX - 45, -60, causticsX + 45, 60);
                causticsGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
                causticsGrad.addColorStop(0.5, "rgba(210, 245, 255, 0.32)");
                causticsGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.fillStyle = causticsGrad;
                ctx.fillRect(-110, -60, 220, 120);
                ctx.restore();
            } else {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "80px sans-serif";
                ctx.fillText(char.avatar, 0, 0);
            }

            ctx.restore();
        }

        // 9. 번개 섬광 & 가지형 번개 볼트 렌더링
        if (this.lightningFlash > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(230, 248, 255, ${this.lightningFlash * 0.75})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        if (this.lightningBolts && this.lightningBolts.length > 0) {
            ctx.save();
            this.lightningBolts.forEach(bolt => {
                if (bolt.points.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
                    for (let i = 1; i < bolt.points.length; i++) {
                        ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
                    }
                    ctx.strokeStyle = bolt.color;
                    ctx.lineWidth = bolt.width * (this.lightningFlash > 0 ? 1.5 : 1.0);
                    ctx.shadowColor = bolt.color;
                    ctx.shadowBlur = 24;
                    ctx.stroke();
                }
            });
            ctx.restore();
        }

        // 10. "*회 회피성공" 아케이드 플로팅 메시지 배너
        if (this.dodgeSuccessBannerTimer > 0) {
            ctx.save();
            const alpha = Math.min(1.0, this.dodgeSuccessBannerTimer * 2.0);
            const bounce = 1.0 + Math.sin(this.dodgeSuccessBannerTimer * 6.0) * 0.08;
            ctx.translate(canvas.width / 2, 220);
            ctx.scale(bounce, bounce);
            ctx.globalAlpha = alpha;

            // 배경 글로우 캡슐
            ctx.fillStyle = "rgba(11, 19, 43, 0.88)";
            ctx.strokeStyle = "#ffe66d";
            ctx.lineWidth = 3.5;
            ctx.shadowColor = "#ffe66d";
            ctx.shadowBlur = 32;
            ctx.beginPath();
            ctx.roundRect(-250, -44, 500, 88, 44);
            ctx.fill();
            ctx.stroke();

            // 메시지 텍스트
            ctx.font = "900 42px 'Outfit', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffe66d";
            ctx.shadowColor = "#00e5ff";
            ctx.shadowBlur = 22;
            ctx.fillText(this.dodgeSuccessBannerText, 0, 0);
            ctx.restore();
        }

        // 11. 메인 관리자 개발/디자인 조정 일시정지 오버레이
        if (this.isDevPaused) {
            ctx.save();
            ctx.fillStyle = "rgba(4, 11, 24, 0.45)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 상단 우측 디자인 조정 배지
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            ctx.strokeStyle = "#00e5ff";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#00e5ff";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.roundRect(canvas.width - 340, 18, 310, 42, 8);
            ctx.fill();
            ctx.stroke();

            ctx.font = "900 14px 'Outfit', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#00e5ff";
            ctx.fillText("⏸️ ADMIN DEV PAUSED (DESIGN MODE)", canvas.width - 185, 39);
            ctx.restore();
        }
    }
}

// 윈도우 로드 시 자동 부팅
window.addEventListener("DOMContentLoaded", () => {
    window.game = new KillerWhaleGame();
});
