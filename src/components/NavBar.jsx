import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="px-4 xl:px-32 relative border-b-2 shadow-xl bg-white w-full">
      <div className="flex justify-between items-center py-4">
        <a href="/" className="font-bold text-2xl text-[var(--primary)]">
          NERIST.STORE
        </a>

        <div className="hidden md:flex gap-8">
          {["Home", "Categories", "New", "About"].map((item) => (
            <Link
              key={item}
              to={`#${item.toLowerCase()}`}
              className="text-gray-600 hover:text-[var(--primary)]"
            >
              {item}
            </Link>
          ))}
        </div>
        <div>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>

        <div>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>
        {sidebarOpen && <SideBar toggleSidebar={() => setSidebarOpen(false)} />}
      </div>
    </nav>
  );
};

const SideBar = ({}) => {
  return (
    <div className="fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg z-50 p-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="font-bold text-xl">Menu</h2>
        <button></button>
      </div>
      <div className="mt-4 space-y-4">
        {["Home", "Categories", "New", "About"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="block text-gray-700 font-semibold hover:text-blue-500"
            onClick={toggleSidebar}
          >
            {item}
          </Link>
        ))}
        {["Home", "Upload", "Login", "Wishlist"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="block text-gray-700 font-semibold hover:text-blue-500"
            onClick={toggleSidebar}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
