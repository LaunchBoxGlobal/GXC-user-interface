import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAppContext } from "../../context/AppContext";

const Layout = ({ children }) => {
  const { fetchUserProfile } = useAppContext();

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
