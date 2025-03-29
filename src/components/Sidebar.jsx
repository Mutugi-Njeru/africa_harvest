import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ahlogo.png";
import smallLogo from "../assets/smallLogo.png";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp,
  User,
  Landmark,
} from "lucide-react";
import { hasRolePermission } from "../utils/Utils";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isSuperAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleUsersDropdown = () => {
    setUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const handleMenuItemClick = (item) => {
    if (item.hasDropdown) {
      toggleUsersDropdown();
    } else {
      setUsersDropdownOpen(false);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, text: "Overview", path: "/overview" },
    {
      icon: Landmark,
      text: "Accounts",
      path: "/accounts",
      showOnlyForSuperAdmin: true, // Changed from showOnlyForUserId to be more descriptive
    },
    { icon: Users, text: "Users", path: "/users" },
    { icon: Users, text: "Reports", hasDropdown: true },
    { icon: ShoppingCart, text: "Products" },
    { icon: FileText, text: "Orders" },
    { icon: BarChart3, text: "Analytics" },
    { icon: Bell, text: "Notifications" },
    { icon: Settings, text: "Profile", path: "/profile" },
  ];

  const usersDropdownItems = [
    { text: "User List" },
    { text: "Add User" },
    { text: "User Roles" },
  ];

  // Filter menu items - show item if:
  // 1. It doesn't have showOnlyForSuperAdmin flag, OR
  // 2. It has showOnlyForSuperAdmin flag AND user is super admin
  const filteredMenuItems = menuItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isExpanded ? "w-72" : "w-20"
        } border-r transition-all duration-300 ease-in-out relative bg-white`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-center h-20 bg-white">
          {isExpanded ? (
            <img src={logo} alt="Africa Harvest" className="h-16" />
          ) : (
            <img src={smallLogo} alt="Africa Harvest" className="h-12" />
          )}
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-24 bg-green-800 rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-yellowOrange"
        >
          {isExpanded ? (
            <ChevronLeft size={20} className="text-white" />
          ) : (
            <ChevronRight size={20} className="text-white" />
          )}
        </button>
        <div className="px-4 py-3">
          {" "}
          {isExpanded && (
            <span className="ml-3 font-medium text-gray-400">MAIN MENU</span>
          )}
        </div>
        {/* Menu Items */}
        <div className="px-4 py-2">
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  location.pathname === item.path
                    ? "bg-green-700 text-white"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={24} className="min-w-6" />
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.text}</span>
                  )}
                </div>
                {item.hasDropdown && isExpanded && (
                  <div>
                    {isUsersDropdownOpen ? (
                      <ChevronUp
                        size={18}
                        className="text-gray-500 hover:text-white"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="text-gray-500 hover:text-white"
                      />
                    )}
                  </div>
                )}
              </div>
              {/* Dropdown Items with Transition */}
              {item.hasDropdown && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isUsersDropdownOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {usersDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors"
                      >
                        <span className="ml-3 font-medium">
                          {dropdownItem.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
