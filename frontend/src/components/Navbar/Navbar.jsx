import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import defAvatar from "../assets/avatar.jpg";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import {
  CgSearch,
  BsCart3,
  LuMenu,
  LuLogOut,
  IoPersonSharp,
  BsHandbagFill,
  BiSolidBarChartAlt2,
} from "../index";

import {
  useGetUserDetailsQuery,
  useLogoutUserQuery,
} from "../../redux/api/userApi";
import AuthContext from "../../context/AuthContext";
import { selectCartItemsCount } from "../../redux/slices/cartSlice";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [flag, setFlag] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [logout, setLogout] = useState(false);
  const cartItemCount = useSelector(selectCartItemsCount);
  const { isAuthenticated, setIsAuthenticated, avatar, setAvatar } =
    useContext(AuthContext);
  const {
    data: userDetails,
    isError: userDetailsError,
    refetch,
  } = useGetUserDetailsQuery();
  const { data: logoutData, isError: logoutError } = useLogoutUserQuery("", {
    skip: !logout,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (userDetails && userDetails.user && userDetails.user.avatar.url) {
      setAvatar(userDetails.user.avatar.url);
      setIsAuthenticated(true);
      console.log(userDetails);
    } else if (userDetailsError) {
      console.log("Error fetching user details : ", userDetailsError);
    }
  }, [userDetails, userDetailsError]);

  useEffect(() => {
    if (logout) {
      if (logoutData && logoutData.success) {
        console.log("Logged Out!");
        setLogout(false);
        setAvatar(defAvatar);
        setIsAuthenticated(false);
      } else if (logoutError) {
        console.log(logoutError);
      }
    }
  }, [logout, logoutData, logoutError]);

  useEffect(() => {
    const dropDownAnimation = () => {
      const dropDown = document.querySelector(".menu-dropdown");
      if (!flag) {
        dropDown.style.top = "63px";
        setFlag(true);
      } else {
        dropDown.style.top = "-100vh";
        setFlag(false);
      }
    };

    const menu = document.querySelector(".menu");
    menu.addEventListener("click", dropDownAnimation);

    const opt = document.querySelectorAll(".opt");
    opt.forEach(function (e) {
      e.addEventListener("click", dropDownAnimation);
    });

    return () => {
      menu.removeEventListener("click", dropDownAnimation);
      opt.forEach(function (e) {
        e.removeEventListener("click", dropDownAnimation);
      });
    };
  }, [flag]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate("/products");
    }
  };

  const handleDashboardClick = () => navigate("/admin/dashboard");
  const handleOrdersClick = () => navigate("/orders");
  const handleProfileClick = () => navigate("/profile");
  const handleLogoutClick = () => setLogout(true);

  const actions = [
    { icon: <BsHandbagFill />, name: "Orders", onClick: handleOrdersClick },
    { icon: <IoPersonSharp />, name: "Profile", onClick: handleProfileClick },
    { icon: <LuLogOut />, name: "Logout", onClick: handleLogoutClick },
  ];
  if (userDetails && userDetails.user && userDetails.user.role === "admin") {
    actions.unshift({
      icon: <BiSolidBarChartAlt2 />,
      name: "Dashboard",
      onClick: handleDashboardClick,
    });
  }

  return (
    <div className="main font-[Nunito] sticky top-0 z-20">
      <div className="top-nav p-2 px-10 h-16 bg-white flex justify-between items-center shadow-sm">
        <div>
          <NavLink
            to="/"
            className="logo-section flex items-center gap-3 w-auto"
          >
            <img className="logo h-12 w-12" src={logo} alt="" />
            <p className="logo-name text-lg">WebMart</p>
          </NavLink>
        </div>

        <form
          onSubmit={searchHandler}
          className="search-section flex justify-center items-center"
        >
          <input
            className="search-input p-2 bg-gray-100 h-10 w-[25vw] rounded-l-lg outline-none"
            type="text"
            placeholder="Search products, brands and more.."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <CgSearch
            type="submit"
            onClick={searchHandler}
            className="search-icon p-2 h-10 w-[35px] text-slate-800 bg-gray-100 rounded-r-lg hover:cursor-pointer"
          />
        </form>

        <div className="menu-options flex gap-8 font-bold">
          <h4>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
              }
            >
              Home
            </NavLink>
          </h4>
          <h4>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
              }
            >
              Products
            </NavLink>
          </h4>
        </div>

        <div className="sign-up h-full flex justify-center items-center gap-7">
          <button className="login-btn h-10 w-24 flex justify-center items-center bg-[#ff6b35] text-white rounded-full hover:bg-[#f1582dda]">
            <NavLink to="/login">Sign In</NavLink>
          </button>

          <div
            className="cart w-[42px] h-[42px] rounded-full relative flex justify-center items-center gap-1 hover:cursor-pointer hover:bg-[#00000010]"
            onClick={() => navigate("/cart")}
          >
            <BsCart3 className="cart-icon text-2xl text-[#000000b2]" />
            <div className="counter absolute top-[-3%] right-[-15%] w-[22px] h-[22px] bg-[#ff6b35] rounded-full flex justify-center items-center text-[12px] text-white border-[2px] border-[#fff]">
              {cartItemCount}
            </div>
          </div>

          <div className="menu hidden hover:cursor-pointer">
            <LuMenu className="text-xl" />
          </div>

          {isAuthenticated ? (
            <div className="w-[5vw] h-[auto] mt-[240px] bg-blue-500">
              <SpeedDial
                className="speedDialContainer"
                ariaLabel="User Actions"
                icon={
                  <img className="speedDialIcon" src={avatar} alt="Profile" />
                }
                direction="down"
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                  />
                ))}
              </SpeedDial>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="menu-dropdown absolute w-[100vw] h-[100vh] right-0 top-[-100vh] bg-[#00000089] z-[-10]">
          <div className="options pr-10 p-4 h-[auto] flex flex-col text-right text-xl bg-white rounded-b-[40px]">
            <h4>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `opt ${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
                }
              >
                Home
              </NavLink>
            </h4>
            <h4>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `opt ${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
                }
              >
                Products
              </NavLink>
            </h4>
            <h4 className="login-opt hidden text-gray-500 cursor-pointer">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `opt ${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
                }
              >
                Login
              </NavLink>
            </h4>
            <h4 className="cart-opt hidden text-gray-500 cursor-pointer">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `opt ${isActive ? "text-[#ff6b35]" : "text-gray-500"}`
                }
              >
                Cart
              </NavLink>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
