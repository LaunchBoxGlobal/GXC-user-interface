import React from "react";
import { useLocation } from "react-router-dom";
// signup-page-mockup

const AuthLayout = ({ children }) => {
  const location = useLocation();
  return (
    <main className="w-full min-h-screen relative grid grid-cols-1 lg:grid-cols-2 p-4 auth-bg">
      <div className="w-full h-full bg-transparent hidden lg:block">
        {location?.pathname === "/login" ? (
          <img
            src="/sign-in-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
        ) : location?.pathname === "/forgot-password" ? (
          <img
            src="/verify-email-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
        ) : location?.pathname === "/verify-otp" ? (
          <img
            src="/verify-otp.png"
            alt=""
            className="w-full h-full object-cover"
          />
        ) : location?.pathname === "/change-password" ? (
          <img
            src="/change-password-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
        ) : location?.pathname === "/signup" ? (
          <img
            src="/signup-page-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/login-page-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="w-full h-full py-12 flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
