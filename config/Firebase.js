import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBSUSeep8G3PAnceLhVM2t7skOn_EyT1oI",
    authDomain: "plantcare-5739f.firebaseapp.com",
    databaseURL: "https://plantcare-5739f-default-rtdb.firebaseio.com/",
    projectId: "plantcare-5739f",
    storageBucket: "plantcare-5739f.appspot.com",
    messagingSenderId: "235610097098",
    appId: "1:235610097098:web:c4c148bddaead20192fb33"
}

// Initialize Firebase

let Firebase = null;
if (!firebase.apps.length) {
    Firebase = firebase.initializeApp(firebaseConfig);
} else {
    Firebase = firebase.app(); // if already initialized, use that one
}

export default Firebase;

export const firebaseAuth = Firebase.auth();