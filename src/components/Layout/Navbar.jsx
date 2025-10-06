import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CgMenu } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { PAGE_LINKS } from "../../data/pageLinks";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full border-b border-gray-200 border-opacity-40 fixed top-0 z-50 inset-x-0 py-6 text-center padding-x flex items-center justify-between gap-8 xl:gap-20 overflow-hidden transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="block">
        <Link to={`/`}>
          {isScrolled ? (
            <img
              src="/logo.svg"
              alt="logo"
              className="w-[70px] lg:w-[100px] xl:w-[120px]"
            />
          ) : (
            <img
              src="/logo-light.png"
              alt="logo"
              className="w-[70px] lg:w-[100px] xl:w-[120px]"
            />
          )}
        </Link>
      </div>

      <ul className="w-full max-w-[80%] hidden lg:flex items-center justify-between gap-5">
        {PAGE_LINKS?.map((page, index) => {
          return (
            <li>
              <Link
                to={page?.url}
                key={index}
                className={`font-medium text-sm xl:text-base whitespace-nowrap ${
                  isScrolled ? "text-gray-900" : "text-gray-200"
                }`}
              >
                {page?.title}
              </Link>
            </li>
          );
        })}

        <div className="flex items-center gap-10">
          <Link to={`/cart`}>
            {isScrolled ? (
              <img
                src="/cart-icon.png"
                alt="cart icon"
                className="min-w-[22px] h-[22px]"
              />
            ) : (
              <img
                src="/cart-white-icon.svg"
                alt="cart icon"
                className="min-w-[22px] h-[22px]"
              />
            )}
          </Link>
          <button type="button">
            {isScrolled ? (
              <img
                src="/notification-icon.png"
                alt="cart icon"
                className="min-w-[21px] h-[21px]"
              />
            ) : (
              <img
                src="/notification-white-icon.svg"
                alt="cart icon"
                className="min-w-[21px] h-[21px]"
              />
            )}
          </button>
          {user && (
            <Link to={"/profile"}>
              {isScrolled ? (
                <img
                  src="/public/profile-icon.png"
                  alt="profile icon"
                  className="w-[57px] h-[57px]"
                />
              ) : (
                <div
                  className={`w-[57px] h-[57px] rounded-full bg-white flex items-center justify-center`}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user?.profilePictureUrl}
                      alt="profile icon"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="/user-profile-icon.png"
                      alt="profile icon"
                      className="w-[14px] h-[19px]"
                    />
                  )}
                </div>
              )}
            </Link>
          )}
        </div>
      </ul>

      <div className={`flex items-center justify-end gap-10 lg:hidden`}>
        <button type="button" onClick={handleToggleSidebar}>
          <CgMenu className="text-xl text-gray-200" />
        </button>

        <div
          className={`w-3/4 sm:w-1/2 h-screen bg-gray-100 fixed top-0 right-0 z-50 flex flex-col items-start px-5 py-4
      transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} 
      transition-transform duration-500`}
        >
          <div className="w-full flex justify-start">
            <button type="button" onClick={handleToggleSidebar}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          <ul className="w-full flex flex-col items-start justify-start gap-5 pt-10">
            {PAGE_LINKS?.map((page, index) => {
              return (
                <li key={index}>
                  <Link to={page?.url} className="font-medium">
                    {page?.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
