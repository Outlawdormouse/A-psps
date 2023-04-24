// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    'apiKey': "AIzaSyC9eRBOd0FzSfhmExVqOmo4FlVCVobmI0U",
    'authDomain': "a-psps.firebaseapp.com",
    'projectId': "a-psps",
    'storageBucket': "a-psps.appspot.com",
    'messagingSenderId': "410022355160",
    'appId': "1:410022355160:web:a4e1bddaad4b4da39537ad",
    'measurementId': "G-878LL4DRCC",
    'databaseURL': ""
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const auth = getAuth(firebaseApp)