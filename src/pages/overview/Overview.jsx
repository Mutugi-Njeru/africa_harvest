import React, { useState } from "react";
import TopCards from "../../components/TopCards";
import Filters from "../../components/Filters";
import { Download, SlidersHorizontal } from "lucide-react";
import LineChartComponent from "../../charts/LineChartComponent";
import BarChartComponent from "../../charts/BarChartComponent";
import HorizontalBarChart from "../../charts/HorizontalBarChart";
import PieChart from "../../charts/PieChart";

const Overview = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <div className="flex justify-end items-center">
        {/* filter and download button */}
        <div className="flex justify-end items-center mr-5">
          <button
            className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="ml-2 mr-2">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </span>
          </button>
        </div>
      </div>
      <Filters showFilters={showFilters} />
      <TopCards />

      <div className="ml-4 mr-4 grid grid-cols-1 lg:grid-cols-3">
        {/* Line Chart */}
        <div
          className="lg:col-span-2 bg-white rounded-lg shadow-md pt-4 pr-2 pl-2 mr-4"
          style={{ minHeight: "40vh" }}
        >
          <LineChartComponent />
        </div>

        {/* Farmers Distribution chart */}
        <div
          className="lg:col-span-1 bg-white rounded-lg shadow-md pl-0 pr-2  pb-0 flex items-center justify-center"
          style={{ minHeight: "40vh" }} // Match the height
        >
          <HorizontalBarChart />
        </div>
      </div>

      {/* Market Price Charts Section */}
      <div className="mt-6 ml-4 mr-4 grid grid-cols-1 lg:grid-cols-3">
        {/* Bar Chart */}
        <div
          className="lg:col-span-2 bg-white rounded-lg shadow-md mr-4 pt-4 pr-2 pl-2"
          style={{ minHeight: "40vh" }} // Set the same height as the LineChart
        >
          <BarChartComponent />
        </div>

        {/* Pie Chart */}
        <div
          className="lg:col-span-1 bg-white rounded-lg shadow-md  flex items-center justify-center"
          style={{ minHeight: "40vh" }} // Match the height
        >
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default Overview;
