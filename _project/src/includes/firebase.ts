import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// import "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);

  // For debug only
  // if (process.env.NODE_ENV === "development" && !window.firebase) {
  //   window.firebase = firebase;
  // }
}

export const auth = firebase.auth();
export const storage = firebase.storage();

export const db = firebase.firestore();

// Tells firebase to keep a copy of the DB on the user's browser,
// if the user disconnects from the internet, firebase will switch
// to use local copy
db.enablePersistence().catch((error) =>
  console.error(`Firebase persistence error - ${error.code}`)
);

export const usersCollection = db.collection("users");
export const songsCollection = db.collection("songs");
export const commentsCollections = db.collection("comments");

export default firebase;
