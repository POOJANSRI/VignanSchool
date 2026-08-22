// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgE0lSOI6V84eVkEexQBpdS8de6azjCCk",
  authDomain: "vignan-voice-ai.firebaseapp.com",
  projectId: "vignan-voice-ai",
  storageBucket: "vignan-voice-ai.firebasestorage.app",
  messagingSenderId: "181579015555",
  appId: "1:181579015555:web:62466d01072d2a44a902b6",
  measurementId: "G-NRQ1BG0QY9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, auth };
export default app;
