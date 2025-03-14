import React from "react";
import { motion } from "framer-motion";

const TopCards = () => {
  return (
    <div className="flex justify-between gap-4 p-5">
      {/* Card 1 */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">Card 1</h3>
        <p className="text-gray-600">This is the content for card 1.</p>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">Card 2</h3>
        <p className="text-gray-600">This is the content for card 2.</p>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 2 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">Card 3</h3>
        <p className="text-gray-600">This is the content for card 3.</p>
      </motion.div>

      {/* Card 4 */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 3 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">Card 4</h3>
        <p className="text-gray-600">This is the content for card 4.</p>
      </motion.div>

      {/* Card 5 */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 4 * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-xl font-bold mb-2">Card 5</h3>
        <p className="text-gray-600">This is the content for card 5.</p>
      </motion.div>
    </div>
  );
};

export default TopCards;
