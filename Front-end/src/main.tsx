import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {initializeFirestore} from 'firebase/firestore';

const key = import.meta.env.DB_PASSWORD!
console.log(key)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: key,
  authDomain: "social-app-3310b.firebaseapp.com",
  projectId: "social-app-3310b",
  storageBucket: "social-app-3310b.appspot.com",
  messagingSenderId: "456570024657",
  appId: "1:456570024657:web:fa2f4d4c30a26475a38bf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export {auth, db};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
