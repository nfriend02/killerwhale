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

        this.init();
    }

    init() {
        // Pre-configure main administrator account: byki@daum.net with password 123456
        this.seedDefaultAdmin();

        // Load session from storage if exists
        this.restoreSession();

        // Check Admin privilege via custom claim or local query parameter
        this.checkAdminStatus();

        // Initialize 30-minute inactivity tracker
        this.setupInactivityTracker();

        // Pre-fill email login form with default admin credentials for quick access
        this.prefillAdminForm();
    }

    seedDefaultAdmin() {
        const adminEmail = "byki@daum.net";
        const adminPass = "123456";
        const adminData = {
            uid: "admin_byki",
            email: adminEmail,
            passwordHash: btoa(adminPass),
            provider: "email",
            nickname: "Admin",
            isNew: false,
            customClaims: { admin: true },
            createdAt: 1700000000000
        };
        localStorage.setItem(`auth_user_${adminEmail}`, JSON.stringify(adminData));
        localStorage.setItem("admin_auth_id", adminEmail);
    }

    prefillAdminForm() {
        const applyPrefill = () => {
            const emailInput = document.getElementById("login-email");
            const passInput = document.getElementById("login-email-password");
            if (emailInput && !emailInput.value) {
                emailInput.value = "byki@daum.net";
            }
            if (passInput && !passInput.value) {
                passInput.value = "123456";
            }
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", applyPrefill);
        } else {
            applyPrefill();
        }
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

    saveSession(user, persistent = false) {
        this.currentUser = user;
        this.sessionType = user.provider || "guest";
        const sessionData = JSON.stringify(user);
        sessionStorage.setItem("kw_session", sessionData);

        if (persistent && user.provider !== "guest") {
            localStorage.setItem("kw_persistent_session", sessionData);
        } else {
            localStorage.removeItem("kw_persistent_session");
        }

        this.checkAdminStatus();
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

    checkAdminStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const adminEmail = urlParams.get("admin");
        if (adminEmail === "byki@daum.net") {
            this.isAdmin = true;
        }

        // Direct email check for main admin
        if (this.currentUser && (this.currentUser.email === "byki@daum.net" || (this.currentUser.customClaims && this.currentUser.customClaims.admin === true))) {
            this.isAdmin = true;
        }

        // Local admin authorization check
        if (localStorage.getItem("admin_auth_id") === "byki@daum.net") {
            this.isAdmin = true;
        }

        const adminBtn = document.getElementById("btn-admin-pause");
        if (adminBtn) {
            if (this.isAdmin) {
                adminBtn.classList.add("authorized");
                adminBtn.style.display = "inline-flex";
            } else {
                adminBtn.classList.remove("authorized");
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

    // 3. Email + Password (Login / Register)
    loginWithEmail(email, password, isRegister = false, confirmPassword = "") {
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

            // Save user profile locally
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
            this.saveSession(userData, true);
            return userData;
        } else {
            // Login check
            const record = localStorage.getItem(`auth_user_${cleanEmail}`);
            if (!record) {
                throw new Error(window.i18n.t("errLoginFailedEmail"));
            }
            const parsed = JSON.parse(record);
            if (parsed.passwordHash !== btoa(cleanPass)) {
                throw new Error(window.i18n.t("errLoginFailedEmail"));
            }

            parsed.isNew = !parsed.nickname;
            this.saveSession(parsed, true);
            return parsed;
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
