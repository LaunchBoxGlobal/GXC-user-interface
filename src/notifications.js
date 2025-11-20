// src/notifications.js
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const VAPID_KEY =
  "BM6D1oVjxWpWP9wym2P2KEc3oqRh_f540clMC9TssC2tFBN5HsVT9D1rj-vKafvhnIAT9bUsBG2-A0Z32VsVBQI"; // from Firebase Cloud Messaging → Web Push certificates

// Ask for permission and get token
export const requestNotificationPermission = async () => {
  console.log("Requesting notification permission...");

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");

    try {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (currentToken) {
        console.log("FCM token:", currentToken);

        // TODO: send this token to your backend
        await axios.post(`/api/save-fcm-token`, { token: currentToken });
        // adjust the URL according to what your backend dev gives you
      } else {
        console.log("No registration token available.");
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  } else {
    console.log("Notification permission not granted.");
  }
};

// Listen for messages while app is in foreground
export const listenForMessages = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    if (callback) callback(payload);
  });
};
