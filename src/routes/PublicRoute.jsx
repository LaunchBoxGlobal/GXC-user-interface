import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (user?.isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  if (user?.isEmailVerified) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!user?.isEmailVerified && user) {
    return <Navigate to="/verify-otp" replace />;
  }

  return children;
};

export default PublicRoute;
