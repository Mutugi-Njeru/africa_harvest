import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { BASE_REST_API_URL } from "../service/AuthService";
import { toast } from "react-toastify";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const accountId = localStorage.getItem("accountId");
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(BASE_REST_API_URL + `/summary/v1/accounts/${accountId}`);
      setAccounts(response.data.message);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, []);

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

  // Use actual data from API response
  const maleMembers = accounts?.maleMembers || 0;
  const femaleMembers = accounts?.femaleMembers || 0;
  const totalMembers = accounts?.totalMembers || 0;

  // Responsive data with actual values
  const data = {
    labels: ["Male Farmers", "Female Farmers"],
    datasets: [
      {
        data: [maleMembers, femaleMembers],
        backgroundColor: ["#4CAF50", "#fbb03b"],
        hoverBackgroundColor: ["#45a049", "#f59e0b"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: isMobile ? 1 : 2,
      },
    ],
  };

  // Calculate statistics
  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const malePercentage = total > 0 ? ((maleMembers / total) * 100).toFixed(1) : 0;
  const femalePercentage = total > 0 ? ((femaleMembers / total) * 100).toFixed(1) : 0;

  // Responsive options
  const getOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: true,
      cutout: isMobile ? '50%' : '0%',
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };

    if (isMobile) {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
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
            ...baseOptions.plugins.tooltip,
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
          ...baseOptions.plugins,
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
            ...baseOptions.plugins.tooltip,
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
        ...baseOptions.plugins,
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
          ...baseOptions.plugins.tooltip,
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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  // Show message if no data
  if (total === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2">
          Gender Distribution
        </h2>
        <div className="text-gray-500 text-sm">No member data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 px-2 pb-2">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center">
          Gender Distribution
        </h2>
      </div>

      {/* Chart Container - Flexible with max constraints */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-2 pt-2">
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
                  <p className="text-xs font-bold text-green-600">{total}</p>
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
            {maleMembers}
          </p>
          <p className="text-[8px] sm:text-[10px] text-gray-500 truncate">
            {malePercentage}% of total
          </p>
        </div>

        {/* Female Card */}
        <div className="bg-yellow-50 rounded-lg p-2 text-center overflow-hidden">
          <p className="text-[10px] sm:text-xs text-gray-600 truncate">Female</p>
          <p className="text-sm sm:text-base font-bold text-yellow-600 leading-tight">
            {femaleMembers}
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
            Based on {total} total member{total !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default PieChart;