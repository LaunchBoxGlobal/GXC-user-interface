import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const getUser = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

const isAuthenticated = () => !!Cookies.get("userToken");
const isEmailVerified = () => getUser()?.emailVerified;

// ✅ PUBLIC ROUTE
export const PublicRoute = ({ element, redirectTo }) => {
  const location = useLocation();
  const redirectUrl = location.search.replace("?redirect=", "");

  // 🔵 Logged in + verified → redirect to main dashboard or redirect param
  if (isAuthenticated() && isEmailVerified()) {
    const target = redirectUrl
      ? decodeURIComponent(redirectUrl)
      : redirectTo || "/";

    return <Navigate to={target} replace />;
  }

  // 🟠 Logged in but not verified → allow them to stay (e.g. on verify-email)
  return element;
};
