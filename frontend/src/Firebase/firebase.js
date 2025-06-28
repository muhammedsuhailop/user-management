// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "user-management-dd4bc.firebaseapp.com",
  projectId: "user-management-dd4bc",
  storageBucket: "user-management-dd4bc.firebasestorage.app",
  messagingSenderId: "679217779430",
  appId: "1:679217779430:web:dda2c2f68159cda3cda127"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);