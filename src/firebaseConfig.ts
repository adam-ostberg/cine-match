import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig: Record<string, string> = {
  apiKey: "AIzaSyBt7wtaLCagTbDV5LJfejOGZqi_M16J37s",
  authDomain: "cinemamatcher.firebaseapp.com",
  databaseURL: "https://cinemamatcher-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cinemamatcher",
  storageBucket: "cinemamatcher.firebasestorage.app",
  messagingSenderId: "425565430168",
  appId: "1:425565430168:web:7acc214179792c56f00bed",
  measurementId: "G-1M4N0H90T2"
};

// uncomment the following lines when you have your firebaseConfig. Understand what the lines are doing!
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

window.db = db;

// make doc and setDoc available at the Console for testing
window.doc = doc;
window.setDoc = setDoc;