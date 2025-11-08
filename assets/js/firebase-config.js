// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpE791I4Qe_qzK9zf0NUfE4ZUMuuG9oqE",
  authDomain: "quiz-d7a48.firebaseapp.com",
  projectId: "quiz-d7a48",
  storageBucket: "quiz-d7a48.firebasestorage.app",
  messagingSenderId: "980654312935",
  appId: "1:980654312935:web:bfd4aafb0fb5d3fee04142",
  measurementId: "G-68NVT324ZM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();