import React from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaUsers, FaSeedling, FaDollarSign, FaChartLine } from "react-icons/fa";

const TopCards = () => {
  const cardData = [
    { icon: FaGlobe, title: "Total Regions", value: "56", color: "text-green-600", delay: 0 },
    { icon: FaUsers, title: "Total Farmers", value: "2,345", color: "text-blue-600", delay: 1 },
    { icon: FaSeedling, title: "Active Crops", value: "128", color: "text-yellow-600", delay: 2 },
    { icon: FaDollarSign, title: "Revenue", value: "$45.6K", color: "text-purple-600", delay: 3 },
    { icon: FaChartLine, title: "Growth Rate", value: "+12.5%", color: "text-red-600", delay: 4 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: card.delay * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
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
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCards;