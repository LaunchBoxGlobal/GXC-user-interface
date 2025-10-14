import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAppContext } from "../../context/AppContext";
import CommunitiesDropdown from "./CommunitiesDropdown";
import { Link, useLocation } from "react-router-dom";

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
        {/* {pathname?.pathname == "/product-management" && (
          <div className="w-full flex justify-end">
            <Link
              to={`/products/add-product`}
              className="button max-w-[214px] h-[58px] flex items-center justify-center"
            >
              Add New Product
            </Link>
          </div>
        )} */}
      </div>

      {children}
      <Footer />
    </>
  );
};

export default Layout;
