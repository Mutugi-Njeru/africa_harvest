import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

// Sample data
const data = [
  { county: "County A", people: 4000, businesses: 2400 },
  { county: "County B", people: 3000, businesses: 1398 },
  { county: "County C", people: 2000, businesses: 9800 },
  { county: "County D", people: 2780, businesses: 3908 },
  { county: "County E", people: 1890, businesses: 4800 },
  { county: "County F", people: 2390, businesses: 3800 },
  { county: "County G", people: 3490, businesses: 4300 },
];

// Custom Tooltip Component with responsive design
const CustomTooltip = ({ active, payload, label, isMobile }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 sm:p-3 border rounded-lg shadow-lg">
        <p className="font-semibold text-xs sm:text-sm">{`County: ${label}`}</p>
        <p className="text-[10px] sm:text-xs text-green-600">{`People: ${payload[0]?.value?.toLocaleString()}`}</p>
        <p className="text-[10px] sm:text-xs text-yellow-600">{`Businesses: ${payload[1]?.value?.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const LineChartComponent = () => {
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

  // Responsive configuration
  const getChartConfig = () => {
    if (isMobile) {
      return {
        margins: { top: 5, right: 5, left: 0, bottom: 5 },
        tickFontSize: 10,
        strokeWidth: 1.5,
        dotSize: 3,
        activeDotSize: 5,
        showGrid: false,
        showLegend: true,
        legendFontSize: '10px',
        yAxisWidth: 35,
        xAxisAngle: -45,
        xAxisHeight: 60,
      };
    }
    if (isTablet) {
      return {
        margins: { top: 10, right: 15, left: 5, bottom: 5 },
        tickFontSize: 11,
        strokeWidth: 2,
        dotSize: 4,
        activeDotSize: 6,
        showGrid: true,
        showLegend: true,
        legendFontSize: '11px',
        yAxisWidth: 40,
        xAxisAngle: -30,
        xAxisHeight: 50,
      };
    }
    return {
      margins: { top: 10, right: 30, left: 20, bottom: 5 },
      tickFontSize: 12,
      strokeWidth: 2.5,
      dotSize: 5,
      activeDotSize: 8,
      showGrid: true,
      showLegend: true,
      legendFontSize: '12px',
      yAxisWidth: 45,
      xAxisAngle: 0,
      xAxisHeight: 30,
    };
  };

  const config = getChartConfig();

  // Format Y-axis values based on screen size
  const formatYAxis = (value) => {
    if (isMobile) {
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value;
    }
    return value.toLocaleString();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-2 sm:mb-4 px-1 sm:px-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Farmers Activities
        </h2>
        <button className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm">
          <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">Download Report</span>
        </button>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={config.margins}
          >
            {/* Grid Lines - Optional on mobile */}
            {config.showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb"
                vertical={false}
                horizontal={true}
              />
            )}
            
            {/* X-Axis with responsive ticks */}
            <XAxis
              dataKey="county"
              tick={{ 
                fontSize: config.tickFontSize,
                fill: "#6b7280",
                angle: config.xAxisAngle,
                textAnchor: config.xAxisAngle < 0 ? "end" : "middle"
              }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              interval={isMobile ? 1 : 0}
              height={config.xAxisHeight}
            />
            
            {/* Y-Axis with formatted values */}
            <YAxis
              tick={{ 
                fontSize: config.tickFontSize,
                fill: "#6b7280"
              }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              width={config.yAxisWidth}
              tickFormatter={formatYAxis}
            />
            
            {/* Tooltip with responsive sizing */}
            <RechartsTooltip 
              content={<CustomTooltip isMobile={isMobile} />}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            
            {/* Legend - Responsive */}
            {config.showLegend && (
              <Legend
                wrapperStyle={{
                  fontSize: config.legendFontSize,
                  paddingTop: isMobile ? '5px' : '10px'
                }}
                iconSize={isMobile ? 8 : 10}
                iconType="circle"
                verticalAlign="bottom"
                height={36}
                layout={isMobile ? "horizontal" : "horizontal"}
                align="center"
              />
            )}
            
            {/* People Line */}
            <Line
              type="monotone"
              dataKey="people"
              stroke="#008000"
              strokeWidth={config.strokeWidth}
              dot={{ 
                r: config.dotSize,
                fill: "#008000",
                strokeWidth: 1,
                stroke: "#fff"
              }}
              activeDot={{ 
                r: config.activeDotSize,
                fill: "#008000",
                stroke: "#fff",
                strokeWidth: 2
              }}
              name="People"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            
            {/* Businesses Line */}
            <Line
              type="monotone"
              dataKey="businesses"
              stroke="#fbb03b"
              strokeWidth={config.strokeWidth}
              dot={{ 
                r: config.dotSize,
                fill: "#fbb03b",
                strokeWidth: 1,
                stroke: "#fff"
              }}
              activeDot={{ 
                r: config.activeDotSize,
                fill: "#fbb03b",
                stroke: "#fff",
                strokeWidth: 2
              }}
              name="Businesses"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Summary Footer */}
      {isMobile && (
        <div className="flex justify-between mt-2 px-2 text-[10px] text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>People</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Businesses</span>
          </div>
          <div>
            Total: {data.reduce((sum, item) => sum + item.people + item.businesses, 0).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChartComponent;