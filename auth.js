/**
 * [Killer Whale] Authentication & User Lifecycle Manager
 * Handles states: first -> intro -> login -> nickname -> play -> ending -> still -> result -> mypage
 * All source code strictly in English.
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionType = null; // 'guest' | 'google' | 'email' | 'phone'
        this.inactivityTimeoutMs = 30 * 60 * 1000; // 30 minutes
        this.inactivityTimer = null;
        this.deleteAccountConfirmStage = false;
        this.isAdmin = false;

        // Clean up legacy local mock admin seeds if present
        try {
            localStorage.removeItem("auth_user_byki@daum.net");
            if (localStorage.getItem("admin_auth_id") === "byki@daum.net") {
                localStorage.removeItem("admin_auth_id");
            }
        } catch (e) {}

        this.init();
    }

    init() {
        // Load session from storage if exists
        this.restoreSession();

        // Check Admin privilege via Firestore admins collection or custom claims
        this.checkAdminStatus();

        // Initialize 30-minute inactivity tracker
        this.setupInactivityTracker();
    }

    restoreSession() {
        try {
            const savedSession = sessionStorage.getItem("kw_session") || localStorage.getItem("kw_persistent_session");
            if (savedSession) {
                const parsed = JSON.parse(savedSession);
                if (parsed && parsed.uid) {
                    this.currentUser = parsed;
                    this.sessionType = parsed.provider || "guest";
                }
            }
        } catch (e) {
            console.warn("Failed to restore session:", e);
        }
    }

    async saveSession(user, persistent = false) {
        this.currentUser = user;
        this.sessionType = user.provider || "guest";
        const sessionData = JSON.stringify(user);
        sessionStorage.setItem("kw_session", sessionData);

        if (persistent && user.provider !== "guest") {
            localStorage.setItem("kw_persistent_session", sessionData);
        } else {
            localStorage.removeItem("kw_persistent_session");
        }

        await this.checkAdminStatus();
        this.updateHeaderUI();
    }

    clearSession() {
        this.currentUser = null;
        this.sessionType = null;
        this.isAdmin = false;
        sessionStorage.removeItem("kw_session");
        localStorage.removeItem("kw_persistent_session");
        this.deleteAccountConfirmStage = false;
        this.checkAdminStatus();
        this.updateHeaderUI();
    }

    async checkAdminStatus() {
        let isAuthorized = false;

        if (this.currentUser && this.currentUser.provider !== "guest") {
            // 1. Firebase Auth Custom Claim Check
            if (this.currentUser.customClaims && this.currentUser.customClaims.admin === true) {
                isAuthorized = true;
            }

            // 2. Query Firestore 'admins' Collection securely
            if (!isAuthorized && window.firebaseFirestore && (this.currentUser.email || this.currentUser.uid)) {
                try {
                    const checks = [];
                    if (this.currentUser.email) {
                        checks.push(window.firebaseFirestore.collection("admins").doc(this.currentUser.email).get());
                    }
                    if (this.currentUser.uid) {
                        checks.push(window.firebaseFirestore.collection("admins").doc(this.currentUser.uid).get());
                    }
                    const snapshots = await Promise.all(checks);
                    if (snapshots.some(snap => snap && snap.exists)) {
                        isAuthorized = true;
                        console.log("[Auth] Administrator privileges verified via Firestore database");
                    }
                } catch (err) {
                    console.warn("[Auth] Admin database verification error:", err.message);
                }
            }
        }

        this.isAdmin = isAuthorized;

        // Sync with Game Engine if available
        if (window.gameInstance) {
            window.gameInstance.isAdminAuthorized = isAuthorized;
        }

        const adminBtn = document.getElementById("btn-admin-pause");
        if (adminBtn) {
            if (this.isAdmin) {
                adminBtn.classList.add("authorized");
                adminBtn.classList.remove("hidden");
                adminBtn.style.display = "inline-flex";
            } else {
                adminBtn.classList.remove("authorized");
                adminBtn.classList.add("hidden");
                adminBtn.style.display = "none";
            }
        }
    }

    setupInactivityTracker() {
        const resetTimer = () => {
            if (this.inactivityTimer) {
                clearTimeout(this.inactivityTimer);
            }

            // Inactivity logout must NOT interrupt 'play' or 'ending' states!
            if (window.gameInstance && (window.gameInstance.state === "playing" || window.gameInstance.state === "ending" || window.gameInstance.state === "mission_celebration")) {
                return;
            }

            if (this.currentUser) {
                this.inactivityTimer = setTimeout(() => {
                    this.handleInactivityLogout();
                }, this.inactivityTimeoutMs);
            }
        };

        const events = ["mousedown", "mousemove", "keydown", "touchstart", "scroll", "pointerdown"];
        events.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
        resetTimer();
    }

    handleInactivityLogout() {
        if (!this.currentUser) return;
        if (window.gameInstance && (window.gameInstance.state === "playing" || window.gameInstance.state === "ending" || window.gameInstance.state === "mission_celebration")) {
            return;
        }

        alert(window.i18n.t("sessionTimeoutWarning"));
        this.logout();
    }

    // --- Authentication Actions ---

    // 1. Guest Login (Anonymous Session)
    loginAsGuest() {
        const guestUid = "guest_" + Math.random().toString(36).substring(2, 10);
        const guestUser = {
            uid: guestUid,
            provider: "guest",
            nickname: "",
            isNew: true,
            createdAt: Date.now()
        };

        this.saveSession(guestUser, false);
        return guestUser;
    }

    // 2. Google Login (with Local Simulation fallback)
    async loginWithGoogle() {
        if (window.firebaseAuth && typeof window.firebaseAuth.signInWithPopup === "function") {
            try {
                const result = await window.firebaseAuth.signInWithPopup(window.googleAuthProvider);
                const user = result.user;
                const appUser = {
                    uid: user.uid,
                    email: user.email,
                    provider: "google",
                    nickname: user.displayName ? user.displayName.substring(0, 12) : "",
                    isNew: !localStorage.getItem(`profile_${user.uid}`)
                };
                this.saveSession(appUser, true);
                return appUser;
            } catch (err) {
                console.error("Firebase Google Auth Error:", err);
                throw err;
            }
        } else {
            // Local fallback simulation for localhost
            const googleUid = "goog_" + Math.random().toString(36).substring(2, 10);
            const appUser = {
                uid: googleUid,
                email: "google_user@gmail.com",
                provider: "google",
                nickname: "",
                isNew: true
            };
            this.saveSession(appUser, true);
            return appUser;
        }
    }

    // 3. Email + Password (Login / Register with Firebase Auth & Fallback)
    async loginWithEmail(email, password, isRegister = false, confirmPassword = "") {
        const cleanEmail = (email || "").trim();
        const cleanPass = (password || "").trim();

        if (!cleanEmail) {
            throw new Error(window.i18n.t("errEmptyEmail"));
        }

        // Password format: 6-20 alphanumeric characters
        const passRegex = /^[a-zA-Z0-9]{6,20}$/;
        if (!passRegex.test(cleanPass)) {
            throw new Error(window.i18n.t("errPasswordFormat"));
        }

        if (isRegister) {
            if (cleanPass !== (confirmPassword || "").trim()) {
                throw new Error(window.i18n.t("errPasswordMismatch"));
            }

            if (window.firebaseAuth && typeof window.firebaseAuth.createUserWithEmailAndPassword === "function") {
                try {
                    const cred = await window.firebaseAuth.createUserWithEmailAndPassword(cleanEmail, cleanPass);
                    const appUser = {
                        uid: cred.user.uid,
                        email: cred.user.email,
                        provider: "email",
                        nickname: "",
                        isNew: true,
                        createdAt: Date.now()
                    };
                    await this.saveSession(appUser, true);
                    return appUser;
                } catch (fbErr) {
                    console.warn("[Firebase] Email registration error:", fbErr.code, fbErr.message);
                    if (fbErr.code === "auth/email-already-in-use") {
                        throw new Error("이미 사용 중인 이메일 주소입니다.");
                    }
                    throw new Error(fbErr.message || window.i18n.t("errLoginFailedEmail"));
                }
            } else {
                // Local fallback simulation
                const uid = "usr_" + btoa(cleanEmail).replace(/=/g, "").toLowerCase();
                const existing = localStorage.getItem(`auth_user_${cleanEmail}`);
                if (existing) {
                    throw new Error(window.i18n.t("errLoginFailedEmail"));
                }

                const userData = {
                    uid,
                    email: cleanEmail,
                    passwordHash: btoa(cleanPass),
                    provider: "email",
                    nickname: "",
                    isNew: true,
                    createdAt: Date.now()
                };

                localStorage.setItem(`auth_user_${cleanEmail}`, JSON.stringify(userData));
                await this.saveSession(userData, true);
                return userData;
            }
        } else {
            // Login check via Firebase Auth
            if (window.firebaseAuth && typeof window.firebaseAuth.signInWithEmailAndPassword === "function") {
                try {
                    const cred = await window.firebaseAuth.signInWithEmailAndPassword(cleanEmail, cleanPass);
                    const savedProfile = localStorage.getItem(`profile_${cred.user.uid}`);
                    let nickname = "";
                    if (savedProfile) {
                        try { nickname = JSON.parse(savedProfile).nickname || ""; } catch(e){}
                    }
                    const appUser = {
                        uid: cred.user.uid,
                        email: cred.user.email,
                        provider: "email",
                        nickname: nickname,
                        isNew: !nickname
                    };
                    await this.saveSession(appUser, true);
                    return appUser;
                } catch (fbErr) {
                    console.warn("[Firebase] Email login error:", fbErr.code, fbErr.message);
                    // Check local mock user if exists
                    const record = localStorage.getItem(`auth_user_${cleanEmail}`);
                    if (record) {
                        const parsed = JSON.parse(record);
                        if (parsed.passwordHash === btoa(cleanPass)) {
                            parsed.isNew = !parsed.nickname;
                            await this.saveSession(parsed, true);
                            return parsed;
                        }
                    }
                    if (fbErr.code === "auth/user-not-found" || fbErr.code === "auth/wrong-password" || fbErr.code === "auth/invalid-credential") {
                        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
                    }
                    throw new Error(fbErr.message || window.i18n.t("errLoginFailedEmail"));
                }
            } else {
                const record = localStorage.getItem(`auth_user_${cleanEmail}`);
                if (!record) {
                    throw new Error(window.i18n.t("errLoginFailedEmail"));
                }
                const parsed = JSON.parse(record);
                if (parsed.passwordHash !== btoa(cleanPass)) {
                    throw new Error(window.i18n.t("errLoginFailedEmail"));
                }

                parsed.isNew = !parsed.nickname;
                await this.saveSession(parsed, true);
                return parsed;
            }
        }
    }

    // 4. Phone + Password Login
    loginWithPhone(countryCode, phoneNumber, password, isRegister = false, confirmPassword = "") {
        const rawPhone = (phoneNumber || "").replace(/[^0-9]/g, "");
        if (!rawPhone) {
            throw new Error(window.i18n.t("errEmptyPhone"));
        }

        const cleanPass = (password || "").trim();
        const passRegex = /^[a-zA-Z0-9]{6,20}$/;
        if (!passRegex.test(cleanPass)) {
            throw new Error(window.i18n.t("errPasswordFormat"));
        }

        // Convert to E.164 and hidden auth email format: {e164}@phone.claypop.invalid
        const normalizedCountry = countryCode.startsWith("+") ? countryCode : "+" + countryCode;
        const e164 = `${normalizedCountry}${rawPhone}`;
        const hiddenEmail = `${e164.replace("+", "")}@phone.claypop.invalid`;

        if (isRegister) {
            if (cleanPass !== (confirmPassword || "").trim()) {
                throw new Error(window.i18n.t("errPasswordMismatch"));
            }

            const uid = "phn_" + rawPhone;
            const userData = {
                uid,
                phone: e164,
                hiddenEmail,
                passwordHash: btoa(cleanPass),
                provider: "phone",
                nickname: "",
                isNew: true,
                createdAt: Date.now()
            };

            localStorage.setItem(`auth_phone_${e164}`, JSON.stringify(userData));
            this.saveSession(userData, true);
            return userData;
        } else {
            const record = localStorage.getItem(`auth_phone_${e164}`);
            if (!record) {
                throw new Error(window.i18n.t("errLoginFailedPhone"));
            }
            const parsed = JSON.parse(record);
            if (parsed.passwordHash !== btoa(cleanPass)) {
                throw new Error(window.i18n.t("errLoginFailedPhone"));
            }

            parsed.isNew = !parsed.nickname;
            this.saveSession(parsed, true);
            return parsed;
        }
    }

    // Set or Update Nickname (2~12 characters)
    setNickname(nickname) {
        const clean = (nickname || "").trim();
        if (clean.length < 2 || clean.length > 12) {
            throw new Error(window.i18n.t("errNicknameLength"));
        }

        if (this.currentUser) {
            this.currentUser.nickname = clean;
            this.currentUser.isNew = false;
            this.saveSession(this.currentUser, this.currentUser.provider !== "guest");

            // Persist into user profile storage
            if (this.currentUser.email) {
                localStorage.setItem(`auth_user_${this.currentUser.email}`, JSON.stringify(this.currentUser));
            } else if (this.currentUser.phone) {
                localStorage.setItem(`auth_phone_${this.currentUser.phone}`, JSON.stringify(this.currentUser));
            }
        }
        this.updateHeaderUI();
        return clean;
    }

    // Change Password in MyPage
    changePassword(newPassword) {
        const cleanPass = (newPassword || "").trim();
        const passRegex = /^[a-zA-Z0-9]{6,20}$/;
        if (!passRegex.test(cleanPass)) {
            throw new Error(window.i18n.t("errPasswordFormat"));
        }

        if (this.currentUser) {
            this.currentUser.passwordHash = btoa(cleanPass);
            if (this.currentUser.email) {
                localStorage.setItem(`auth_user_${this.currentUser.email}`, JSON.stringify(this.currentUser));
            } else if (this.currentUser.phone) {
                localStorage.setItem(`auth_phone_${this.currentUser.phone}`, JSON.stringify(this.currentUser));
            }
        }
    }

    // Delete Account (Two-step confirmation)
    deleteAccount() {
        if (!this.deleteAccountConfirmStage) {
            this.deleteAccountConfirmStage = true;
            return { confirmed: false, message: window.i18n.t("deleteAccountNotice") };
        }

        // Execute deletion
        if (this.currentUser) {
            if (this.currentUser.email) {
                localStorage.removeItem(`auth_user_${this.currentUser.email}`);
            }
            if (this.currentUser.phone) {
                localStorage.removeItem(`auth_phone_${this.currentUser.phone}`);
            }
        }

        this.clearSession();
        return { confirmed: true, message: window.i18n.t("deleteAccountSuccess") };
    }

    logout() {
        this.clearSession();
        if (window.gameInstance) {
            window.gameInstance.showScreen("screen-first");
        }
    }

    updateHeaderUI() {
        const headerAuthBox = document.getElementById("header-auth-box");
        const nicknameDisplay = document.getElementById("header-user-nickname");
        const badgeDisplay = document.getElementById("header-user-badge");

        if (headerAuthBox) {
            if (this.currentUser && this.currentUser.nickname) {
                headerAuthBox.classList.remove("hidden");
                headerAuthBox.style.display = "flex";
                if (nicknameDisplay) nicknameDisplay.innerText = this.currentUser.nickname;
                if (badgeDisplay) {
                    badgeDisplay.innerText = this.currentUser.provider === "guest" 
                        ? window.i18n.t("userGuestBadge") 
                        : this.currentUser.provider.toUpperCase();
                }
            } else {
                headerAuthBox.classList.add("hidden");
                headerAuthBox.style.display = "none";
            }
        }
    }
}

window.authManager = new AuthManager();
