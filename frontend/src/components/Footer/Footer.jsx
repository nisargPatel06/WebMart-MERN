import React from "react";
import "./Footer.css";
import logo from "../assets/logo.png";
import { FaRegCopyright, SiGithub, FaTwitter, FaFacebookF } from "../index";

const Footer = () => {
  return (
    <div className="footer bg-[#ffffff] w-full h-60 font-[Nunito] flex flex-col justify-center gap-5">
      <div className="top flex justify-evenly items-center">
        <div className="logo-container flex flex-col gap-2">
          <div className="logo flex justify-center items-center gap-5">
            <img className="h-28 w-28" src={logo} alt="" />
            <p className="lodo-name text-xl">WebMart</p>
          </div>

          <p className="slogan text-sm text-gray-900">
            Empowering Your Every Purchase, One Click at a Time!
          </p>
        </div>

        <div className="container w-auto flex flex-wrap gap-32">
          <div className="tab m1 flex flex-col gap-1">
            <h4 className="pb-4">Pages</h4>
            <p className="text-gray-500">Home</p>
            <p className="text-gray-500">Products</p>
            <p className="text-gray-500">Contact</p>
          </div>
          <div className="tab m2 flex flex-col gap-1">
            <h4 className="pb-4">Legal</h4>
            <p className="text-gray-500">Privacy Policy</p>
            <p className="text-gray-500">Terms & Conditions</p>
          </div>
          <div className="tab m3 flex flex-col gap-1">
            <h4 className="pb-4">Company</h4>
            <p className="text-gray-500">Account</p>
            <p className="text-gray-500">Delivery Information</p>
            <p className="text-gray-500">Support Center</p>
          </div>
        </div>
      </div>

      <div className="bottom w-full h-10 flex items-end justify-around border-t-[1px] border-t-[#00000026]">
        <div className="copyright flex justify-center items-center gap-1">
          <FaRegCopyright className="icon text-gray-500 text-sm" />
          <p className="text-sm text-gray-600">
            2024nisargpatel. All Rights Reserved.
          </p>
        </div>
        <div className="follow flex items-center gap-14">
          <p className="text-md">Follow us</p>
          <div className="flex gap-5 text-md">
            <FaFacebookF />
            <SiGithub />
            <FaTwitter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
