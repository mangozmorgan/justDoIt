import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth, Auth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKwReIsdPPqY0sGAXFGNxKApNcMI7aMrY",
  authDomain: "justdoit-a10fc.firebaseapp.com",
  projectId: "justdoit-a10fc",
  storageBucket: "justdoit-a10fc.appspot.com",
  messagingSenderId: "1094068284982",
  appId: "1:1094068284982:web:3550290a8d4411aa947297",
  measurementId: "G-CZ9DG25Z6J",
  databaseURL: "https://justdoit-a10fc-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialisez Firebase App
const appFirebase = initializeApp(firebaseConfig);

// Vérifiez si `initializeAuth` est nécessaire en vérifiant le type d'environnement
let auth: Auth;
if (typeof global !== "undefined" && global?.window === undefined) {
  // Environnement sans fenêtre (React Native), utilisez initializeAuth
  auth = initializeAuth(appFirebase, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Environnement avec fenêtre (Web), utilisez getAuth
  auth = getAuth(appFirebase);
}

const firestore = getFirestore(appFirebase);
const database = getDatabase(appFirebase);

export { appFirebase, auth, firestore, database };
