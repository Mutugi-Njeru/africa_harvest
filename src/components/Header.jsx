import React, { useState, useEffect, useRef } from "react";
import { Smile, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../service/AuthService";
import { nav } from "framer-motion/client";

const Header = ({ sidebarWidth }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const firstName = localStorage.getItem("firstName");
  const accountName = localStorage.getItem("accountName");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="fixed top-0 shadow-sm bg-white border-b p-3 z-40"
      style={{
        left: sidebarWidth,
        right: 0,
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-center pl-2">
          <h1 className="font-semibold text-2xl text-gray-800">
            {accountName}
          </h1>{" "}
        </div>
        <div className="items-center">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <Smile
                size={30}
                className="rounded-full mr-2 text-white bg-yellowOrange"
              />
              <p className="mr-2">{firstName}</p>
              <ChevronDown size={16} className="text-gray-500" />{" "}
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1 px-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={handleProfile}
                    className="block w-full px-4 py-2 text-sm text-gray-700  hover:bg-green-600 hover:text-white"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-600 hover:text-white"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
