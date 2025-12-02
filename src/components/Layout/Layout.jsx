import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAppContext } from "../../context/AppContext";
import CommunitiesDropdown from "./CommunitiesDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import OrderManagementHeader from "./OrderManagementHeader";
import { HiArrowLeft } from "react-icons/hi";
import ProductManagementHeader from "./ProductManagementHeader";

const Layout = ({ children }) => {
  const { user, fetchUserProfile } = useAppContext();
  const pathname = useLocation();
  const { selectedCommunity } = useUser();
  const navigate = useNavigate();

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

        {pathname?.pathname == "/product-management" && selectedCommunity && (
          <ProductManagementHeader />
        )}

        {pathname?.pathname == "/order-management" && selectedCommunity && (
          <OrderManagementHeader />
        )}

        {pathname?.pathname == "/reporting" && selectedCommunity && (
          <div className="w-full flex flex-col items-start gap-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-white"
            >
              <HiArrowLeft />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-[24px] lg:text-[32px] font-semibold leading-none text-white">
              Make a Report
            </h1>
          </div>
        )}
      </div>

      {children}
      <Footer />
    </>
  );
};

export default Layout;
