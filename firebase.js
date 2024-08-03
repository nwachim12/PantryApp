// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN0E6RDkQQpSWv4dAFLvZdbksGnFNk6bo",
  authDomain: "inventorypantry.firebaseapp.com",
  projectId: "inventorypantry",
  storageBucket: "inventorypantry.appspot.com",
  messagingSenderId: "52070758657",
  appId: "1:52070758657:web:9b84593632f70f64fa8300",
  measurementId: "G-EMNCLRFPXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}