import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import {
  listenForMessages,
  requestNotificationPermission,
} from "./notifications";

function App() {
  useEffect(() => {
    requestNotificationPermission();

    listenForMessages((payload) => {
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";

      enqueueSnackbar(`${title}\n\n${body}`);
    });
  }, []);
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
