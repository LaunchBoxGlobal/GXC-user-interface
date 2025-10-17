import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const EmailVerificationRoute = ({ children }) => {
  const { user } = useAppContext();

  if (!user) return <Navigate to="/signup" replace />;
  if (user.isEmailVerified && !user.isProfileComplete)
    return <Navigate to="/complete-profile" replace />;
  if (user.isEmailVerified && user.isProfileComplete)
    return <Navigate to="/" replace />;

  return children;
};

export default EmailVerificationRoute;
