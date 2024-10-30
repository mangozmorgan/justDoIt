import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKwReIsdPPqY0sGAXFGNxKApNcMI7aMrY",
  authDomain: "justdoit-a10fc.firebaseapp.com",
  projectId: "justdoit-a10fc",
  storageBucket: "justdoit-a10fc.appspot.com",
  messagingSenderId: "1094068284982",
  appId: "1:1094068284982:web:3550290a8d4411aa947297",
  measurementId: "G-CZ9DG25Z6J",
  databaseURL: "https://justdoit-a10fc-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialisez Firebase App
const appFirebase = initializeApp(firebaseConfig);

// Utilisez getAuth() pour vérifier si Firebase Auth est déjà initialisé
const auth = getAuth(appFirebase) || initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(appFirebase); // Firestore
const database = getDatabase(appFirebase);

export { appFirebase, auth, firestore, database };
