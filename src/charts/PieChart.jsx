import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
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

  // Responsive data with more meaningful values
  const data = {
    labels: ["Male Farmers", "Female Farmers"],
    datasets: [
      {
        data: [60, 40], // Example data values
        backgroundColor: ["#4CAF50", "#fbb03b"],
        hoverBackgroundColor: ["#45a049", "#f59e0b"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: isMobile ? 1 : 2,
      },
    ],
  };

  // Calculate statistics
  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const malePercentage = ((data.datasets[0].data[0] / total) * 100).toFixed(1);
  const femalePercentage = ((data.datasets[0].data[1] / total) * 100).toFixed(1);

  // Responsive options
  const getOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: true,
      cutout: isMobile ? '50%' : '0%',
    };

    if (isMobile) {
      return {
        ...baseOptions,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 9,
                weight: '500',
              },
              boxWidth: 8,
              boxHeight: 8,
              padding: 6,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 10 },
            bodyFont: { size: 9 },
            padding: 4,
            cornerRadius: 4,
          },
        },
      };
    }

    if (isTablet) {
      return {
        ...baseOptions,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 10,
                weight: '500',
              },
              boxWidth: 10,
              boxHeight: 10,
              padding: 8,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 11 },
            bodyFont: { size: 10 },
            padding: 6,
            cornerRadius: 6,
          },
        },
      };
    }

    // Desktop
    return {
      ...baseOptions,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 11,
              weight: '500',
            },
            boxWidth: 12,
            boxHeight: 12,
            padding: 10,
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          padding: 8,
          cornerRadius: 8,
        },
      },
    };
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 px-2 pt-2">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center">
          Gender Distribution
        </h2>
      </div>

      {/* Chart Container - Flexible with max constraints */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-2">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Chart with responsive sizing */}
          <div className="relative" style={{ 
            width: isMobile ? '180px' : isTablet ? '220px' : '280px',
            height: isMobile ? '180px' : isTablet ? '220px' : '280px'
          }}>
            <Pie data={data} options={getOptions()} />
            
            {/* Center Text for Donut Chart (Mobile) */}
            {isMobile && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[8px] font-medium text-gray-500">Total</p>
                  <p className="text-xs font-bold text-green-600">{total}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Summary - Fixed height with flex row */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-2 p-2">
        {/* Male Card */}
        <div className="bg-green-50 rounded-lg p-2 text-center overflow-hidden">
          <p className="text-[10px] sm:text-xs text-gray-600 truncate">Male</p>
          <p className="text-sm sm:text-base font-bold text-green-600 leading-tight">
            {data.datasets[0].data[0]}%
          </p>
          <p className="text-[8px] sm:text-[10px] text-gray-500 truncate">
            {malePercentage}% of total
          </p>
        </div>

        {/* Female Card */}
        <div className="bg-yellow-50 rounded-lg p-2 text-center overflow-hidden">
          <p className="text-[10px] sm:text-xs text-gray-600 truncate">Female</p>
          <p className="text-sm sm:text-base font-bold text-yellow-600 leading-tight">
            {data.datasets[0].data[1]}%
          </p>
          <p className="text-[8px] sm:text-[10px] text-gray-500 truncate">
            {femalePercentage}% of total
          </p>
        </div>
      </div>

      {/* Additional Info - Optional, fixed height */}
      {isDesktop && (
        <div className="flex-shrink-0 pb-2 text-center">
          <p className="text-[10px] text-gray-500 truncate px-2">
            Based on {total}% of total farming population
          </p>
        </div>
      )}
    </div>
  );
};

export default PieChart;