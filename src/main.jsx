import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <AppProvider>
      <CartProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CartProvider>
    </AppProvider>
  </BrowserRouter>
  // </StrictMode>
);
