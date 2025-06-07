import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/Animation.json"; // path to your file
import { motion } from "framer-motion";

const LoginExample = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Animated Background */}
      <div className="md:w-1/2 w-full h-64 md:h-auto relative overflow-hidden bg-black">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center">
            Welcome Back
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Login
          </h2>
          <form className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold"
              type="submit"
            >
              Sign In
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginExample;
