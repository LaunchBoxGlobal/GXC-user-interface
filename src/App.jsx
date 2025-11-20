import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import {
  listenForMessages,
  requestNotificationPermission,
} from "./notifications";

function App() {
  // useEffect(() => {
  // 1. Ask for permission and send token to backend
  // requestNotificationPermission();

  // 2. Handle notifications when app is open (foreground)
  // listenForMessages((payload) => {
  //   const title = payload.notification?.title || "New Notification";
  //   const body = payload.notification?.body || "";

  // Simple example: use alert (you can replace with toast/snackbar)
  //     alert(`${title}\n\n${body}`);
  //   });
  // }, []);

  return (
    <>
      <SnackbarProvider
        autoHideDuration={2500}
        maxSnack={1}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
