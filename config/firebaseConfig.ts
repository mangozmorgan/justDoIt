import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth, Auth } from "firebase/auth";


import { getDatabase } from "firebase/database";

import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET,MESSENGER_SENDER_ID, APP_ID, MEASURE_ID, DB_URL  } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSENGER_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASURE_ID,
  databaseURL: DB_URL,
};


// Initialisez Firebase App
const appFirebase = initializeApp(firebaseConfig);


let auth: Auth;

  auth = initializeAuth(appFirebase, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  // auth = getAuth(appFirebase);//

const firestore = getFirestore(appFirebase);
const database = getDatabase(appFirebase);



export { appFirebase, auth, firestore, database };
