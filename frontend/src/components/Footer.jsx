import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  return (
    <div className="container-footer">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 md:px-32 md:py-14 gap-8 md:gap-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            GENIE
          </h1>
          <p className="text-gray-400 text-sm">
            Your magic friend to generate resumes, apply for jobs, and summarize notes
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl">
            Support 
          </h1>
          <Link  to="/contact">
            <p  className="text-gray-400 text-sm  hover:text-white">Contact us</p>
          </Link>
          <Link to="/faq">
            <p  className="text-gray-400 text-sm  hover:text-white">FAQ</p>
          </Link>
          <Link to="/terms-and-conditions">
            <p  className="text-gray-400 text-sm  hover:text-white">Terms and Conditions</p>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl">
            About
          </h1>
          <Link  to="/about">
            <p  className="text-gray-400 text-sm  hover:text-white">About us</p>
          </Link>
          <Link to="/faq">
            <p  className="text-gray-400 text-sm  hover:text-white">About this website</p>
          </Link>
          <Link to="#">
            <p  className="text-gray-400 text-sm  hover:text-white">Want to contribute?</p>
          </Link>
        </div>
      </div>
      <div>
        <div className="w-full mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
      </div>
      <div className="flex justify-between items-center p-4 md:px-32 md:py-10 text-gray-400">
        <p>fsociety © 2025 Genie. All rights reserved.</p>
        <div className="gap-4 flex">
          <FaWhatsapp size={24} />
          <CiMail size={24} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
