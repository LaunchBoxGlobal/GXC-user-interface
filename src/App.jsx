import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <>
      <SnackbarProvider
        autoHideDuration={1500}
        maxSnack={2}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
