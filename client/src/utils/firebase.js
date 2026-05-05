import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  // apiKey:"AIzaSyBvJszWteEbH43lEkEiGcBEI1epnarIdUY",
  authDomain: "levio-5503a.firebaseapp.com",
  projectId: "levio-5503a",
  storageBucket: "levio-5503a.firebasestorage.app",
  messagingSenderId: "765318991369",
  appId: "1:765318991369:web:ada433644fbb4c42d3b2d8",
  measurementId: "G-6KPDJTL4FF"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth}