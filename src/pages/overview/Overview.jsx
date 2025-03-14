import React, { useState } from "react";
import TopCards from "../../components/TopCards";
import Filters from "../../components/Filters";
import { Download, SlidersHorizontal } from "lucide-react";
import LineChartComponent from "../../charts/LineChartComponent";
import BarChartComponent from "../../charts/BarChartComponent";

const Overview = () => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="ml-5 text-2xl font-bold">Overview</p>
        {/* filter and download button */}
        <div className="flex justify-end items-center mr-5">
          <button
            className="flex items-center cursor-pointer border pl-3 pr-3 p-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="ml-2 mr-2">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </span>
          </button>
          <button className="flex items-center cursor-pointer bg-green-700 text-white pl-4 pr-4 p-2">
            <Download className="w-4 h-4" />
            <span className="ml-2 mr-2">Export</span>
          </button>
        </div>
      </div>
      <Filters showFilters={showFilters} />
      <TopCards />

      <div className="ml-4 mr-4 grid grid-cols-1 lg:grid-cols-3 ">
        {/* Line Chart */}
        <div
          className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 mr-4"
          style={{ minHeight: "40vh" }}
        >
          <LineChartComponent />
        </div>

        {/* Value Chain Pie Chart */}
        <div
          className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex items-center justify-center"
          style={{ minHeight: "40vh" }}
        >
          Pie Chart
        </div>
      </div>

      {/* Market Price Charts Section */}
      <div className="mt-6 ml-4 mr-4 grid grid-cols-1 lg:grid-cols-3">
        {/* Bar Chart */}
        <div
          className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 mr-4"
          style={{ minHeight: "40vh" }}
        >
          <BarChartComponent />
        </div>

        {/* Doughnut Chart */}
        <div
          className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 flex items-center justify-center"
          style={{ minHeight: "40vh" }}
        >
          Gender distribution card
        </div>
      </div>
    </div>
  );
};

export default Overview;
