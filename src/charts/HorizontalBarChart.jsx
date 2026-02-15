import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Finger Millet", value: 23396 },
  { name: "Sorghum", value: 110928 },
  { name: "Ground Nut", value: 39135 },
  { name: "Pigeon Pea", value: 25421 },
  { name: "Pearl Millet", value: 26428 },
  { name: "Green Gram", value: 86314 },
  { name: "Mechanization", value: 3452 },
  { name: "Poultry", value: 29548 },
  { name: "Aquaculture", value: 97563 },
  { name: "Value Addition", value: 26743 },
  { name: "Cowpea", value: 14409 },
  { name: "Other", value: 24578 },
];

const COLORS = [
  "#4CAF50",
  "#fbb03b",
  "#4CAF50",
  "#fbb03b",
  "#4CAF50",
  "#fbb03b",
  "#4CAF50",
  "#fbb03b",
  "#4CAF50",
  "#fbb03b",
  "#4CAF50",
  "#fbb03b",
];

const HorizontalBarChart = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isMobile, isTablet, isDesktop } = screenSize;

  // Sort data by value for better visualization on mobile
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Limit number of items shown on mobile for better readability
  const displayData = isMobile ? sortedData.slice(0, 8) : sortedData;

  // Responsive configuration
  const getChartConfig = () => {
    if (isMobile) {
      return {
        leftMargin: 80,
        rightMargin: 10,
        topMargin: 10,
        bottomMargin: 20,
        barSize: 15,
        tickFontSize: 10,
        valueFormatter: (value) => {
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value;
        },
        showAllLabels: false,
      };
    }
    if (isTablet) {
      return {
        leftMargin: 90,
        rightMargin: 15,
        topMargin: 15,
        bottomMargin: 20,
        barSize: 20,
        tickFontSize: 11,
        valueFormatter: (value) => {
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value;
        },
        showAllLabels: true,
      };
    }
    return {
      leftMargin: 100,
      rightMargin: 20,
      topMargin: 20,
      bottomMargin: 20,
      barSize: 25,
      tickFontSize: 12,
      valueFormatter: (value) => value.toLocaleString(),
      showAllLabels: true,
    };
  };

  const config = getChartConfig();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="px-2 sm:px-3 pb-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Farmers Subactivities
        </h2>
        {isMobile && (
          <p className="text-xs text-gray-500 mt-1">
            Showing top 8 of {data.length} activities
          </p>
        )}
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={displayData}
            margin={{
              left: config.leftMargin,
              right: config.rightMargin,
              top: config.topMargin,
              bottom: config.bottomMargin,
            }}
          >
            <XAxis 
              type="number" 
              tick={{ 
                fontSize: config.tickFontSize,
                fill: "#6b7280"
              }}
              tickFormatter={config.valueFormatter}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            
            <YAxis
              dataKey="name"
              type="category"
              tick={{ 
                fontSize: config.tickFontSize,
                fill: "#374151",
                fontFamily: "Arial, sans-serif"
              }}
              width={config.leftMargin - 20}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              interval={0}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: isMobile ? "6px 10px" : "8px 12px",
                fontSize: isMobile ? "12px" : "14px"
              }}
              formatter={(value) => [
                `$${value.toLocaleString()}`,
                "Value"
              ]}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            
            <Bar 
              dataKey="value" 
              barSize={config.barSize} 
              radius={[0, 6, 6, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend/Footer for Mobile */}
      {isMobile && (
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#4CAF50] rounded-sm"></div>
            <span>Category A</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#fbb03b] rounded-sm"></div>
            <span>Category B</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalBarChart;