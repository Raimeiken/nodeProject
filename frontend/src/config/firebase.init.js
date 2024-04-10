// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLWeoyNcP1fFIymc5hVIpaH1hOD9IlbNQ",
  authDomain: "coffee-shop-1ccfd.firebaseapp.com",
  projectId: "coffee-shop-1ccfd",
  storageBucket: "coffee-shop-1ccfd.appspot.com",
  messagingSenderId: "29058166081",
  appId: "1:29058166081:web:4d3b33173b5c06ec5045c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);