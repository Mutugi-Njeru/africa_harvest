import TopCards from "../../components/TopCards";
import LineChartComponent from "../../charts/LineChartComponent";
import BarChartComponent from "../../charts/BarChartComponent";
import HorizontalBarChart from "../../charts/HorizontalBarChart";
import PieChart from "../../charts/PieChart";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";

const Overview = () => {
  return (
    <div className="p-3 sm:p-4 md:p-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 px-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600">
          Overview
        </div>
      </div>

      {/* Top Cards Section - Now with zero horizontal padding to align with charts */}
      <div className="w-full mb-4 sm:mb-6 px-0">
        <TopCards />
      </div>

      {/* First Row - Line Chart and Farmers Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 px-0">
        {/* Line Chart */}
        <div className="lg:col-span-2 w-full">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <div className="w-full" style={{ minHeight: "300px", height: "40vh", maxHeight: "400px" }}>
              <LineChartComponent />
            </div>
          </div>
        </div>

        {/* Farmers Distribution */}
        <div className="lg:col-span-1 w-full">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full">
            <div className="w-full h-full" style={{ minHeight: "300px", height: "40vh", maxHeight: "400px" }}>
              <HorizontalBarChart />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Bar Chart and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-0">
        {/* Bar Chart */}
        <div className="lg:col-span-2 w-full">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <div className="w-full" style={{ minHeight: "300px", height: "40vh", maxHeight: "400px" }}>
              <BarChartComponent />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-1 w-full">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full">
            <div className="w-full h-full" style={{ minHeight: "300px", height: "40vh", maxHeight: "400px" }}>
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;