import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyCtLQ7vn0jBnnxyl7MsSZMWCJH91I4MMOE",
  authDomain: "socialapp-f5c53.firebaseapp.com",
  projectId: "socialapp-f5c53",
  storageBucket: "socialapp-f5c53.appspot.com",
  messagingSenderId: "847810504498",
  appId: "1:847810504498:web:2a0d7b4434b85862a9992b",
  measurementId: "G-637GQ8ZCE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
