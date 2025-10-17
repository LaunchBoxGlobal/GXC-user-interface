import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";
import Layout from "../components/Layout/Layout";
import Cookies from "js-cookie";
import NotFound from "../pages/NotFound";

// --- Auth Pages ---
import SignUpForm from "../components/Forms/SignUpForm";
import VerifyOtp from "../components/Forms/VerifyOtp";
import AddPaymentInfo from "../components/Forms/AddPaymentInfo";
import PaymentMethods from "../pages/PaymentMethods";
import AccountSuccessPage from "../pages/Auth/AccountSuccessPage";
import LoginForm from "../components/Forms/LoginForm";
import VerifyEmail from "../components/Forms/VerifyEmail";
import ChangePassword from "../components/Forms/ChangePassword";
import CompleteProfileForm from "../components/Forms/CompleteProfileForm";
import ChangeEmailForm from "../components/Forms/ChangeEmailForm";

// --- Dashboard Pages ---
import HomePage from "../pages/Home/HomePage";
import ProfilePage from "../pages/Profile/ProfilePage";
import EditProfile from "../pages/Profile/EditProfile";
import ChangePasswordPage from "../pages/Profile/ChangePasswordPage";
import CommunitiesPage from "../pages/Communities/CommunitiesPage";
import CommunityPage from "../pages/Communities/CommunityPage";
import ReportingPage from "../pages/Reporting/ReportingPage";
import WalletPage from "../pages/Wallet/WalletPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import ProductManagementPage from "../pages/ProductManagement/ProductManagementPage";
import ProductDetailsPage from "../pages/ProductManagement/ProductPage";
import AddProductPage from "../pages/ProductManagement/AddProductPage";
import EditProductPage from "../pages/ProductManagement/EditProductPage";
import CartPage from "../pages/Cart/CartPage";

// --- Helpers ---
const isAuthenticated = () => !!Cookies.get("userToken");

// --- Private Route ---
export const PrivateRoute = ({ element, redirectTo = "/login" }) => {
  const location = useLocation();
  const auth = isAuthenticated();

  if (!auth) {
    // store the attempted path for redirect after login
    const redirectUrl = location.pathname + location.search + location.hash;
    localStorage.setItem("invitation-link", redirectUrl);

    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  return element;
};

// --- Public Route ---
export const PublicRoute = ({ element, redirectTo = "/" }) => {
  const auth = isAuthenticated();

  if (auth) {
    return <Navigate to={redirectTo} replace />;
  }

  return element;
};

// --- Routes ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />

      {/* ---------- AUTH FLOW ---------- */}
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
            element={
              <AuthLayout>
                <ChangePassword />
              </AuthLayout>
            }
          />
        }
      />

      <Route
        path="/change-email"
        element={
          <AuthLayout>
            <ChangeEmailForm />
          </AuthLayout>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <AuthLayout>
            <VerifyOtp />
          </AuthLayout>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <PrivateRoute
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
            element={
              <AuthLayout>
                <AccountSuccessPage />
              </AuthLayout>
            }
          />
        }
      />

      {/* ---------- DASHBOARD ROUTES ---------- */}
      <Route
        path="/"
        element={
          <PrivateRoute
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
            element={
              <Layout>
                <CommunityPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/reporting"
        element={
          <PrivateRoute
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
            element={
              <Layout>
                <OrdersPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/product-management"
        element={
          <PrivateRoute
            element={
              <Layout>
                <ProductManagementPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/products/:productId"
        element={
          <PrivateRoute
            element={
              <Layout>
                <ProductDetailsPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/edit-product"
        element={
          <PrivateRoute
            element={
              <Layout>
                <EditProductPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/products/add-product"
        element={
          <PrivateRoute
            element={
              <Layout>
                <AddProductPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute
            element={
              <Layout>
                <CartPage />
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
