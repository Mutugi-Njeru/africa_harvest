import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaGlobe, 
  FaUsers, 
  FaSeedling, 
  FaDollarSign, 
  FaChartLine,
  FaGraduationCap,
} from "react-icons/fa";
import { BASE_REST_API_URL } from "../service/AuthService";
import axios from "axios";

const TopCards = () => {
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [wardCoordinatorStats, setWardCoordinatorStats] = useState({
    total: 0,
    female: 0,
    male: 0,
    other: 0
  });

  useEffect(() => {
    fetchTrainings();
    fetchWardCoordinators();
  }, []);

  const fetchTrainings = async () => {
    try {
      let url = BASE_REST_API_URL + "/training/v1/trainings/";
      const response = await axios.get(url);
      setTotalTrainings(response.data.message.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } 
  };

  const fetchWardCoordinators = async () => {
    try {
      let url = BASE_REST_API_URL + "/users/v1/ward-coordinators/counts";
      const response = await axios.get(url);
      setWardCoordinatorStats(response.data.message);
    } catch (error) {
      console.error("Error fetching ward coordinators:", error);
    } 
  };

  // Calculate female percentage for VBS/TOT
  const calculateFemalePercentage = () => {
    if (wardCoordinatorStats.total === 0) return 0;
    return (wardCoordinatorStats.female / wardCoordinatorStats.total) * 100;
  };

  // Determine status color based on female percentage
  const getStatusColor = () => {
    const femalePercentage = calculateFemalePercentage();
    if (femalePercentage >= 50) return 'bg-green-500';
    if (femalePercentage === 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Create cardData inside the component or as a function that accesses state
  const cardData = [
    { 
      icon: FaGraduationCap,
      title: "Total Trainings", 
      value: totalTrainings.toLocaleString(),
      subtext: "Completed",
      color: "text-green-600", 
      status: "green",
      delay: 0 
    },
    { 
      icon: FaUsers, 
      title: "Total Farmers", 
      value: "2,345", 
      subtext: '<span class="text-green-600 font-normal">Male: 937 (40%)</span> | <span class="text-yellow-500 font-normal">Female: 1,408 (60%)</span>',
      color: "text-blue-600", 
      status: "green",
      delay: 1 
    },
    { 
      icon: FaSeedling, 
      title: "VBS/TOT", 
      value: wardCoordinatorStats.total.toString(),
      subtext: `<span class="text-green-600 font-normal">Male: ${wardCoordinatorStats.male} (${wardCoordinatorStats.total > 0 ? Math.round((wardCoordinatorStats.male/wardCoordinatorStats.total)*100) : 0}%)</span> | <span class="text-yellow-500 font-normal">Female: ${wardCoordinatorStats.female} (${wardCoordinatorStats.total > 0 ? Math.round((wardCoordinatorStats.female/wardCoordinatorStats.total)*100) : 0}%)</span>`,
      color: "text-yellow-600", 
      useDynamicStatus: true, // Flag to use dynamic status
      delay: 2 
    },
    { 
      icon: FaDollarSign, 
      title: "Revenue", 
      value: "$45.6K", 
      color: "text-purple-600", 
      delay: 3 
    },
    { 
      icon: FaChartLine, 
      title: "Growth Rate", 
      value: "+12.5%", 
      color: "text-red-600", 
      delay: 4 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        
        // Determine status circle color
        let statusColor = card.status;
        if (card.useDynamicStatus) {
          statusColor = getStatusColor();
        } else {
          statusColor = card.status === 'green' ? 'bg-green-500' : 'bg-red-500';
        }

        return (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: card.delay * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.color.replace('text', 'bg')} bg-opacity-10`}>
                  <IconComponent size={24} className={`sm:w-7 sm:h-7 ${card.color}`} />
                </div>
                <div className="text-right">
                  <h3 className="text-xs sm:text-sm text-gray-500 font-medium">
                    {card.title}
                  </h3>
                  <p className={`font-bold text-base sm:text-lg md:text-xl ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              </div>
              
              {card.subtext && (
                <div className="mt-1 pt-2 border-t border-gray-100">
                  <p 
                    className="text-xs text-gray-500"
                    dangerouslySetInnerHTML={{ __html: card.subtext }}
                  />
                </div>
              )}
            </div>
            
            {/* Status circle at bottom right */}
            <div className={`absolute bottom-2 right-3 w-3 h-3 rounded-full ${statusColor} shadow-sm`} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCards;