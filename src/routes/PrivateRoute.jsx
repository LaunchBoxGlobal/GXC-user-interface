import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

// Helper: get user data
const getUser = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

// Auth checks
const isAuthenticated = () => !!Cookies.get("userToken");
const isEmailVerified = () => getUser()?.emailVerified;

// ✅ PRIVATE ROUTE
export const PrivateRoute = ({ element, redirectTo }) => {
  const location = useLocation();
  const redirectUrl = location.pathname + location.search + location.hash;

  // 🟠 Not logged in → save the intended URL and go to login
  if (!isAuthenticated()) {
    localStorage.setItem("invitation-link", redirectUrl);

    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  // 🔵 Logged in but email not verified → redirect back or to /verify-email
  if (isAuthenticated() && !isEmailVerified()) {
    const fromPath =
      location.state?.from?.pathname ||
      localStorage.getItem("invitation-link") ||
      "/verify-email";

    return <Navigate to={fromPath} replace />;
  }

  // ✅ Verified user → grant access
  return element;
};
