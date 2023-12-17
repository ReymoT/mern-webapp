// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1a9c7.firebaseapp.com",
  projectId: "mern-estate-1a9c7",
  storageBucket: "mern-estate-1a9c7.appspot.com",
  messagingSenderId: "981209731289",
  appId: "1:981209731289:web:749b6927d7665a7b9d6ec8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);