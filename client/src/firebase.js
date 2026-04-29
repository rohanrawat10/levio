// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvJszWteEbH43lEkEiGcBEI1epnarIdUY",
  authDomain: "levio-5503a.firebaseapp.com",
  projectId: "levio-5503a",
  storageBucket: "levio-5503a.firebasestorage.app",
  messagingSenderId: "765318991369",
  appId: "1:765318991369:web:ada433644fbb4c42d3b2d8",
  measurementId: "G-6KPDJTL4FF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth}