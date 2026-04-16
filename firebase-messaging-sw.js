importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBbINsazxCJkEHBwySyrQ4FLZhdHC85Cyw",
  authDomain: "boss-respawn-timer.firebaseapp.com",
  projectId: "boss-respawn-timer",
  messagingSenderId: "767083470052",
  appId: "1:767083470052:web:17d7453fe66700321760f1"
});

const messaging = firebase.messaging();
