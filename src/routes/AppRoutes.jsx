import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";
import SignUpForm from "../components/Forms/SignUpForm";
import VerifyOtp from "../components/Forms/VerifyOtp";
import EmailVerificationStatusPage from "../pages/Auth/EmailVerificationStatusPage";
import AddPaymentInfo from "../components/Forms/AddPaymentInfo";
import PaymentMethods from "../pages/PaymentMethods";
import AccountSuccessPage from "../pages/Auth/AccountSuccessPage";
import HomePage from "../pages/Home/HomePage";
import LoginForm from "../components/Forms/LoginForm";
import VerifyEmail from "../components/Forms/VerifyEmail";
import ChangePassword from "../components/Forms/ChangePassword";
import Cookies from "js-cookie";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout/Layout";
import ProfilePage from "../pages/Profile/ProfilePage";
import EditProfile from "../pages/Profile/EditProfile";
import ChangePasswordPage from "../pages/Profile/ChangePasswordPage";

// const isAuthenticated = () => !!Cookies.get("token");
const isAuthenticated = () => {
  const token = Cookies.get("token");
  const isVerified = Cookies.get("isVerified") === "true";
  return !!token && isVerified;
};

const isUnverified = () => {
  const token = Cookies.get("token");
  const isVerified = Cookies.get("isVerified") === "true";
  return !!token && !isVerified;
};

// const PrivateRoute = ({ element, redirectTo }) => {
//   return isAuthenticated() ? element : <Navigate to={redirectTo} />;
// };

export const PrivateRoute = ({ element, redirectTo }) => {
  const location = useLocation();

  if (isAuthenticated()) {
    return element;
  }

  if (isUnverified()) {
    // user has token but not verified → send to OTP
    return <Navigate to="/verify-otp" replace />;
  }

  // no token at all → send to login (or passed redirectTo)
  return (
    <Navigate
      to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};
const PublicRoute = ({ element, redirectTo }) => {
  return isAuthenticated() ? <Navigate to={redirectTo} /> : element;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route
        path="/signup"
        element={
          <PublicRoute
            element={
              <AuthLayout>
                <SignUpForm />
              </AuthLayout>
            }
            redirectTo="/"
          />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/change-password"
        element={
          <PublicRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <ChangePassword />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/verify-otp"
        element={
          isUnverified() ? (
            <AuthLayout>
              <VerifyOtp />
            </AuthLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/email-verification"
        element={
          <PrivateRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <EmailVerificationStatusPage />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/add-payment-info"
        element={
          <PrivateRoute
            redirectTo={`/login`}
            element={
              <AuthLayout>
                <AddPaymentInfo />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/payment-methods"
        element={
          <PrivateRoute
            redirectTo={`/login`}
            element={
              <AuthLayout>
                <PaymentMethods />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/account-created"
        element={
          <PrivateRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <AccountSuccessPage />
              </AuthLayout>
            }
          />
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
        }
      />
      <Route
        path="/edit-profile"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <EditProfile />
              </Layout>
            }
          />
        }
      />
      <Route
        path="/profile/change-password"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <ChangePasswordPage />
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
