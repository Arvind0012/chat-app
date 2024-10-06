import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// for realtime database
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBgwcow80AVoiUXrm7GKZRlE2zZWjUB50g",
    authDomain: "real-time-chat-7ea73.firebaseapp.com",
    projectId: "real-time-chat-7ea73",
    storageBucket: "real-time-chat-7ea73.appspot.com",
    messagingSenderId: "690120061384",
    appId: "1:690120061384:web:6e9c255c11470e147cd0fd",
    databaseURL: "https://real-time-chat-7ea73-default-rtdb.firebaseio.com",
};
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage();
export const db = getFirestore();

// for realtime database
export const database = getDatabase()
