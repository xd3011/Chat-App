// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxwzo3zQA5K6dcAlcNubq2NC8FH7EVeN4",
    authDomain: "chat-app-bc795.firebaseapp.com",
    projectId: "chat-app-bc795",
    storageBucket: "chat-app-bc795.appspot.com",
    messagingSenderId: "450996067737",
    appId: "1:450996067737:web:dddeedeb56a60d769c8708"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');