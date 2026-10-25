# Killer Whale (범고래) — Marine Arcade Game

A high-performance HTML5 Canvas side-scrolling marine arcade game featuring dynamic 3D-styled predators, unique prey species, boss battles, lightning evasion mechanics, and a complete user authentication and account lifecycle system.

---

## 🌐 1. Architecture & Internationalization (i18n)

### Strict English Source Code Rule
- All source code files (`game.js`, `auth.js`, `i18n.js`, `firebase-config.js`, `style.css`), function names, variable identifiers, classes, and code comments are strictly written in **English**.
- User-facing UI elements, notifications, placeholders, and error messages are managed dynamically via `window.i18n`.

### Trilingual Support (`ko`, `en`, `ja`)
- Supported languages:
  1. **Korean (`ko`)** — Default
  2. **English (`en`)**
  3. **Japanese (`ja`)**
- Users can switch languages in real-time via the global floating pill in the upper-right corner (`KO | EN | JA`).
- Phone numbers and validation prompts dynamically adapt based on the selected language:
  - **KO**: `+82`, placeholder `10-1234-5678`
  - **JA**: `+81`, placeholder `090-1234-5678`
  - **EN**: `+1`, placeholder `(555) 123-4567`

---

## 🔄 2. User Lifecycle & State Machine

The game strictly follows the required sequential flow:
```
first ➔ intro ➔ login ➔ nickname (new users only) ➔ play ➔ ending ➔ still ➔ result ➔ mypage
```

### Flow Breakdown:
1. **`first` (Gateway Screen & Audio Gesture)**:
   - Initial touch or click (`btn-first-start`) unlocks the browser's Web Audio API context before launching media.
2. **`intro` (6-Second Cinematic Video)**:
   - Plays the opening video (`intro_6s.mp4`) with default sound off (`Muted`), with sound toggle and skip button.
3. **`login` (Authentication Modal)**:
   - 4 selectable methods:
     - **Guest (Anonymous)**: Browser session user; cleared when the game session finishes.
     - **Google**: One-click OAuth login (with local simulation fallback on localhost).
     - **Email + Password**: Requires 6~20 alphanumeric password, show/hide password toggle, and validation error messages without revealing which field failed.
     - **Phone + Password**: Automatically maps the phone number to `{e164}@phone.claypop.invalid` for behind-the-scenes auth (hidden from the user).
4. **`nickname` (Mandatory Setup for First-Time Users)**:
   - 2~12 characters, submitted via the **Enter** key or submit button.
5. **`play` (Main Game Canvas)**:
   - High-speed marine chase, obstacle dodging, and rival boss battles.
6. **`ending` & `still` (Celebration / Failure Sequence)**:
   - 3-second animated sequence:
     - **Success**: The predator moves triumphantly to center screen with shimmering sunburst rays for 3 seconds.
     - **Failure**: The predator sinks melancholically with gloomy shadow particles for 3 seconds.
7. **`result` (Score Summary)**:
   - Displays stage score, star ratings, and max combo.
   - Includes top navigation chip for MyPage and Logout.
8. **`mypage` (User Account Management)**:
   - View and modify nickname.
   - View masked password (`••••••••`) and change password.
   - **Delete Account (Two-step confirmation)**:
     - 1st click: Displays warning banner and changes button label to "탈퇴 확인" (Confirm Delete).
     - 2nd click: Deletes user record, clears session, alerts "탈퇴가 완료되었습니다.", and redirects to the `first` gateway.

### Safety Rules:
- **30-Minute Inactivity Timer**: Automatically logs out idle users, but is strictly paused during `play`, `ending`, and `mission_celebration` to prevent game interruption.
- **Admin Verification**: Requires Firebase custom claim `admin === true`. (Local development fallback: `?admin=byki@daum.net`).

---

## 🚀 3. Local Development (Localhost)

The project runs using any static web server:

```bash
# Start local HTTP server
python -m http.server 8089
```

Open your browser at:
- Regular player: `http://localhost:8089/`
- Admin developer mode: `http://localhost:8089/?admin=byki@daum.net`

---

## 📦 4. GitHub & Firebase Deployment Preparation

The project is pre-configured with:
- [`.gitignore`](file:///c:/Users/HS%20Kim/Desktop/Agames/killerwhale/.gitignore): Standard exclusions for node, python, environment files, and temporary logs.
- [`firebase.json`](file:///c:/Users/HS%20Kim/Desktop/Agames/killerwhale/firebase.json): Configured for Firebase Hosting with proper media streaming headers and rewrite rules.
- [`firestore.rules`](file:///c:/Users/HS%20Kim/Desktop/Agames/killerwhale/firestore.rules): Production-grade security rules with role ownership and custom claim admin privileges.
- [`.firebaserc`](file:///c:/Users/HS%20Kim/Desktop/Agames/killerwhale/.firebaserc): Project alias template.
- [`firebase-config.js`](file:///c:/Users/HS%20Kim/Desktop/Agames/killerwhale/firebase-config.js): Firebase SDK initialization with local mock fallback.

---

## 🌐 5. Production URL & Firebase Authorized Domains

- **Official Live Production URL**: [https://killerwhale-hazel.vercel.app](https://killerwhale-hazel.vercel.app)
- **GitHub Repository**: [https://github.com/nfriend02/killerwhale](https://github.com/nfriend02/killerwhale) (Auto-deploys to Vercel on `main` push)
- **Firebase Authentication Authorized Domain**: `killerwhale-hazel.vercel.app` (Registered in Firebase Console -> Authentication -> Settings -> Authorized domains)

