import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";
import { listenForMessages } from "./notifications";

function App() {
  useEffect(() => {
    listenForMessages((payload) => {
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";

      new Notification(title, {
        body,
      });
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
