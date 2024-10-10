import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD7OpQhepsw_yMfBDG-91a4sLN4sDpgG6c",
  authDomain: "mynotes-6cdd7.firebaseapp.com",
  projectId: "mynotes-6cdd7",
  storageBucket: "mynotes-6cdd7.appspot.com",
  messagingSenderId: "792156920177",
  appId: "1:792156920177:web:d27c3045f6b6438ada7ed0",
  measurementId: "G-6W7CTKV792",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
