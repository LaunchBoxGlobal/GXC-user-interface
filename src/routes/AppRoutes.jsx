import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
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
import ProductDetailsPage from "../pages/ProductManagement/ProductDetailsPage";
import AddProductPage from "../pages/ProductManagement/AddProductPage";
import EditProductPage from "../pages/ProductManagement/EditProductPage";
import CartPage from "../pages/Cart/CartPage";
import CartSummary from "../pages/Cart/CartSummary";
import Checkout from "../pages/Cart/Checkout";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";

// Settings
import SettingsPage from "../pages/Settings/SettingsPage";

// --- Helpers ---
const isAuthenticated = () => !!Cookies.get("userToken");

// --- Private Route ---
// export const PrivateRoute = ({ element, redirectTo = "/login" }) => {
//   const location = useLocation();
//   const auth = isAuthenticated();

//   if (!auth) {
//     const redirectUrl = location.pathname + location.search + location.hash;
//     localStorage.setItem("invitation-link", redirectUrl);

//     return (
//       <Navigate
//         to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
//         replace
//       />
//     );
//   }

//   return element;
// };

export const PrivateRoute = ({ element, redirectTo = "/login" }) => {
  const location = useLocation();
  const token = Cookies.get("userToken");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const isAuthenticated = !!token;
  const isEmailVerified = user?.emailVerified;

  const redirectUrl = location.pathname + location.search + location.hash;

  if (!isAuthenticated) {
    localStorage.setItem("invitation-link", redirectUrl);
    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  if (!isEmailVerified && !location.pathname.includes("/verify-otp")) {
    return (
      <Navigate
        to={`/verify-otp${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return element;
};

// --- Public Route ---
export const PublicRoute = ({ element, redirectTo = "/" }) => {
  const auth = isAuthenticated();
  const [searchParams] = useSearchParams();
  const redirect = searchParams?.get("redirect");

  if (auth) {
    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
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
                {/* <ProductDetailsPage /> */}
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
        path="/product-management/add-product"
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

      {/* <Route
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
      /> */}

      <Route
        path="/cart/:communityId"
        element={
          <PrivateRoute
            element={
              <Layout key="cart-summary">
                <CartSummary />
              </Layout>
            }
          />
        }
      />
      <Route
        path="/cart/:communityId/checkout"
        element={
          <PrivateRoute
            element={
              <Layout key="checkout">
                <Checkout />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/orders/details/:orderId"
        element={
          <PrivateRoute
            element={
              <Layout key="order-details">
                <OrderDetailsPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute
            element={
              <Layout key="settings-page">
                <SettingsPage />
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
