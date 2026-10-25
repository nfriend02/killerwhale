/**
 * [Killer Whale] Internationalization (i18n) Module
 * Supports Korean (ko - default), English (en), and Japanese (ja).
 * All source code and internal keys are strictly in English.
 */

const I18N_DATA = {
    ko: {
        // App & General
        appTitle: "범고래 (Killer Whale) - 횡스크롤 해양 아케이드",
        gameTitle: "KILLER WHALE",
        gameSubtitle: "미니게임 범고래 — 횡스크롤 해양 아케이드",
        touchToStart: "화면을 터치하여 시작하세요",
        audioGestureHint: "첫 터치 시 신디사이저 사운드가 활성화됩니다",
        loading: "로딩 중...",
        back: "뒤로 가기",
        close: "닫기",
        confirm: "확인",
        cancel: "취소",
        save: "저장",
        introSoundBtn: "🔊 소리 켜기",
        introSoundMute: "🔇 소리 끄기",
        introSkipBtn: "SKIP ⏭",

        // Auth & Login
        loginTitle: "로그인",
        loginSubtitle: "바다의 패자가 되기 위한 여정을 시작하세요",
        tabGuest: "게스트",
        tabGoogle: "Google",
        tabEmail: "이메일",
        tabPhone: "전화번호",
        guestNotice: "게스트 모드는 브라우저 세션 동안 닉네임으로 유지되며, 세션 종료 시 초기화됩니다.",
        btnGuestPlay: "게스트로 바로 플레이",
        btnGoogleLogin: "Google 계정으로 로그인",
        emailLabel: "이메일 주소",
        emailPlaceholder: "name@example.com",
        passwordLabel: "비밀번호 (6~20자 영문/숫자)",
        passwordPlaceholder: "비밀번호 입력",
        passwordConfirmLabel: "비밀번호 확인",
        passwordConfirmPlaceholder: "비밀번호 재입력",
        phoneLabel: "전화번호",
        phonePlaceholder: "10-1234-5678",
        showPassword: "보기",
        hidePassword: "숨김",
        btnLogin: "로그인",
        btnRegister: "회원가입",
        toggleToRegister: "계정이 없으신가요? 회원가입",
        toggleToLogin: "이미 계정이 있으신가요? 로그인",

        // Auth Validation & Errors
        errEmptyEmail: "이메일을 입력하세요",
        errEmptyPhone: "전화번호를 입력하세요",
        errPasswordFormat: "영문 또는 숫자로 입력하세요",
        errPasswordMismatch: "비밀번호가 일치하지 않습니다",
        errLoginFailedEmail: "이메일 또는 비밀번호를 다시 확인해 주세요",
        errLoginFailedPhone: "전화번호 또는 비밀번호를 다시 확인해 주세요",
        errNicknameLength: "닉네임은 2~12자 사이여야 합니다",

        // Nickname Setup
        nicknameTitle: "닉네임 설정",
        nicknameSubtitle: "첫 이용을 환영합니다! 바다에서 사용할 별명을 정해 주세요.",
        nicknamePlaceholder: "2~12자 한글/영문/숫자",
        btnNicknameSubmit: "별명 결정하고 시작 (Enter)",
        nicknameHint: "2~12자 이내로 입력 후 Enter 키를 눌러 제출하세요.",

        // User Navigation & Header
        btnLogout: "로그아웃",
        btnMyPage: "마이페이지",
        userGuestBadge: "게스트",
        sessionTimeoutWarning: "30분간 활동이 없어 자동 로그아웃되었습니다.",

        // My Page
        myPageTitle: "마이페이지",
        myPageNicknameLabel: "내 닉네임",
        btnEditNickname: "닉네임 수정",
        myPageAccountType: "계정 유형",
        myPagePasswordLabel: "비밀번호",
        myPageMaskedPassword: "••••••••",
        btnChangePassword: "비밀번호 변경",
        btnDeleteAccount: "탈퇴",
        btnDeleteAccountConfirm: "탈퇴 확인",
        deleteAccountNotice: "계정과 개인정보가 삭제됩니다. 순위 기록은 이름을 지운 채 남을 수 있습니다.",
        deleteAccountSuccess: "탈퇴가 완료되었습니다.",

        // Change Password Modal
        changePasswordTitle: "비밀번호 변경",
        newPasswordLabel: "새 비밀번호 (6~20자)",
        newPasswordPlaceholder: "새 비밀번호 입력",
        btnSavePassword: "비밀번호 저장",

        // Title Screen Actions
        btnStartGame: "START GAME",
        btnCharacterSelect: "주인공 선택 (5종)",
        btnSettings: "환경 설정 ⚙️",
        btnReplayIntro: "🎬 인트로 다시보기",
        controlTips: "조작: 왼손 엄지 JUMP (부스트) / 오른손 엄지 4방향 D-Pad | PC: Space / WASD",

        // Character Select
        charSelectTitle: "주인공 캐릭터 선택",
        speed: "이동 속도",
        boost: "부스트",
        hitbox: "피격 판정",
        magnet: "먹이 흡입",
        preyCollectionTitle: "전용 먹이 10종 컬렉션",
        btnDeployCharacter: "이 캐릭터로 출격!",

        // Characters
        char_killer_whale_name: "범고래 (Killer Whale)",
        char_killer_whale_trait: "올라운더 / 밸런스형",
        char_killer_whale_skill: "초음파 탐지: 위험 요소 사전 경고",

        char_shark_name: "상어 (Shark)",
        char_shark_trait: "기습 / 속도 특화형",
        char_shark_skill: "피의 포식: 연속 포식 시 이속 누적 & 콤보 배율 상승",

        char_blue_marlin_name: "청새치 (Blue Marlin)",
        char_blue_marlin_trait: "초고속 직진 / 돌진형",
        char_blue_marlin_skill: "스피어 돌진: 점프 가속 중 장애물 관통 파괴",

        char_giant_squid_name: "대왕오징어 (Giant Squid)",
        char_giant_squid_trait: "테크니컬 / 방어 특화형",
        char_giant_squid_skill: "먹물 스크린: 피격 시 먹물 방출로 위험 자동 회피",

        char_megalodon_name: "메갈로돈 (Megalodon)",
        char_megalodon_trait: "파괴신 / 묵직한 거체형",
        char_megalodon_skill: "고대 괴수의 위용: 단단한 장갑으로 장애물 1회 방어",

        // Settings Modal
        settingsTitle: "게임 환경 설정",
        settingsLivesGroup: "기본 목숨 (Lives) 설정:",
        settingsSoundGroup: "사운드 설정:",
        settingsControllerGroup: "가상 컨트롤러 커스텀:",
        livesUnit: "회",
        soundBgm: "BGM",
        soundSfx: "SFX",
        ctrlOpacity: "투명도",
        ctrlScale: "크기",
        btnResume: "계속하기 (Resume)",
        btnHome: "타이틀로 (Home)",

        // In-game HUD
        pause: "일시정지",
        scoreLabel: "SCORE",
        comboLabel: "COMBO",
        skillLabel: "스킬",
        jumpLabel: "JUMP",
        warningApproach: "⚠️ 위험 접근!",
        missionBtnTitle: "회피 미션 창 열기",

        // King Mission HUD
        kingMissionTitle: "KING OF ENEMIES",
        dodgeSuccessCountLabel: "회피 미션 성공:",
        dodgeTipText: "JUMP를 눌러 적의 돌진을 3D 공중제비로 회피하세요!",
        closeMissionBoxTip: "미션 창 접기",
        btnViewScoreText: "스코어 보기",

        // Celebration & Stage Clear / Fail
        missionSuccessTitle: "미션 성공",
        missionFailTitle: "미션 실패",
        stageClearSubtitle: "King of Enemies 격파 완료! 전설적 수중 제왕의 탄생!",
        stageFailSubtitle: "심해의 위협을 극복하지 못하고 가라앉았습니다...",

        // Result Screen
        resultTitleClear: "STAGE CLEAR",
        resultTitleFail: "GAME OVER",
        finalScoreLabel: "최종 획득 점수",
        maxComboLabel: "최대 콤보",
        acquiredPreyTitle: "획득한 전용 먹이 현황",
        btnRetry: "다시 도전 (Retry)",
        btnNextStage: "다음 스테이지 ▶",
        btnResultHome: "메인 화면",

        // Stages & Bridges
        stage_1_name: "Stage 1: 태평양의 패자",
        stage_2_name: "Stage 2: 남극의 유빙 해협",
        stage_3_name: "Stage 3: 열대 산호초의 미궁",
        stage_4_name: "Stage 4: 대서양 심해의 암전",
        stage_5_name: "Stage 5: 마리아나 해구의 심연",
        stage_1_bridge: "태평양의 패권을 노리던 거대 백상아리의 맹렬한 습격을 극적인 3D 공중제비로 회피하고, 차가운 극지의 빙하 해역으로 진입합니다!",
        stage_2_bridge: "빙하 협곡을 음속으로 꿰뚫는 청새치의 치명적인 바늘 돌진을 연속 회피하여 생환했습니다. 이제 화려한 네온 산호초 미로로 향합니다!",
        stage_3_bridge: "빛나는 네온 산호초 심연에서 뻗쳐나온 대왕오징어의 초거대 촉수 포획을 뚫고, 빛이 전혀 닿지 않는 대서양 칠흑의 심해로 침투합니다!",
        stage_4_bridge: "칠흑 같은 심해의 암흑 속에서 덮쳐오는 고대 최상위 포식자 메갈로돈의 강철 턱을 완벽히 피해냈습니다! 마침내 지각이 갈라지는 최종 결전지, 마리아나 해구로 강하합니다!",
        stage_5_bridge: "마리아나 해구의 심연 속에서 모든 포식자들의 지배자를 상대로 완벽한 전설적 회피를 달성했습니다! 당신은 이제 전 바다의 유일무이한 절대 군주입니다!",

        // Language toggle
        langSelect: "언어 선택"
    },

    en: {
        // App & General
        appTitle: "Killer Whale - Side-Scrolling Ocean Arcade",
        gameTitle: "KILLER WHALE",
        gameSubtitle: "Killer Whale Arcade — Side-Scrolling Ocean Adventure",
        touchToStart: "Click or Tap to Start",
        audioGestureHint: "First click activates synthesizer audio engine",
        loading: "Loading...",
        back: "Back",
        close: "Close",
        confirm: "Confirm",
        cancel: "Cancel",
        save: "Save",
        introSoundBtn: "🔊 Sound ON",
        introSoundMute: "🔇 Sound OFF",
        introSkipBtn: "SKIP ⏭",

        // Auth & Login
        loginTitle: "Login",
        loginSubtitle: "Embark on your journey to become the sovereign of the ocean",
        tabGuest: "Guest",
        tabGoogle: "Google",
        tabEmail: "Email",
        tabPhone: "Phone",
        guestNotice: "Guest mode maintains your nickname for the current session and resets upon session end.",
        btnGuestPlay: "Play as Guest",
        btnGoogleLogin: "Sign in with Google",
        emailLabel: "Email Address",
        emailPlaceholder: "name@example.com",
        passwordLabel: "Password (6-20 alphanumeric characters)",
        passwordPlaceholder: "Enter password",
        passwordConfirmLabel: "Confirm Password",
        passwordConfirmPlaceholder: "Re-enter password",
        phoneLabel: "Phone Number",
        phonePlaceholder: "(555) 123-4567",
        showPassword: "Show",
        hidePassword: "Hide",
        btnLogin: "Sign In",
        btnRegister: "Register",
        toggleToRegister: "Don't have an account? Sign up",
        toggleToLogin: "Already have an account? Sign in",

        // Auth Validation & Errors
        errEmptyEmail: "Enter an email",
        errEmptyPhone: "Enter a phone number",
        errPasswordFormat: "Please enter 6-20 alphanumeric characters",
        errPasswordMismatch: "Passwords do not match",
        errLoginFailedEmail: "Please check your email or password again",
        errLoginFailedPhone: "Please check your phone number or password again",
        errNicknameLength: "Nickname must be between 2 and 12 characters",

        // Nickname Setup
        nicknameTitle: "Set Nickname",
        nicknameSubtitle: "Welcome! Choose a nickname before swimming into the deep ocean.",
        nicknamePlaceholder: "2-12 characters",
        btnNicknameSubmit: "Confirm & Start (Enter)",
        nicknameHint: "Enter 2-12 characters and press Enter to submit.",

        // User Navigation & Header
        btnLogout: "Logout",
        btnMyPage: "My Page",
        userGuestBadge: "Guest",
        sessionTimeoutWarning: "You were logged out due to 30 minutes of inactivity.",

        // My Page
        myPageTitle: "My Page",
        myPageNicknameLabel: "Nickname",
        btnEditNickname: "Edit Nickname",
        myPageAccountType: "Account Type",
        myPagePasswordLabel: "Password",
        myPageMaskedPassword: "••••••••",
        btnChangePassword: "Change Password",
        btnDeleteAccount: "Delete Account",
        btnDeleteAccountConfirm: "Confirm Delete",
        deleteAccountNotice: "Your account and personal data will be deleted. Ranking records may remain anonymously.",
        deleteAccountSuccess: "Your account has been deleted.",

        // Change Password Modal
        changePasswordTitle: "Change Password",
        newPasswordLabel: "New Password (6-20 chars)",
        newPasswordPlaceholder: "Enter new password",
        btnSavePassword: "Save Password",

        // Title Screen Actions
        btnStartGame: "START GAME",
        btnCharacterSelect: "Select Character (5)",
        btnSettings: "Settings ⚙️",
        btnReplayIntro: "🎬 Replay Intro",
        controlTips: "Controls: Left Thumb JUMP (Boost) / Right Thumb 4-way D-Pad | PC: Space / WASD",

        // Character Select
        charSelectTitle: "Select Protagonist",
        speed: "Speed",
        boost: "Boost",
        hitbox: "Hitbox",
        magnet: "Magnet",
        preyCollectionTitle: "10 Exclusive Prey Species",
        btnDeployCharacter: "Deploy with this Character!",

        // Characters
        char_killer_whale_name: "Killer Whale",
        char_killer_whale_trait: "All-Rounder / Balanced",
        char_killer_whale_skill: "Sonar Detection: Hazard alert signals",

        char_shark_name: "Shark",
        char_shark_trait: "Ambush / Speed Focus",
        char_shark_skill: "Blood Frenzy: Consecutive prey adds speed & combo boost",

        char_blue_marlin_name: "Blue Marlin",
        char_blue_marlin_trait: "High-Speed Piercing / Rush",
        char_blue_marlin_skill: "Spear Charge: Pierces through obstacles during boost",

        char_giant_squid_name: "Giant Squid",
        char_giant_squid_trait: "Technical / Defense Focus",
        char_giant_squid_skill: "Ink Screen: Releases smoke screen upon hit to evade danger",

        char_megalodon_name: "Megalodon",
        char_megalodon_trait: "Titan / Heavy Juggernaut",
        char_megalodon_skill: "Apex Armor: Heavy prehistoric scales absorb 1 hit",

        // Settings Modal
        settingsTitle: "Game Settings",
        settingsLivesGroup: "Default Lives:",
        settingsSoundGroup: "Sound Settings:",
        settingsControllerGroup: "Virtual Controller:",
        livesUnit: " Lives",
        soundBgm: "BGM",
        soundSfx: "SFX",
        ctrlOpacity: "Opacity",
        ctrlScale: "Scale",
        btnResume: "Resume",
        btnHome: "Home",

        // In-game HUD
        pause: "Pause",
        scoreLabel: "SCORE",
        comboLabel: "COMBO",
        skillLabel: "SKILL",
        jumpLabel: "JUMP",
        warningApproach: "⚠️ Hazard Alert!",
        missionBtnTitle: "Open Evasion Mission",

        // King Mission HUD
        kingMissionTitle: "KING OF ENEMIES",
        dodgeSuccessCountLabel: "Evasions Completed:",
        dodgeTipText: "Press JUMP to dodge the enemy's charge with a 3D somersault!",
        closeMissionBoxTip: "Minimize Mission Box",
        btnViewScoreText: "View Score",

        // Celebration & Stage Clear / Fail
        missionSuccessTitle: "MISSION SUCCESS",
        missionFailTitle: "MISSION FAILED",
        stageClearSubtitle: "King of Enemies defeated! A legendary ocean monarch rises!",
        stageFailSubtitle: "Overwhelmed by deep ocean perils... try again!",

        // Result Screen
        resultTitleClear: "STAGE CLEAR",
        resultTitleFail: "GAME OVER",
        finalScoreLabel: "Final Score",
        maxComboLabel: "Max Combo",
        acquiredPreyTitle: "Acquired Prey Status",
        btnRetry: "Retry",
        btnNextStage: "Next Stage ▶",
        btnResultHome: "Main Menu",

        // Stages & Bridges
        stage_1_name: "Stage 1: Pacific Predator",
        stage_2_name: "Stage 2: Antarctic Drift",
        stage_3_name: "Stage 3: Coral Labyrinth",
        stage_4_name: "Stage 4: Abyssal Atlantic",
        stage_5_name: "Stage 5: Mariana Trench",
        stage_1_bridge: "Evaded the fierce charge of the Great White Shark with a dramatic 3D somersault! Now venturing into the frozen Antarctic waters!",
        stage_2_bridge: "Successfully dodged the supersonic needle thrusts of the Blue Marlin! Entering the dazzling neon coral reef labyrinth!",
        stage_3_bridge: "Broke through the colossal grasping tentacles of the Giant Squid! Diving deep into the pitch-black abyssal trenches of the Atlantic!",
        stage_4_bridge: "Dodged the prehistoric crushing jaws of Megalodon in absolute darkness! Descending into the ultimate proving grounds: the Mariana Trench!",
        stage_5_bridge: "Achieved legendary evasion mastery against the supreme monarch of all ocean apex predators! You are now the undisputed sovereign of the sea!",

        // Language toggle
        langSelect: "Language"
    },

    ja: {
        // App & General
        appTitle: "シャチ (Killer Whale) - 横スクロール海洋アーケード",
        gameTitle: "KILLER WHALE",
        gameSubtitle: "ミニゲーム・シャチ — 横スクロール海洋アーケード",
        touchToStart: "画面をタップしてスタート",
        audioGestureHint: "初回タップでシンセサイザーオーディオが有効になります",
        loading: "読み込み中...",
        back: "戻る",
        close: "閉じる",
        confirm: "確認",
        cancel: "キャンセル",
        save: "保存",
        introSoundBtn: "🔊 サウンドON",
        introSoundMute: "🔇 サウンドOFF",
        introSkipBtn: "SKIP ⏭",

        // Auth & Login
        loginTitle: "ログイン",
        loginSubtitle: "海の覇者を目指す航海を始めましょう",
        tabGuest: "ゲスト",
        tabGoogle: "Google",
        tabEmail: "メール",
        tabPhone: "電話番号",
        guestNotice: "ゲストモードは現在のブラウザセッション中のみニックネームが保持され、終了時にリセットされます。",
        btnGuestPlay: "ゲストで今すぐプレイ",
        btnGoogleLogin: "Googleアカウントでログイン",
        emailLabel: "メールアドレス",
        emailPlaceholder: "name@example.com",
        passwordLabel: "パスワード (英数字6〜20文字)",
        passwordPlaceholder: "パスワードを入力",
        passwordConfirmLabel: "パスワード確認",
        passwordConfirmPlaceholder: "パスワードを再入力",
        phoneLabel: "電話番号",
        phonePlaceholder: "090-1234-5678",
        showPassword: "表示",
        hidePassword: "非表示",
        btnLogin: "ログイン",
        btnRegister: "新規登録",
        toggleToRegister: "アカウントをお持ちでないですか？ 新規登録",
        toggleToLogin: "すでにアカウントをお持ちですか？ ログイン",

        // Auth Validation & Errors
        errEmptyEmail: "メールアドレスを入力してください",
        errEmptyPhone: "電話番号を入力してください",
        errPasswordFormat: "英文字または数字で入力してください",
        errPasswordMismatch: "パスワードが一致しません",
        errLoginFailedEmail: "メールアドレスまたはパスワードをもう一度ご確認ください",
        errLoginFailedPhone: "電話番号またはパスワードをもう一度ご確認ください",
        errNicknameLength: "ニックネームは2〜12文字で入力してください",

        // Nickname Setup
        nicknameTitle: "ニックネーム設定",
        nicknameSubtitle: "ようこそ！大海原を泳ぐ前のニックネームを決めてください。",
        nicknamePlaceholder: "2〜12文字",
        btnNicknameSubmit: "決定してスタート (Enter)",
        nicknameHint: "2〜12文字を入力し、Enterキーを押して決定します。",

        // User Navigation & Header
        btnLogout: "ログアウト",
        btnMyPage: "マイページ",
        userGuestBadge: "ゲスト",
        sessionTimeoutWarning: "30分間操作がなかったため、自動ログアウトされました。",

        // My Page
        myPageTitle: "マイページ",
        myPageNicknameLabel: "現在のニックネーム",
        btnEditNickname: "ニックネーム変更",
        myPageAccountType: "アカウント種別",
        myPagePasswordLabel: "パスワード",
        myPageMaskedPassword: "••••••••",
        btnChangePassword: "パスワード変更",
        btnDeleteAccount: "退会",
        btnDeleteAccountConfirm: "退会確認",
        deleteAccountNotice: "アカウントと個人情報が削除されます。ランキング記録は名前を伏せた状態で残る場合があります。",
        deleteAccountSuccess: "退会が完了しました。",

        // Change Password Modal
        changePasswordTitle: "パスワード変更",
        newPasswordLabel: "新しいパスワード (6〜20文字)",
        newPasswordPlaceholder: "新しいパスワードを入力",
        btnSavePassword: "パスワードを保存",

        // Title Screen Actions
        btnStartGame: "START GAME",
        btnCharacterSelect: "主人公選択 (5種)",
        btnSettings: "環境設定 ⚙️",
        btnReplayIntro: "🎬 イントロ再再生",
        controlTips: "操作: 左親指 JUMP (ブースト) / 右親指 4方向 D-Pad | PC: Space / WASD",

        // Character Select
        charSelectTitle: "主人公キャラクター選択",
        speed: "移動速度",
        boost: "ブースト",
        hitbox: "当たり判定",
        magnet: "吸引力",
        preyCollectionTitle: "専用獲物 10種コレクション",
        btnDeployCharacter: "このキャラクターで出撃！",

        // Characters
        char_killer_whale_name: "シャチ (Killer Whale)",
        char_killer_whale_trait: "オールラウンダー / バランス型",
        char_killer_whale_skill: "超音波探知: 危険要素の接近を事前警告",

        char_shark_name: "サメ (Shark)",
        char_shark_trait: "急襲 / スピード特化型",
        char_shark_skill: "血の捕食: 連続捕食で移動速度累積＆コンボ倍率上昇",

        char_blue_marlin_name: "クロカジキ (Blue Marlin)",
        char_blue_marlin_trait: "超高速直進 / 突進型",
        char_blue_marlin_skill: "スピア突進: ジャンプ加速中に障害物を貫通破壊",

        char_giant_squid_name: "ダイオウイカ (Giant Squid)",
        char_giant_squid_trait: "テクニカル / 防御特化型",
        char_giant_squid_skill: "煙幕墨汁: 被弾時に墨を放出して危険を自動回避",

        char_megalodon_name: "メガロドン (Megalodon)",
        char_megalodon_trait: "破壊神 / 超重厚ボディ型",
        char_megalodon_skill: "古代巨獣の威容: 強靭な装甲で障害物を1回無効化",

        // Settings Modal
        settingsTitle: "ゲーム環境設定",
        settingsLivesGroup: "基本残機 (Lives) 設定:",
        settingsSoundGroup: "サウンド設定:",
        settingsControllerGroup: "仮想コントローラー設定:",
        livesUnit: "機",
        soundBgm: "BGM",
        soundSfx: "効果音",
        ctrlOpacity: "透明度",
        ctrlScale: "サイズ",
        btnResume: "再開 (Resume)",
        btnHome: "タイトルへ (Home)",

        // In-game HUD
        pause: "一時停止",
        scoreLabel: "SCORE",
        comboLabel: "COMBO",
        skillLabel: "スキル",
        jumpLabel: "JUMP",
        warningApproach: "⚠️ 危険接近！",
        missionBtnTitle: "回避ミッションを開く",

        // King Mission HUD
        kingMissionTitle: "KING OF ENEMIES",
        dodgeSuccessCountLabel: "回避ミッション成功:",
        dodgeTipText: "JUMPを押して敵の猛突進を3D宙返りで回避してください！",
        closeMissionBoxTip: "ミッション枠を畳む",
        btnViewScoreText: "スコアを見る",

        // Celebration & Stage Clear / Fail
        missionSuccessTitle: "ミッション成功",
        missionFailTitle: "ミッション失敗",
        stageClearSubtitle: "King of Enemies を撃破！伝説の海洋覇王が誕生しました！",
        stageFailSubtitle: "深海の脅威に力尽きました... 再び挑戦してください！",

        // Result Screen
        resultTitleClear: "STAGE CLEAR",
        resultTitleFail: "GAME OVER",
        finalScoreLabel: "最終獲得スコア",
        maxComboLabel: "最大コンボ",
        acquiredPreyTitle: "獲得した専用獲物一覧",
        btnRetry: "再挑戦 (Retry)",
        btnNextStage: "次のステージ ▶",
        btnResultHome: "メイン画面へ",

        // Stages & Bridges
        stage_1_name: "Stage 1: 太平洋の覇者",
        stage_2_name: "Stage 2: 南極の流氷海峡",
        stage_3_name: "Stage 3: 熱帯サンゴ礁の迷宮",
        stage_4_name: "Stage 4: 大西洋深海の暗黒",
        stage_5_name: "Stage 5: マリアナ海溝の深淵",
        stage_1_bridge: "太平洋の覇権を狙うホオジロザメの猛襲を劇的な3D宙返りで回避！極寒の氷河海域へ進出します！",
        stage_2_bridge: "超音速で突き刺さるクロカジキの突進を華麗に連続回避！ネオン輝くサンゴ礁迷路へ向かいます！",
        stage_3_bridge: "深淵から伸びるダイオウイカの巨大触手を突破！光の届かない漆黒の大西洋深海へ突入します！",
        stage_4_bridge: "暗黒から襲いかかるメガロドンの鋼鉄の顎を完璧に回避！最終決戦地マリアナ海溝へ降下します！",
        stage_5_bridge: "深海の頂点捕食者を相手に伝説的な完全回避を達成！あなたは今、全大海原の絶対君主です！",

        // Language toggle
        langSelect: "言語選択"
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem("kw_lang") || "ko";
        if (!I18N_DATA[this.currentLang]) {
            this.currentLang = "ko";
        }
    }

    getLang() {
        return this.currentLang;
    }

    setLang(lang) {
        if (!I18N_DATA[lang]) return;
        this.currentLang = lang;
        localStorage.setItem("kw_lang", lang);
        this.applyTranslations();

        // Dispatch language change event for external listeners
        window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    }

    t(key, fallback = "") {
        const dict = I18N_DATA[this.currentLang] || I18N_DATA.ko;
        return dict[key] !== undefined ? dict[key] : (I18N_DATA.ko[key] || fallback || key);
    }

    applyTranslations() {
        document.documentElement.lang = this.currentLang;

        // Update text nodes with data-i18n
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.innerText = translation;
                }
            }
        });

        // Update placeholders with data-i18n-placeholder
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.placeholder = translation;
                }
            }
        });

        // Update titles / tooltips with data-i18n-title
        document.querySelectorAll("[data-i18n-title]").forEach(el => {
            const key = el.getAttribute("data-i18n-title");
            if (key) {
                const translation = this.t(key);
                if (translation) {
                    el.title = translation;
                }
            }
        });

        // Update localized phone placeholders
        const phoneInput = document.getElementById("login-phone");
        const phoneCodeInput = document.getElementById("login-phone-code");
        if (phoneInput && phoneCodeInput) {
            if (this.currentLang === "ja") {
                phoneCodeInput.value = "+81";
                phoneInput.placeholder = "090-1234-5678";
            } else if (this.currentLang === "en") {
                phoneCodeInput.value = "+1";
                phoneInput.placeholder = "(555) 123-4567";
            } else {
                phoneCodeInput.value = "+82";
                phoneInput.placeholder = "10-1234-5678";
            }
        }

        // Update active class on language toggle buttons
        document.querySelectorAll(".lang-btn").forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }
}

// Global instance
window.i18n = new I18nManager();
