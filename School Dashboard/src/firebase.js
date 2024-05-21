// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGRf7i0dpm7mQuRE9y88mtQGPtpQjwFcA",
  authDomain: "jefferson-afb8c.firebaseapp.com",
  projectId: "jefferson-afb8c",
  storageBucket: "jefferson-afb8c.appspot.com",
  messagingSenderId: "240534093825",
  appId: "1:240534093825:web:5ee06152a32ab423210000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };