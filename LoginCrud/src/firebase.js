// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "accountmngmt-92daa.firebaseapp.com",
    projectId: "accountmngmt-92daa",
    storageBucket: "accountmngmt-92daa.firebasestorage.app",
    messagingSenderId: "316102141677",
    appId: "1:316102141677:web:3448a4f2d9c299b9a94ee4",
    measurementId: "G-F2BD2QTEQ1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);