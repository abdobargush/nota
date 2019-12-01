/*
Firebase
*/
import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
	// Firebase config goes here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export firestore
export const db = firebase.firestore()