// public/firebase-messaging-sw.js

// Use compat version for service worker:
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

// SAME config as in src/firebase.js
firebase.initializeApp({
  apiKey: "AIzaSyB2IDE8PHZwXX1xDwkuS8xF5NTrD3bB_b0",
  authDomain: "givexchange-96249.firebaseapp.com",
  projectId: "givexchange-96249",
  storageBucket: "givexchange-96249.firebasestorage.app",
  messagingSenderId: "502661287670",
  appId: "1:502661287670:web:a9ce75c8e57b2c5e62e6d7",
});

const messaging = firebase.messaging();

// This handles background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo192.png", // set your icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
