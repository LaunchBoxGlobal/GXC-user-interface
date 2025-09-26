import React from "react";
import { Link } from "react-router-dom";
import { CgMenu } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const pages = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Product Management",
    url: "/products",
  },
  {
    title: "Orders",
    url: "/orders",
  },
  {
    title: "Wallet",
    url: "/wallet",
  },
  {
    title: "Communities",
    url: "/communities",
  },
  {
    title: "Reporting",
    url: "/reporting",
  },
  {
    title: "Settings",
    url: "/setings",
  },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAppContext();

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <header className="w-full py-4 text-center padding-x bg-[#DEDEDE] flex items-center justify-between gap-8 xl:gap-20 relative overflow-hidden">
      <div className="block">
        <Link to={`/`}>
          <img
            src="/GiveXchangenewlogo.png"
            alt="logo"
            className="w-[70px] lg:w-[100px] xl:w-[120px]"
          />
        </Link>
      </div>

      <ul className="w-full max-w-[80%] hidden lg:flex items-center justify-between gap-5">
        {pages?.map((page, index) => {
          return (
            <li>
              <Link
                to={page?.url}
                key={index}
                className="font-medium text-sm xl:text-base whitespace-nowrap"
              >
                {page?.title}
              </Link>
            </li>
          );
        })}

        <div className="flex items-center gap-10">
          <Link to={`/cart`}>
            <img
              src="/cart-icon.png"
              alt="cart icon"
              className="min-w-[22px] h-[22px]"
            />
          </Link>
          <button type="button">
            <img
              src="/notification-icon.png"
              alt="cart icon"
              className="min-w-[15px] h-[18px]"
            />
          </button>
          <Link to={"/profile"}>
            <div className="w-[57px] h-[57px] rounded-full bg-white flex items-center justify-center">
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
          </Link>
        </div>
      </ul>

      <div className={`flex items-center justify-end gap-10 lg:hidden`}>
        <button type="button" onClick={handleToggleSidebar}>
          <CgMenu className="text-xl" />
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
            {pages?.map((page, index) => {
              return (
                <li>
                  <Link to={page?.url} key={index} className="font-medium">
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
