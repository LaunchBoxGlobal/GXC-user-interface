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
import CommunitiesPage from "../pages/Communities/CommunitiesPage";
import CompleteProfileForm from "../components/Forms/CompleteProfileForm";
import CommunityPage from "../pages/Communities/CommunityPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import ReportingPage from "../pages/Reporting/ReportingPage";
import WalletPage from "../pages/Wallet/WalletPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import ProductManagementPage from "../pages/ProductManagement/ProductManagementPage";

// const isAuthenticated = () => !!Cookies.get("token");
const isAuthenticated = () => {
  const token = Cookies.get("userToken");
  const isVerified = Cookies.get("isVerified") === "true";
  return !!token;
};

const isUnverified = () => {
  const token = Cookies.get("userToken");
  const isVerified = Cookies.get("isVerified") === "true";
  return !!token && !isVerified;
};

export const PrivateRoute = ({ element, redirectTo }) => {
  const location = useLocation();

  if (isAuthenticated()) {
    return element;
  }

  // if (isUnverified()) {
  //   return <Navigate to="/verify-otp" replace />;
  // }

  const redirectUrl = location.pathname + location.search + location.hash;
  localStorage.setItem("invitation-link", redirectUrl);

  return (
    <Navigate
      to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
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
          // isUnverified() ? (
          <AuthLayout>
            <VerifyOtp />
          </AuthLayout>
          // ) : (
          // <Navigate to="/" />
          // )
        }
      />

      <Route
        path="/complete-profile"
        element={
          <PrivateRoute
            redirectTo={`/`}
            element={
              <AuthLayout>
                <CompleteProfileForm />
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

      <Route
        path="/communities"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <CommunitiesPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/community/:communityTitle"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <CommunityPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/settings"
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
        path="/reporting"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <ReportingPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/wallet"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <WalletPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <OrdersPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <ProductManagementPage />
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
