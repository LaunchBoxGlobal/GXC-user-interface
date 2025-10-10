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
import ProductDetailsPage from "../pages/ProductManagement/ProductPage";
import AddProductPage from "../pages/ProductManagement/AddProductPage";
import CartPage from "../pages/Cart/CartPage";

// const getUser = () => {
//   const userCookie = Cookies.get("user");
//   return userCookie ? JSON.parse(userCookie) : null;
// };

// const isAuthenticated = () => {
//   const token = Cookies.get("userToken");
//   return !!token;
// };

// export const PrivateRoute = ({ element, redirectTo }) => {
//   const location = useLocation();

//   if (isAuthenticated()) {
//     return element;
//   }

//   const redirectUrl = location.pathname + location.search + location.hash;
//   localStorage.setItem("invitation-link", redirectUrl);

//   return (
//     <Navigate
//       to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
//       replace
//     />
//   );
// };

// const PublicRoute = ({ element, redirectTo }) => {
//   return isAuthenticated() ? <Navigate to={redirectTo} /> : element;
// };

const getUser = () => {
  const userCookie = Cookies.get("user");
  return userCookie ? JSON.parse(userCookie) : null;
};

const isAuthenticated = () => !!Cookies.get("userToken");

// ✅ Use the user object to check email verification status
const isEmailVerified = () => {
  const user = getUser();
  return user?.emailVerified === true;
};

export const PrivateRoute = ({ element, redirectTo }) => {
  const location = useLocation();
  const auth = isAuthenticated();
  const verified = isEmailVerified();

  // If not authenticated → redirect to login
  if (!auth) {
    const redirectUrl = location.pathname + location.search + location.hash;
    localStorage.setItem("invitation-link", redirectUrl);
    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  // ✅ If authenticated but email not verified → go to verify-otp
  if (auth && !verified) {
    return (
      <Navigate
        to={`/verify-otp?redirect=${encodeURIComponent(
          location.pathname + location.search + location.hash
        )}`}
        replace
      />
    );
  }

  // Otherwise → allow access
  return element;
};

export const PublicRoute = ({ element, redirectTo }) => {
  const auth = isAuthenticated();
  const verified = isEmailVerified();

  // ✅ If logged in & verified → redirect to dashboard/home
  if (auth && verified) return <Navigate to={redirectTo} replace />;

  // ✅ If logged in but not verified → redirect to verify-otp
  if (auth && !verified) return <Navigate to="/verify-otp" replace />;

  // Otherwise → show the public page
  return element;
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
          <AuthLayout>
            <VerifyOtp />
          </AuthLayout>
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

      <Route
        path="/products/:productName"
        element={
          <PrivateRoute
            redirectTo={"/login"}
            element={
              <Layout>
                <ProductDetailsPage />
              </Layout>
            }
          />
        }
      />

      <Route
        path="/products/add-product"
        element={
          <PrivateRoute
            redirectTo={"/login"}
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
            redirectTo={"/login"}
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
