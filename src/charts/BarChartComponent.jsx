import { Download } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const BarChartComponent = () => {
  // Responsive font sizes based on window width
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;

  // Adjust margins based on screen size
  const getChartMargins = () => {
    if (isMobile) {
      return { top: 5, right: 5, left: 0, bottom: 5 };
    }
    if (isTablet) {
      return { top: 10, right: 10, left: 10, bottom: 5 };
    }
    return { top: 10, right: 30, left: 20, bottom: 5 };
  };

  // Adjust bar size based on screen size
  const getBarSize = () => {
    if (isMobile) return 15;
    if (isTablet) return 20;
    return 30;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-2 sm:mb-4 px-1 sm:px-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Farmers Distribution
        </h2>
        <button className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm">
          <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">Download</span>
        </button>
      </div>

      {/* Chart Container - Takes remaining space */}
      <div className="flex-1 w-full min-h-0" style={{ minHeight: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={getChartMargins()}
            barSize={getBarSize()}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              vertical={false}
            />
            
            <XAxis 
              dataKey="name" 
              tick={{ 
                fontSize: isMobile ? 10 : isTablet ? 11 : 12,
                fill: "#6b7280"
              }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval={isMobile ? 1 : 0}
            />
            
            <YAxis 
              tick={{ 
                fontSize: isMobile ? 10 : isTablet ? 11 : 12,
                fill: "#6b7280"
              }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              width={isMobile ? 35 : 40}
              tickFormatter={(value) => isMobile ? `${value/1000}K` : value}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: isMobile ? "4px 8px" : "8px 12px",
                fontSize: isMobile ? "12px" : "14px"
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            
            <Legend 
              wrapperStyle={{
                fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                paddingTop: "10px"
              }}
              iconSize={isMobile ? 8 : 10}
              verticalAlign="bottom"
              height={36}
            />
            
            <Bar 
              dataKey="pv" 
              fill="#4CAF50" 
              name="PV"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            <Bar 
              dataKey="uv" 
              fill="#fbb03b" 
              name="UV"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;