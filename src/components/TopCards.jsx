import React from "react";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa";

const TopCards = () => {
  return (
    <div className="flex justify-between gap-4 p-5">
      {/* Card 1 */}
      <motion.div
        className="flex-1 rounded-lg shadow-lg p-8 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <FaGlobe size={48} className="text-green-600" />
          <div className="flex flex-col items-end">
            <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total Regions
            </h3>
            <p className="text-yellowOrange font-bold text-4xl">56</p>
          </div>
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        className="flex-1 rounded-lg shadow-lg p-8 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <FaGlobe size={48} className="text-green-600" />
          <div className="flex flex-col items-end">
            <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total Regions
            </h3>
            <p className="text-yellowOrange font-bold text-4xl">56</p>
          </div>
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        className="flex-1 rounded-lg shadow-lg p-8 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <FaGlobe size={48} className="text-green-600" />
          <div className="flex flex-col items-end">
            <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total Regions
            </h3>
            <p className="text-yellowOrange font-bold text-4xl">56</p>
          </div>
        </div>
      </motion.div>

      {/* Card 4 */}
      <motion.div
        className="flex-1 rounded-lg shadow-lg p-8 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 3 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <FaGlobe size={48} className="text-green-600" />
          <div className="flex flex-col items-end">
            <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total Regions
            </h3>
            <p className="text-yellowOrange font-bold text-4xl">56</p>
          </div>
        </div>
      </motion.div>

      {/* Card 5 */}
      <motion.div
        className="flex-1 rounded-lg shadow-lg p-8 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 4 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <FaGlobe size={48} className="text-green-600" />
          <div className="flex flex-col items-end">
            <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total Regions
            </h3>
            <p className="text-yellowOrange font-bold text-4xl">56</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TopCards;
