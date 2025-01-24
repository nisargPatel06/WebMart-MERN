import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthContextProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </AuthContextProvider>
  );
}

export default Layout;
