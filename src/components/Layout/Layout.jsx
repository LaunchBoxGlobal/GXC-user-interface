import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAppContext } from "../../context/AppContext";
import CommunitiesDropdown from "./CommunitiesDropdown";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const { user, fetchUserProfile } = useAppContext();
  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!user) {
      fetchUserProfile();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="w-full hero flex items-end padding-x pb-10">
        {pathname?.pathname === "/" && <CommunitiesDropdown />}
      </div>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
