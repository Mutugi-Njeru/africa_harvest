import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ahlogo2.png";
import smallLogo from "../assets/smallLogo.png";
import liftonLogo from "../assets/1.png";
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
  const [isGeographicDropdownOpen, setGeographicDropdownOpen] = useState(false);
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
      setGeographicDropdownOpen(false);
      setTrainingsDropdownOpen(false);
    }
  };

  const toggleGeographicDropdown = () => {
    setGeographicDropdownOpen(!isGeographicDropdownOpen);
    // Close other dropdowns
    if (!isGeographicDropdownOpen) {
      setUsersDropdownOpen(false);
      setTrainingsDropdownOpen(false);
    }
  };

  const toggleTrainingsDropdown = () => {
    setTrainingsDropdownOpen(!isTrainingsDropdownOpen);
    // Close other dropdowns
    if (!isTrainingsDropdownOpen) {
      setUsersDropdownOpen(false);
      setGeographicDropdownOpen(false);
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.hasDropdown) {
      if (item.text === "User Management") {
        toggleUsersDropdown();
      } else if (item.text === "Geo-Structure") {
        toggleGeographicDropdown();
      } else if (item.text === "Trainings") {
        toggleTrainingsDropdown();
      }
    } else {
      setUsersDropdownOpen(false);
      setGeographicDropdownOpen(false);
      setTrainingsDropdownOpen(false);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setUsersDropdownOpen(false);
    setGeographicDropdownOpen(false);
    setTrainingsDropdownOpen(false);
  };

  // Main menu items (excluding User management, Geographic, and Profile)
  const mainMenuItems = [
    { icon: LayoutDashboard, text: "Overview", path: "/overview" },
    {
      icon: Landmark,
      text: "Accounts",
      path: "/accounts",
      showOnlyForSuperAdmin: true, // only for super admins
    },
    { icon: Network, text: "Groups", path: "/groups" },
    { icon: FileText, text: "Value Chains", path: "/activity" },
    { icon: GraduationCap, text: "Trainings", hasDropdown: true }, // Trainings dropdown with GraduationCap icon
    // { icon: ListChecks, text: "Summaries" },
  ];

  // User management and Geographic section (to be placed after main menu)
  const userSectionItems = [
    { icon: Users, text: "User Management", hasDropdown: true },
    { icon: Globe, text: "Geo-Structure", hasDropdown: true },
  ];

  // Settings section items (moved Profile here)
  const settingsSectionItems = [
    { icon: Settings, text: "Profile", path: "/profile" },
  ];

  const usersDropdownItems = [
    {
      text: "User Profiles",
      path: "/users",
    },
    { text: "Regional EA", path: "/regionalagents" },
    { text: "County EA", path: "/countyagents" },
    { text: "SubCounty EA", path: "/subcountyagents" },
    { text: "Ward EA", path: "/wardagents" },
    // { text: "Members", path: "/ward" },
  ];
  const rolePermissions = {
  SUPER_ADMIN: ['*'], // All items
  ADMIN: ['*'], // All items
  REGIONAL_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents'],
  COUNTY_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents'],
  SUBCOUNTY_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents'],
  WARD_CORDINATOR: ['/ward']
};

  // Geographic dropdown items - moved REA, CEA, and SCEA here with original paths
  const geographicDropdownItems = [
    {
      text: "Regions",
      path: "/regions",
    },
    {
      text: "REA",
      path: "/counties", // Original path unchanged
    },
    {
      text: "CEA",
      path: "/subcounties", // Original path unchanged
    },
    {
      text: "SCEA",
      path: "/wards", // Original path unchanged
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
      {
      text: "Trainers",
      path: "/trainers",
    },
  ];

  const filteredMainMenuItems = mainMenuItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  const filteredUserSectionItems = userSectionItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  const filteredSettingsSectionItems = settingsSectionItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  // Filter users dropdown items
  const filteredUsersDropdownItems = usersDropdownItems.filter((item) => {
  // Get the allowed paths for the user's role
  let allowedPaths = [];
  
  if (isSuperAdmin || isAdmin) {
    allowedPaths = ['*']; // '*' means all items
  } else if (isRegionalCoordinator) {
    allowedPaths = rolePermissions.REGIONAL_CORDINATOR;
  } else if (isCountyCoordinator) {
    allowedPaths = rolePermissions.COUNTY_CORDINATOR;
  } else if (isSubCountyCoordinator) {
    allowedPaths = rolePermissions.SUBCOUNTY_CORDINATOR;
  } else if (isWardCoordinator) {
    allowedPaths = rolePermissions.WARD_CORDINATOR;
  }

  // If allowedPaths includes '*', show all items
  if (allowedPaths.includes('*')) return true;
  
  // Otherwise, check if the item's path is in allowedPaths
  return allowedPaths.includes(item.path);
});

  // Filter geographic dropdown items
  const filteredGeographicDropdownItems = geographicDropdownItems.filter((item) => {
    // Add any role-based filtering for geographic here if needed
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
        } border-r transition-all duration-300 ease-in-out relative bg-gradient-to-b from-green-200 to-white flex flex-col h-screen`}
      >
        {/* Logo Area - Fixed at top */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-20 bg-transparent">
            {isExpanded ? (
              <img src={logo} alt="Africa Harvest" className="h-20 " />
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
              <span className="ml-3 font-medium text-gray-500">ADMIN DASHBOARD</span>
            )}
          </div>
        </div>

        {/* Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Main Menu Items */}
          {filteredMainMenuItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  (!item.hasDropdown && location.pathname === item.path) ||
                  (item.hasDropdown && item.text === "Trainings" && isTrainingsDropdownOpen)
                    ? "bg-green-800 text-white"
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
                    {(item.text === "Trainings" && isTrainingsDropdownOpen) ? (
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
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
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

          {/* Divider with spacing - Configurations Section */}
          {isExpanded && (
            <>
              <div className="my-6 border-t border-gray-300"></div>
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Configurations
                </span>
              </div>
            </>
          )}
          
          {/* User Section Items (User Management and Geo-Structure) */}
          {filteredUserSectionItems.map((item, index) => (
            <div key={`user-${index}`}>
              <div
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  (!item.hasDropdown && location.pathname === item.path) ||
                  (item.hasDropdown && item.text === "User Management" && isUsersDropdownOpen) ||
                  (item.hasDropdown && item.text === "Geo-Structure" && isGeographicDropdownOpen)
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
                    {(item.text === "User Management" && isUsersDropdownOpen) ||
                     (item.text === "Geo-Structure" && isGeographicDropdownOpen) ? (
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
              {item.hasDropdown && item.text === "User Management" && isExpanded && (
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
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
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
              
              {/* Geographic Dropdown Items */}
              {item.hasDropdown && item.text === "Geo-Structure" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isGeographicDropdownOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {filteredGeographicDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleDropdownItemClick(dropdownItem.path)
                        }
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
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

          {/* Divider with spacing - Settings Section */}
          {isExpanded && filteredSettingsSectionItems.length > 0 && (
            <>
              <div className="my-6 border-t border-gray-300"></div>
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Setting
                </span>
              </div>
            </>
          )}

          {/* Settings Section Items (Profile) */}
          {filteredSettingsSectionItems.map((item, index) => (
            <div key={`settings-${index}`}>
              <div
                onClick={() => handleMenuItemClick(item)}
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  location.pathname === item.path ? "bg-green-700 text-white" : ""
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={24} className="min-w-6" />
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.text}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section with Trademark and Logo */}
        <div className="flex-shrink-0 border-t border-gray-300 bg-gradient-to-t from-green-100 to-transparent p-4">
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <>
                <div className="flex items-center space-x-2">
                  <img src={smallLogo} alt="Africa Harvest" className="h-8 w-8" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600 font-medium">Africa Harvest</span>
                    <span className="text-xs text-gray-400">© 2026 All rights reserved</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">™</span>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <img src={smallLogo} alt="Africa Harvest" className="h-8 w-8" />
              </div>
            )}
          </div>
          
          {/* Version number when expanded */}
          {isExpanded && (
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-400">Version 1.0.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;