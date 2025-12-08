import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PolicyLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
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
                src="/gxc-logo.png"
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
      </header>

      <div className="w-full hero flex items-end padding-x pb-10"></div>

      {children}
    </main>
  );
};

export default PolicyLayout;
