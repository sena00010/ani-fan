// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Bu satırı ekle
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgZi03a47jhT1bjDg1BzIF8tbQbrmDgR0",
  authDomain: "animepression.firebaseapp.com",
  databaseURL: "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "animepression",
  storageBucket: "animepression.appspot.com",
  messagingSenderId: "443513559646",
  appId: "1:443513559646:web:5dff31c01f01193e82b2cf",
  measurementId: "G-VN314797Q4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Bu satırı ekle
export const db = getFirestore(app);

export { auth }; // Bu satırı ekle