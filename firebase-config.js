/**
 * [Killer Whale] Firebase Configuration & Initialization
 * Ready for GitHub repository and Firebase deployment.
 * Supports graceful fallback to local simulation when credentials are not yet injected.
 */

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
    authDomain: "killer-whale-game.firebaseapp.com",
    projectId: "killer-whale-game",
    storageBucket: "killer-whale-game.appspot.com",
    messagingSenderId: "SENDER_ID_PLACEHOLDER",
    appId: "APP_ID_PLACEHOLDER"
};

// Check if Firebase SDK is loaded from CDN/module
if (typeof firebase !== "undefined" && firebase.initializeApp) {
    try {
        firebase.initializeApp(firebaseConfig);
        window.firebaseAuth = firebase.auth();
        window.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        console.log("[Firebase] Initialized successfully");
    } catch (e) {
        console.warn("[Firebase] Initialization skipped or placeholder active:", e.message);
    }
} else {
    console.log("[Firebase] Operating in Local Development / Offline Mock mode");
}
