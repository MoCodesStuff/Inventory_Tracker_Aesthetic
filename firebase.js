// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA1Oxf2c4QCQbVbjPF3bhlra85yzqsh-_w",
    authDomain: "inventory-tracker-246a7.firebaseapp.com",
    projectId: "inventory-tracker-246a7",
    storageBucket: "inventory-tracker-246a7.appspot.com",
    messagingSenderId: "879466652132",
    appId: "1:879466652132:web:521a32913a45c663b6a7f1",
    measurementId: "G-MT7WB4W2S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Export
export {firestore}