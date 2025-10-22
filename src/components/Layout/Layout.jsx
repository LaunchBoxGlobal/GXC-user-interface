import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAppContext } from "../../context/AppContext";
import CommunitiesDropdown from "./CommunitiesDropdown";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/userContext";

const Layout = ({ children }) => {
  const { user, fetchUserProfile } = useAppContext();
  const pathname = useLocation();
  const { selectedCommunity } = useUser();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!user) {
      fetchUserProfile();
    }
  }, [pathname?.pathname]);

  return (
    <>
      <Navbar />
      <div className="w-full hero flex items-end padding-x pb-10">
        {pathname?.pathname === "/" && selectedCommunity && (
          <CommunitiesDropdown />
        )}

        {/* {pathname?.pathname == "/product-management" && selectedCommunity && (
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
