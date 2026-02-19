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
  Globe,
  Network,
  Share2,
  ListChecks,
  GraduationCap, // Added for Trainings icon
} from "lucide-react";
import { hasRolePermission } from "../utils/Utils";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [isLocationsDropdownOpen, setLocationsDropdownOpen] = useState(false);
  const [isTrainingsDropdownOpen, setTrainingsDropdownOpen] = useState(false); // New state for Trainings dropdown
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];

  //roles
  const isSuperAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const isRegionalCoordinator = hasRolePermission(
    userRoles,
    "REGIONAL_CORDINATOR"
  );
  const isCountyCoordinator = hasRolePermission(userRoles, "COUNTY_CORDINATOR");
  const isWardCoordinator = hasRolePermission(userRoles, "WARD_CORDINATOR");
  const isSubCountyCoordinator = hasRolePermission(
    userRoles,
    "SUBCOUNTY_CORDINATOR"
  );

  const navigate = useNavigate();
  const location = useLocation();

  const toggleUsersDropdown = () => {
    setUsersDropdownOpen(!isUsersDropdownOpen);
    // Close other dropdowns
    if (!isUsersDropdownOpen) {
      setLocationsDropdownOpen(false);
      setTrainingsDropdownOpen(false);
    }
  };

  const toggleLocationsDropdown = () => {
    setLocationsDropdownOpen(!isLocationsDropdownOpen);
    // Close other dropdowns
    if (!isLocationsDropdownOpen) {
      setUsersDropdownOpen(false);
      setTrainingsDropdownOpen(false);
    }
  };

  const toggleTrainingsDropdown = () => {
    setTrainingsDropdownOpen(!isTrainingsDropdownOpen);
    // Close other dropdowns
    if (!isTrainingsDropdownOpen) {
      setUsersDropdownOpen(false);
      setLocationsDropdownOpen(false);
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.hasDropdown) {
      if (item.text === "User management") {
        toggleUsersDropdown();
      } else if (item.text === "Locations") {
        toggleLocationsDropdown();
      } else if (item.text === "Trainings") {
        toggleTrainingsDropdown();
      }
    } else {
      setUsersDropdownOpen(false);
      setLocationsDropdownOpen(false);
      setTrainingsDropdownOpen(false);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setUsersDropdownOpen(false);
    setLocationsDropdownOpen(false);
    setTrainingsDropdownOpen(false);
  };

  const menuItems = [
    { icon: LayoutDashboard, text: "Overview", path: "/overview" },
    {
      icon: Landmark,
      text: "Accounts",
      path: "/accounts",
      showOnlyForSuperAdmin: true, // only for super admins
    },
    { icon: Globe, text: "Locations", hasDropdown: true },
    { icon: Users, text: "User management", hasDropdown: true },
    { icon: Network, text: "Groups", path: "/groups" },
    { icon: FileText, text: "Activities", path: "/activity" },
    { icon: GraduationCap, text: "Trainings", hasDropdown: true }, // New Trainings dropdown with GraduationCap icon
    { icon: ListChecks, text: "Summaries" },
    { icon: Settings, text: "Profile", path: "/profile" },
  ];

  const usersDropdownItems = [
    {
      text: "Users",
      path: "/users",
    },
    {
      text: "Regional Coodinator",
      path: "/counties",
      showOnlyForRegionalCoordinator: true,
    },
    {
      text: "County Coordinator",
      path: "/subcounties",
      showOnlyForCountyCoordinator: true,
    },
    { text: "SCounty Coordinator", path: "/wards" },
    { text: "Ward Coordinator", path: "/ward" },
  ];

  // Locations dropdown items
  const locationsDropdownItems = [
    {
      text: "Regions",
      path: "/regions",
    },
  ];

  const trainingsDropdownItems = [
    {
      text: "Engagements",
      path: "/engagements",
    },
     {
      text: "Training",
      path: "/training",
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  // Filter users dropdown items
  const filteredUsersDropdownItems = usersDropdownItems.filter((item) => {
    if (isSuperAdmin) return true;
    if (isAdmin) return true;

    if (isRegionalCoordinator) {
      return (
        item.showOnlyForRegionalCoordinator ||
        (!item.showOnlyForAdmin &&
          !item.showOnlyForCountyCoordinator &&
          item.path !== "/subcounties" &&
          item.path !== "/wards" &&
          item.path !== "/ward")
      );
    }
    if (isCountyCoordinator) {
      return (
        item.showOnlyForCountyCoordinator ||
        (!item.showOnlyForAdmin &&
          !item.showOnlyForRegionalCoordinator &&
          item.path !== "/wards" &&
          item.path !== "/ward")
      );
    }
    if (isSubCountyCoordinator) {
      return item.path === "/wards";
    }
    if (isWardCoordinator) {
      return item.path === "/ward";
    }
    return (
      !item.showOnlyForAdmin &&
      !item.showOnlyForRegionalCoordinator &&
      !item.showOnlyForCountyCoordinator
    );
  });

  // Filter locations dropdown items
  const filteredLocationsDropdownItems = locationsDropdownItems.filter((item) => {
    return true;
  });

  // Filter trainings dropdown items
  const filteredTrainingsDropdownItems = trainingsDropdownItems.filter((item) => {
    // Add any role-based filtering for trainings here if needed
    return true;
  });

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
            <span className="ml-3 font-medium text-gray-400">DASHBOARD</span>
          )}
        </div>
        {/* Menu Items */}
        <div className="px-4 py-2">
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  (!item.hasDropdown && location.pathname === item.path) ||
                  (item.hasDropdown && item.text === "Locations" && isLocationsDropdownOpen) ||
                  (item.hasDropdown && item.text === "User management" && isUsersDropdownOpen) ||
                  (item.hasDropdown && item.text === "Trainings" && isTrainingsDropdownOpen)
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
                    {(item.text === "Locations" && isLocationsDropdownOpen) ||
                    (item.text === "User management" && isUsersDropdownOpen) ||
                    (item.text === "Trainings" && isTrainingsDropdownOpen) ? (
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
              
              {/* Users Dropdown Items */}
              {item.hasDropdown && item.text === "User management" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isUsersDropdownOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {filteredUsersDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleDropdownItemClick(dropdownItem.path)
                        }
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors ${
                          location.pathname === dropdownItem.path
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
                      >
                        <span className="ml-3 font-medium">
                          {dropdownItem.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations Dropdown Items */}
              {item.hasDropdown && item.text === "Locations" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isLocationsDropdownOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {filteredLocationsDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleDropdownItemClick(dropdownItem.path)
                        }
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors ${
                          location.pathname === dropdownItem.path
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
                      >
                        <span className="ml-3 font-medium">
                          {dropdownItem.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trainings Dropdown Items */}
              {item.hasDropdown && item.text === "Trainings" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isTrainingsDropdownOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {filteredTrainingsDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleDropdownItemClick(dropdownItem.path)
                        }
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-green-700 hover:text-white rounded-lg cursor-pointer group transition-colors ${
                          location.pathname === dropdownItem.path
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
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