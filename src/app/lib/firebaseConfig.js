import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlUvWX4Z5GqyV3kvENI_DE0eIDuMIgJpI",
  authDomain: "mynotesnextjs.firebaseapp.com",
  projectId: "mynotesnextjs",
  storageBucket: "mynotesnextjs.appspot.com",
  messagingSenderId: "1037832102757",
  appId: "1:1037832102757:web:d5d8911e6582714d18f78c",
  measurementId: "G-560DTN7E0S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database and Auth
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
