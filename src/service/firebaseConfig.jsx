// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQHjvbJUo9QR1mHaxNXHGgJVj1coYNRPY",
  authDomain: "travel-project-7c2cb.firebaseapp.com",
  projectId: "travel-project-7c2cb",
  storageBucket: "travel-project-7c2cb.appspot.com",
  messagingSenderId: "277215424568",
  appId: "1:277215424568:web:dc3a12cf0af0e26a8b76cd",
  measurementId: "G-J6T8QQD1F1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
