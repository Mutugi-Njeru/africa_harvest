import React, { useState, useEffect } from "react";
import logo from "../../assets/1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CubeAnimation from "./CubeAnimation";
import { hasPermission } from "../../utils/Utils";
import {
  accountId,
  accountName,
  firstName,
  loginUser,
  logout,
  permissions,
  storeRoles,
  storeSuperAdmin,
  storeToken,
  storeUserId,
} from "../../service/AuthService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountModal from "./AccountModal";

const LoginExample = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigate = useNavigate();

  const carouselItems = [
    {
      title: "Our Mission",
      text: "To be the leading provider of Research and Training Services related to economic growth and development in all sectors.",
    },
    {
      title: "Our Vision",
      text: "To improve on data quality through capacity building of other organization, evidence based research and trainings.",
    },
    {
      title: "Our Values",
      text: "We are a Partner driven organization. We exist interdependently with organizations that we serve across Africa.",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  async function handleLogin(e) {
    e.preventDefault();
    logout();
    const auth = btoa(username + ":" + password);
    setLoading(true);

    try {
      const response = await loginUser(auth);
      const token = "Bearer " + response.data.message.token;
      storeToken(token);
      firstName(response.data.message.user.firstName); // store user's first name
      // coordinator(response.data.message.user.coordinator); // store user's coordinator status
      storeRoles(JSON.stringify(response.data.message.user.roles)); // store user's roles
      permissions(JSON.stringify(response.data.message.user.permissions)); // store user's permissions
      storeUserId(response.data.message.user.userId); // store userId
      const user = response.data.message.user.roles[0];
      if (user === "SUPER_ADMIN") {
        setShowAccountModal(true);
      } else {
        accountId(response.data.message.user.accountId);
        accountName(response.data.message.user.account);
        toast.success("Login successful");
        navigate("/overview");
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Background Image with Carousel (50% width) */}
      <div className="w-1/2 relative">
        {/* Background Image from Online */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-tr-3xl rounded-bl-3xl m-2"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80)",
          }}
        >
          {/* Overlay with blue tint */}
          <div className="absolute inset-0 bg-liftonBlue bg-opacity-80 rounded-tr-3xl rounded-bl-3xl flex items-center justify-center overflow-hidden"></div>

          {/* Cubes Animation */}
          <CubeAnimation />

          {/* Sliding Carousel */}

          <div className="absolute inset-0 flex items-center justify-center text-white m-10">
            <div className="overflow-hidden w-[800px]">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 800}px)`,
                }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="min-w-[800px]">
                    <h2 className="text-3xl text-lime-500 font-bold">
                      {item.title}
                    </h2>
                    <p className="text-xl font-light break-words whitespace-normal max-w-[750px]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form (50% width) */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        <img src={logo} alt="Logo" className="h-32 w-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-600 mb-2">Welcome Back!</h1>
        <p className="font-bold text-gray-400">Please Log in to continue.</p>
        <div className="p-10 w-full">
          <form
            onSubmit={handleLogin}
            className="flex w-full max-w-md flex-col space-y-5 mx-auto"
          >
            <div>
              <div className="relative mt-2 w-full">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-liftonGreen focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-green-600"
                >
                  Enter Your Username
                </label>
              </div>
            </div>

            <div>
              <div className="relative mt-2 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-liftonGreen focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-green-600"
                >
                  Enter Your Password
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="rounded-lg bg-liftonBlue py-3 font-bold text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-2">
              <a
                href="#"
                className="text-lg font-semibold text-gray-500 hover:text-liftonBlue"
              >
                Forgot Password?{" "}
                <span className="text-liftonGreen">Click here</span>
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Account Selection Modal */}
      <AccountModal
        showAccountModal={showAccountModal}
        setShowAccountModal={setShowAccountModal}
      />
    </div>
  );
};

export default LoginExample;
