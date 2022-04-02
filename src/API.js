import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"



const firebaseConfig = {
  apiKey: "AIzaSyDLCAtvP15GZUQqljPmL6uZSxwBj5jrvZE",
  authDomain: "netscene-ee164.firebaseapp.com",
  projectId: "netscene-ee164",
  storageBucket: "netscene-ee164.appspot.com",
  messagingSenderId: "639443199911",
  appId: "1:639443199911:web:15ed83e4d90c608f75b882",
  measurementId: "G-WQMPJ2ZD6Q"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();
// Initialize Firebase

export default firestore