import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Use Firebase Emulator
// import {connectFirestoreEmulator} from "firebase/firestore";
// import { connectAuthEmulator, getAuth } from "firebase/auth";
// import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuBG6dpCBRBfgAObKGTkQUIVnTCZBo570",
  authDomain: "house-marketplace-app-13e5f.firebaseapp.com",
  projectId: "house-marketplace-app-13e5f",
  storageBucket: "house-marketplace-app-13e5f.appspot.com",
  messagingSenderId: "24959828908",
  appId: "1:24959828908:web:ef50bb340682ce16153009",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

// Use Firebase Emulator
// export const auth = getAuth();
// const storage = getStorage();

// if (process.env.NODE_ENV !== "production") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectStorageEmulator(storage, "localhost", 9199);
// }
