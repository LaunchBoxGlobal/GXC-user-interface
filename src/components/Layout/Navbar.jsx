import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CgMenu } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";
import { PAGE_LINKS } from "../../data/pageLinks";
import { useCart } from "../../context/cartContext";
import { useUser } from "../../context/userContext";
import ProfilerDropdown from "./ProfilerDropdown";
import NotificationsDropdown from "./NotificationsDropdown";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAppContext();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const { selectedCommunity } = useUser();
  const location = useLocation();

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

  const isActive = (url) => {
    const [path] = url.split("?");

    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`w-full border-b border-gray-200 border-opacity-40 fixed top-0 z-50 inset-x-0 py-6 text-center padding-x flex items-center justify-between gap-8 xl:gap-20 overflow-visible transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="block">
        <Link to={`/`} className="outline-none border-none">
          {isScrolled ? (
            <img
              src="/logo.svg"
              alt="logo"
              className="w-[70px] lg:w-[100px] xl:w-[140px]"
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

      {/* Desktop Nav */}
      <ul className="w-full max-w-[80%] hidden xl:flex items-center justify-end gap-x-10">
        {PAGE_LINKS?.map((page) => {
          const active = isActive(page.url);
          return (
            <li key={page.title}>
              <Link
                to={page.url}
                className={`font-medium text-sm xl:text-base whitespace-nowrap transition-all ${
                  active
                    ? isScrolled
                      ? "text-[var(--button-bg)]"
                      : "text-white"
                    : isScrolled
                    ? "text-gray-900 hover:text-[var(--button-bg)]"
                    : "text-gray-100 hover:text-white"
                }`}
              >
                <span
                  className={`inline-block relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:transition-all ${
                    active
                      ? isScrolled
                        ? "after:bg-[var(--button-bg)] after:w-[80%]"
                        : "after:bg-white after:w-[80%]"
                      : "after:w-0 after:bg-transparent"
                  }`}
                >
                  {page.title}
                </span>
              </Link>
            </li>
          );
        })}

        {/* Right icons */}
        <div className="flex items-center gap-8">
          {/* Cart */}
          <Link to={`/cart/${selectedCommunity?.id}`}>
            <div className="relative">
              <img
                src={isScrolled ? "/cart-icon.png" : "/cart-white-icon.svg"}
                alt="cart icon"
                className="min-w-[22px] h-[22px]"
              />
              {cartCount > 0 && (
                <div
                  className={`w-4 h-4 rounded-full ${
                    isScrolled ? "bg-[var(--button-bg)]" : "bg-white"
                  } absolute -top-1 -right-2 flex items-center justify-center`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isScrolled ? "text-white" : "text-black"
                    }`}
                  >
                    {cartCount}
                  </span>
                </div>
              )}
            </div>
          </Link>

          <NotificationsDropdown isScrolled={isScrolled} />

          {/* Profile */}
          {user && <ProfilerDropdown user={user} />}
        </div>
      </ul>

      {/* Mobile Menu */}
      <div className="flex items-center justify-end gap-5 xl:hidden">
        {/* Right icons */}
        <div className="flex items-center gap-5">
          {/* Cart */}
          <Link to={`/cart/${selectedCommunity?.id}`}>
            <div className="relative">
              <img
                src={isScrolled ? "/cart-icon.png" : "/cart-white-icon.svg"}
                alt="cart icon"
                className="min-w-[22px] h-[22px]"
              />
              {cartCount > 0 && (
                <div
                  className={`w-4 h-4 rounded-full ${
                    isScrolled ? "bg-[var(--button-bg)]" : "bg-white"
                  } absolute -top-1 -right-2 flex items-center justify-center`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isScrolled ? "text-white" : "text-black"
                    }`}
                  >
                    {cartCount}
                  </span>
                </div>
              )}
            </div>
          </Link>

          <NotificationsDropdown isScrolled={isScrolled} />

          {/* Profile */}
          {/* {user && <ProfilerDropdown user={user} />} */}
        </div>
        <button type="button" onClick={handleToggleSidebar}>
          <CgMenu
            className={`text-xl ${isScrolled ? "text-black" : "text-gray-200"}`}
          />
        </button>

        <div
          className={`w-3/4 sm:w-1/2 lg:w-[30%] h-screen bg-gray-100 fixed top-0 right-0 z-50 flex flex-col items-start px-5 py-4 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-500`}
        >
          <div className="w-full flex justify-start">
            <button type="button" onClick={handleToggleSidebar}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          <ul className="w-full flex flex-col items-start justify-start gap-3 pt-10">
            {PAGE_LINKS?.map((page) => {
              const active = isActive(page.url);
              return (
                <li key={page.title}>
                  <Link
                    to={page.url}
                    className={`font-medium text-base ${
                      active
                        ? "text-[var(--button-bg)] font-semibold"
                        : "text-gray-800"
                    }`}
                    onClick={handleToggleSidebar}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                to={`/profile/notifications`}
                className={`font-medium text-base text-gray-800`}
                onClick={handleToggleSidebar}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
