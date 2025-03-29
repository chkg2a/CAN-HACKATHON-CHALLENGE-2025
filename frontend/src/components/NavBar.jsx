import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import "../css/NavBar.css";
import Button from "./Button";

const sections = [
  "Home",
  "Resume-Sender",
  "Notes-Summarizer",
  "About",
];

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="px-8 xl:px-48 relative border-b-2 shadow-xl bg-white w-full">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="font-bold text-2xl text-[var(--primary)]">
          <img src="/images/logo.svg" alt="Logo" className="s-24" />
        </Link>

        <div className="hidden md:flex gap-8">
          {sections.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-gray-600 hover:text-[var(--primary)]"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex">
          <Button
            buttonText="Login"
            primary={true}
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          />
        </div>
        <div className="md:hidden">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-3/4 sm:w-1/2 bg-white h-full p-6 shadow-lg">
            <button
              className="text-gray-600 text-xl mb-4"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
            <nav className="flex flex-col gap-4">
              {sections.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-gray-700 text-lg hover:text-[var(--primary)]"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Button
                buttonText="Login"
                primary={true}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              />
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
