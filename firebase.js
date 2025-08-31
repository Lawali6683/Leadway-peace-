import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"; // Import getAuth
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js"; 
  
const firebaseConfig = {
    apiKey: "AIzaSyD7XRnKJgCIWuuIKs-b6HGuO22vVWATTJA",
    authDomain: "leadway-d4940.firebaseapp.com",
    databaseURL: "https://leadway-d4940-default-rtdb.firebaseio.com",
    projectId: "leadway-d4940",
    storageBucket: "leadway-d4940.firebasestorage.app",
    messagingSenderId: "983730300399",
    appId: "1:983730300399:web:6846c3062c577c78f1421a",
    measurementId: "G-FTWYHLL4SY"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Auth
const db = getDatabase(app); // Initialize Database

// Export so other files can use them
export { app, analytics, firebaseConfig, auth, db }; // Export auth and db
