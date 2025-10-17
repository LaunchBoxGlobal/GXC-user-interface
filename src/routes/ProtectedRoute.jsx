import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Common/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isEmailVerified) return <Navigate to="/verify-otp" replace />;
  // if (!user.isProfileComplete)
  //   return <Navigate to="/complete-profile" replace />;

  return children;
};

export default ProtectedRoute;
