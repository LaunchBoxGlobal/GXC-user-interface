import { useEffect } from "react";
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
    <main className="w-full min-h-screen relative grid grid-cols-1 lg:grid-cols-2 auth-bg">
      <div className="w-full h-full bg-transparent hidden lg:block">
        <div className="w-full h-full bg-[#4E9D4B] relative overflow-hidden flex flex-col justify-between gap-0">
          <div className="w-full p-10">
            <h1 className="text-[45px] leading-none font-medium text-white">
              Community <br /> Market Place
            </h1>
            <p className="text-white text-[22px] leading-[1.35] mt-3">
              Connect with your community <br /> to buy and sell products.
            </p>
          </div>
          {location?.pathname === "/login" ? (
            <img
              src="/20824344_6343823.svg"
              alt="login-screen-mockup"
              width={750}
              height={750}
              className="mx-auto object-contain max-w-[70%]"
            />
          ) : location?.pathname === "/forgot-password" ? (
            <div className="w-full relative">
              <img
                src="/forgot-password-vector.png"
                alt="forgot-password-vector"
                className="w-full max-w-[85%] mx-auto h-auto object-cover rounded-[20px] absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
              />
              <img
                src="/forgot-password-screen-mockup.png"
                alt="forgot-password-screen-mockup"
                className="w-full max-w-[62%] m-auto relative z-20"
              />
            </div>
          ) : location?.pathname === "/verify-otp" ? (
            <div className="w-full relative">
              <img
                src="/forgot-password-vector.png"
                alt="forgot-password-vector"
                className="w-full max-w-[95%] mx-auto h-auto object-cover rounded-[20px] absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
              />
              <img
                src="/verify-otp-screen-mockup.png"
                alt="verify-otp-screen-mockup"
                className="w-full max-w-[72%] m-auto relative z-20"
              />
            </div>
          ) : location?.pathname === "/change-password" ? (
            <div className="w-full relative mt-20">
              <img
                src="/forgot-password-vector.png"
                alt="forgot-password-vector"
                className="w-full max-w-[95%] mx-auto h-auto object-cover rounded-[20px] absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
              />
              <img
                src="/change-password-image.png"
                alt="change-password-mockup"
                className="w-full object-cover rounded-[20px] brightness-75 max-w-[90%] mx-auto"
              />
            </div>
          ) : location?.pathname === "/signup" ? (
            <img
              src="/signup-screen-mockup.svg"
              alt="signup-screen-mockup"
              className="w-full max-w-[90%] mx-auto"
            />
          ) : (
            <img
              src="/complete-profile-screen-mockup.svg"
              alt="complete-profile-screen-mockup"
              className="w-full max-w-[80%] mx-auto h-auto object-contain rounded-[20px] absolute bottom-10 left-1/2 -translate-x-1/2"
            />
          )}
        </div>
      </div>
      <div className="w-full h-full py-12 flex items-center flex-col justify-center relative">
        <div className="absolute top-5 flex justify-end right-5">
          {/* <LanguageSwitcher className={className} isScrolled={true} /> */}
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
