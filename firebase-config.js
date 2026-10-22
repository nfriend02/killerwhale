/**
 * [Killer Whale] Firebase Configuration & Initialization
 * Ready for GitHub repository and Firebase deployment.
 * Supports graceful fallback to local simulation when credentials are not yet injected.
 */

const firebaseConfig = {
    apiKey: "AIzaSyCnbdPGdRDvDeKHnWePPkWeaEfwM87uFJI",
    authDomain: "killerwhale-nfriend.firebaseapp.com",
    projectId: "killerwhale-nfriend",
    storageBucket: "killerwhale-nfriend.firebasestorage.app",
    messagingSenderId: "4277250750",
    appId: "1:4277250750:web:a066a9825b54236f4a4cef",
    measurementId: "G-0NL19WR4WR"
};

// Check if Firebase SDK is loaded from CDN/module
if (typeof firebase !== "undefined" && firebase.initializeApp) {
    try {
        const app = firebase.initializeApp(firebaseConfig);
        window.firebaseApp = app;

        if (firebase.auth) {
            window.firebaseAuth = firebase.auth();
            window.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        }
        if (firebase.firestore) {
            window.firebaseFirestore = firebase.firestore();
        }
        if (firebase.analytics) {
            window.firebaseAnalytics = firebase.analytics();
        }
        console.log("[Firebase] Initialized successfully for killerwhale-nfriend");
    } catch (e) {
        console.warn("[Firebase] Initialization error:", e.message);
    }
} else {
    console.log("[Firebase] Operating in Local Development / Offline Mock mode");
}
