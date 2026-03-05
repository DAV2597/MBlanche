// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Votre configuration Firebase (Vérifiée et nettoyée)
const firebaseConfig = {
  apiKey: "AIzaSyDYqdjkzv4RN46QbPEKKepf1T2znQG26-Y",
  authDomain: "mblanche-151d6.firebaseapp.com",
  projectId: "mblanche-151d6",
  storageBucket: "mblanche-151d6.firebasestorage.app",
  messagingSenderId: "180780207014",
  appId: "1:180780207014:web:a30f2dbaed4af77812dd67",
  // measurementId est facultatif et nécessite getAnalytics,
  // nous ne l'activons pas ici pour Firestore.
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Cloud Firestore et exporter la référence
export const db = getFirestore(app);