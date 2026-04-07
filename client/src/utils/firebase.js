
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-fa300.firebaseapp.com",
  projectId: "interviewiq-fa300",
  storageBucket: "interviewiq-fa300.firebasestorage.app",
  messagingSenderId: "196272934011",
  appId: "1:196272934011:web:dcf9d8461f770e0140a6de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export{auth,provider}