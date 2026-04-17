import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LanguageSwitcher from "../../LanguageSwitcher";

const AuthLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const className =
    "appearance-none bg-white border border-gray-300 text-gray-700 py-1 lg:py-1.5 pl-1.5 lg:pl-2 pr-7 lg:pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 text-sm cursor-pointer";

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
      <div className="w-full h-full py-12 flex items-center flex-col justify-center relative">
        <div className="absolute top-5 flex justify-end right-5">
          <LanguageSwitcher className={className} isScrolled={true} />
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
