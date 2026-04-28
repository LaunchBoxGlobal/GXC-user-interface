import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  // apiKey: "AIzaSyB2IDE8PHZwXX1xDwkuS8xF5NTrD3bB_b0",
  // authDomain: "givexchange-96249.firebaseapp.com",
  // projectId: "givexchange-96249",
  // storageBucket: "givexchange-96249.firebasestorage.app",
  // messagingSenderId: "502661287670",
  // appId: "1:502661287670:web:a9ce75c8e57b2c5e62e6d7",
  // measurementId: "G-BBRPF7R3D2",
  apiKey: "AIzaSyAqpAOu3TFwV6ICjDL5npxttsKfMnZnz-4",
  authDomain: "givexchnage.firebaseapp.com",
  projectId: "givexchnage",
  storageBucket: "givexchnage.firebasestorage.app",
  messagingSenderId: "872155075471",
  appId: "1:872155075471:web:0e586cf00ebaaceadc71fa",
  measurementId: "G-PYG9R3FTC7",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, messaging };
