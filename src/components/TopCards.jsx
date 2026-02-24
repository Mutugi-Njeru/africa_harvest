import React from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaUsers, FaSeedling, FaDollarSign, FaChartLine } from "react-icons/fa";

const TopCards = () => {
  const cardData = [
    { 
      icon: FaGlobe, 
      title: "Total Trainings", 
      value: "76", 
      subtext: "Completed",
      color: "text-green-600", 
      status: "green", // green circle for good status
      delay: 0 
    },
    { 
      icon: FaUsers, 
      title: "Total Farmers", 
      value: "2,345", 
      subtext: '<span class="text-green-600 font-medium">Male: 937 (40%)</span> | <span class="text-yellow-500 font-medium">Female: 1,408 (60%)</span>',
      color: "text-blue-600", 
      status: "green", // green circle for good status
      delay: 1 
    },
    { 
      icon: FaSeedling, 
      title: "VBS/TOT", 
      value: "156", 
      subtext: '<span class="text-green-600 font-medium">Male: 94 (60%)</span> | <span class="text-yellow-500 font-medium">Female: 62 (40%)</span>',
      color: "text-yellow-600", 
      status: "red", // red circle for alert status
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
            {card.status && (
              <div className={`absolute bottom-2 right-3 w-3 h-3 rounded-full ${card.status === 'green' ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCards;