import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// --- New Function to get or create Device ID ---
const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem("userBrowserDeviceId");
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("userBrowserDeviceId", deviceId);
  }
  return deviceId;
};

const VAPID_KEY =
  "BM6D1oVjxWpWP9wym2P2KEc3oqRh_f540clMC9TssC2tFBN5HsVT9D1rj-vKafvhnIAT9bUsBG2-A0Z32VsVBQI";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Permission not granted");
    return;
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (!currentToken) {
      console.log("No registration token available.");
      return;
    }

    const storedToken = localStorage.getItem("userfcmToken");

    if (storedToken !== currentToken) {
      console.log("New token detected — sending to backend");

      const browserDeviceId = getOrCreateDeviceId();
      const deviceInfo = navigator.userAgent;
      const userToken = Cookies.get("userToken");

      if (!userToken) {
        console.log("User is not logged in — skipping FCM update");
        return;
      }

      await axios.post(
        "https://dev-api.app.thegivexchange.com/api/auth/update-fcm",
        { token: currentToken, deviceInfo: browserDeviceId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      localStorage.setItem("userfcmToken", currentToken);
    } else {
      console.log("Token already sent — no need to send again");
    }
  } catch (err) {
    console.error("Error retrieving token:", err);
  }
};

export const listenForMessages = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    if (callback) callback(payload);
  });
};
