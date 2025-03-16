import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate the sidebar width based on its expanded state
  const sidebarWidth = isExpanded ? "16rem" : "5rem";

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div
        className="fixed h-full z-50 transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      >
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header */}
        <Header sidebarWidth={sidebarWidth} />
        <div className="mt-20 ml-2 pb-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
