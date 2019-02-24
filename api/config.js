import firebase from "firebase";


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAyEdKo558jOJQ4kKq4j2lXW76IUIVEORI",
    authDomain: "my-spending-app.firebaseapp.com",
    databaseURL: "https://my-spending-app.firebaseio.com",
    projectId: "my-spending-app",
    storageBucket: "my-spending-app.appspot.com",
    messagingSenderId: "711123492369"
  };
  firebase.initializeApp(firebaseConfig)
  const Firebase = firebase
  export default Firebase