import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ahlogo2.png";
import smallLogo from "../assets/smallLogo.png";
import leaf from "../assets/leaf.png";
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
  GraduationCap,
  BookOpen,
  UserCog,
} from "lucide-react";
import { hasRolePermission } from "../utils/Utils";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [isUserProfilesDropdownOpen, setUserProfilesDropdownOpen] = useState(false);
  const [isGeoLocationDropdownOpen, setGeoLocationDropdownOpen] = useState(false);
  const [isTrainingsDropdownOpen, setTrainingsDropdownOpen] = useState(false);
  const [isEducationDropdownOpen, setEducationDropdownOpen] = useState(false);

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
    // Close other main dropdowns
    if (!isUsersDropdownOpen) {
      setTrainingsDropdownOpen(false);
      setEducationDropdownOpen(false);
    }
  };

  const toggleUserProfilesDropdown = (e) => {
    e.stopPropagation();
    setUserProfilesDropdownOpen(!isUserProfilesDropdownOpen);
    if (!isUserProfilesDropdownOpen) {
      setGeoLocationDropdownOpen(false);
    }
  };

  const toggleGeoLocationDropdown = (e) => {
    e.stopPropagation();
    setGeoLocationDropdownOpen(!isGeoLocationDropdownOpen);
    if (!isGeoLocationDropdownOpen) {
      setUserProfilesDropdownOpen(false);
    }
  };

  const toggleTrainingsDropdown = () => {
    setTrainingsDropdownOpen(!isTrainingsDropdownOpen);
    // Close other main dropdowns
    if (!isTrainingsDropdownOpen) {
      setUsersDropdownOpen(false);
      setEducationDropdownOpen(false);
    }
  };

  const toggleEducationDropdown = () => {
    setEducationDropdownOpen(!isEducationDropdownOpen);
    // Close other main dropdowns
    if (!isEducationDropdownOpen) {
      setUsersDropdownOpen(false);
      setTrainingsDropdownOpen(false);
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.hasDropdown) {
      if (item.text === "User Management") {
        toggleUsersDropdown();
      } else if (item.text === "Trainings") {
        toggleTrainingsDropdown();
      } else if (item.text === "Education") {
        toggleEducationDropdown();
      }
    } else {
      setUsersDropdownOpen(false);
      setUserProfilesDropdownOpen(false);
      setGeoLocationDropdownOpen(false);
      setTrainingsDropdownOpen(false);
      setEducationDropdownOpen(false);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    // Keep the main dropdown open but close nested dropdowns
    setUserProfilesDropdownOpen(false);
    setGeoLocationDropdownOpen(false);
  };

  // Main menu items in new order: Overview, Accounts, User Management, Trainings, Education, Groups, Value Chains
  const mainMenuItems = [
    { icon: LayoutDashboard, text: "Overview", path: "/overview" },
    {
      icon: Landmark,
      text: "Accounts",
      path: "/accounts",
      showOnlyForSuperAdmin: true,
    },
    { icon: Users, text: "User Management", hasDropdown: true },
    { icon: GraduationCap, text: "Trainings", hasDropdown: true },
    { icon: BookOpen, text: "Education", hasDropdown: true },
    { icon: Network, text: "Groups", path: "/groups" },
    { icon: FileText, text: "Value Chains", path: "/activity" },
  ];

  // Settings section items
  const settingsSectionItems = [
    { icon: Settings, text: "Profile", path: "/profile" },
  ];

  // User Profiles dropdown items
  const userProfilesDropdownItems = [
    {
      text: "Users",
      path: "/users",
    },
    { text: "Regional EA", path: "/regionalagents" },
    { text: "County EA", path: "/countyagents" },
    { text: "SubCounty EA", path: "/subcountyagents" },
    { text: "Ward EA", path: "/wardagents" },
  ];

  // Geo-Location dropdown items
  const geoLocationDropdownItems = [
    {
      text: "Regions",
      path: "/regions",
    },
    {
      text: "REA",
      path: "/counties",
    },
    {
      text: "CEA",
      path: "/subcounties",
    },
    {
      text: "SCEA",
      path: "/wards",
    },
  ];

  const rolePermissions = {
    SUPER_ADMIN: ['*'],
    ADMIN: ['*'],
    REGIONAL_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents', '/regions', '/counties', '/subcounties', '/wards'],
    COUNTY_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents', '/regions', '/counties', '/subcounties', '/wards'],
    SUBCOUNTY_CORDINATOR: ['/users', '/regionalagents', '/countyagents', '/subcountyagents', '/wardagents', '/regions', '/counties', '/subcounties', '/wards'],
    WARD_CORDINATOR: ['/ward']
  };

  const trainingsDropdownItems = [
    {
      text: "Training",
      path: "/training",
    },
  ];

  const EducationDropdownItems = [
    {
      text: "Courses & Modules",
      path: "/courses",
    }
  ];

  const filteredMainMenuItems = mainMenuItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  const filteredSettingsSectionItems = settingsSectionItems.filter(
    (item) => !item.showOnlyForSuperAdmin || isSuperAdmin
  );

  // Filter user profiles dropdown items
  const filteredUserProfilesDropdownItems = userProfilesDropdownItems.filter((item) => {
    let allowedPaths = [];
    
    if (isSuperAdmin || isAdmin) {
      allowedPaths = ['*'];
    } else if (isRegionalCoordinator) {
      allowedPaths = rolePermissions.REGIONAL_CORDINATOR;
    } else if (isCountyCoordinator) {
      allowedPaths = rolePermissions.COUNTY_CORDINATOR;
    } else if (isSubCountyCoordinator) {
      allowedPaths = rolePermissions.SUBCOUNTY_CORDINATOR;
    } else if (isWardCoordinator) {
      allowedPaths = rolePermissions.WARD_CORDINATOR;
    }

    if (allowedPaths.includes('*')) return true;
    return allowedPaths.includes(item.path);
  });

  // Filter geo-location dropdown items
  const filteredGeoLocationDropdownItems = geoLocationDropdownItems.filter((item) => {
    let allowedPaths = [];
    
    if (isSuperAdmin || isAdmin) {
      allowedPaths = ['*'];
    } else if (isRegionalCoordinator) {
      allowedPaths = rolePermissions.REGIONAL_CORDINATOR;
    } else if (isCountyCoordinator) {
      allowedPaths = rolePermissions.COUNTY_CORDINATOR;
    } else if (isSubCountyCoordinator) {
      allowedPaths = rolePermissions.SUBCOUNTY_CORDINATOR;
    } else if (isWardCoordinator) {
      allowedPaths = rolePermissions.WARD_CORDINATOR;
    }

    if (allowedPaths.includes('*')) return true;
    return allowedPaths.includes(item.path);
  });

  // Filter trainings dropdown items
  const filteredTrainingsDropdownItems = trainingsDropdownItems.filter((item) => {
    return true;
  });

  // Filter Education dropdown items
  const filteredEducationDropdownItems = EducationDropdownItems.filter((item) => {
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
              <img src={leaf} alt="Africa Harvest" className="h-12" />
            )}
          </div>
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-24 bg-green-700 rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-yellowOrange"
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
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 text-sm hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors ${
                  (!item.hasDropdown && location.pathname === item.path) ||
                  (item.hasDropdown && item.text === "User Management" && isUsersDropdownOpen) ||
                  (item.hasDropdown && item.text === "Trainings" && isTrainingsDropdownOpen) ||
                  (item.hasDropdown && item.text === "Education" && isEducationDropdownOpen)
                    ? "bg-green-800 text-white"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={18} className="min-w-6" />
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.text}</span>
                  )}
                </div>
                {item.hasDropdown && isExpanded && (
                  <div>
                    {(item.text === "User Management" && isUsersDropdownOpen) ||
                     (item.text === "Trainings" && isTrainingsDropdownOpen) ||
                     (item.text === "Education" && isEducationDropdownOpen) ? (
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
              
              {/* User Management Dropdown Content */}
              {item.hasDropdown && item.text === "User Management" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isUsersDropdownOpen ? "max-h-[800px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-4">
                    {/* User Profiles Section with its own dropdown */}
                    <div className="mb-2">
                      <div
                        onClick={toggleUserProfilesDropdown}
                        className="flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-sm"
                      >
                        <div className="flex items-center">
                          <User size={16} className="min-w-4" />
                          <span className="ml-3 font-medium">User Profiles</span>
                        </div>
                        <div>
                          {isUserProfilesDropdownOpen ? (
                            <ChevronUp size={16} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {/* User Profiles Dropdown Items */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isUserProfilesDropdownOpen ? "max-h-[400px]" : "max-h-0"
                        }`}
                      >
                        <div className="ml-6 mt-1">
                          {filteredUserProfilesDropdownItems.map((profileItem, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleDropdownItemClick(profileItem.path)
                              }
                              className={`flex items-center py-2 px-3 mb-1 text-gray-600 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-xs ${
                                location.pathname === profileItem.path
                                  ? "bg-green-700 text-white"
                                  : ""
                              }`}
                            >
                              <span className="ml-3 font-normal">
                                {profileItem.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Geo-Location Section with its own dropdown */}
                    <div className="mb-2">
                      <div
                        onClick={toggleGeoLocationDropdown}
                        className="flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-sm"
                      >
                        <div className="flex items-center">
                          <UserCog size={16} className="min-w-4" />
                          <span className="ml-3 font-medium">Role Assignment</span>
                        </div>
                        <div>
                          {isGeoLocationDropdownOpen ? (
                            <ChevronUp size={16} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {/* Geo-Location Dropdown Items */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isGeoLocationDropdownOpen ? "max-h-[400px]" : "max-h-0"
                        }`}
                      >
                        <div className="ml-6 mt-1">
                          {filteredGeoLocationDropdownItems.map((geoItem, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleDropdownItemClick(geoItem.path)
                              }
                              className={`flex items-center py-2 px-3 mb-1 text-gray-600 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-xs ${
                                location.pathname === geoItem.path
                                  ? "bg-green-700 text-white"
                                  : ""
                              }`}
                            >
                              <span className="ml-3 font-normal">
                                {geoItem.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-sm ${
                          location.pathname === dropdownItem.path
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
                      >
                        <span className="ml-3 font-normal">
                          {dropdownItem.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Dropdown Items */}
              {item.hasDropdown && item.text === "Education" && isExpanded && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isEducationDropdownOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-8">
                    {filteredEducationDropdownItems.map((dropdownItem, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleDropdownItemClick(dropdownItem.path)
                        }
                        className={`flex items-center py-2 px-3 mb-1 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-xs ${
                          location.pathname === dropdownItem.path
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
                      >
                        <span className="ml-3 font-normal">
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
                className={`flex items-center justify-between py-3 px-3 mb-2 text-gray-700 hover:bg-[#eadf99] hover:text-white rounded-lg cursor-pointer group transition-colors text-sm ${
                  location.pathname === item.path ? "bg-green-700 text-white" : ""
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={18} className="min-w-6" />
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
                  <img src={leaf} alt="Africa Harvest" className="h-8 w-8" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600 font-medium">Africa Harvest</span>
                    <span className="text-xs text-gray-400">© 2026 All rights reserved</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">™</span>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <img src={leaf} alt="Africa Harvest" className="h-8 w-8" />
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