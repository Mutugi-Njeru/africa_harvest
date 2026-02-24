import React, { useState, useEffect } from "react";
import logo from "../../assets/1.png";
import logo1 from "../../assets/ahlogo2.png";
import Farm from "../../assets/farm2.jpg";
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
  saveLoggedinUser,
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
      title: "Our History",
      text: "Africa Harvest's vision of an Africa free of hunger, poverty and malnutrition is being achieved through the use of science and technology, gender-sensitive, appropriate agricultural technologies and innovative institutional approaches to improve the livelihoods of rural communities, particularly smallholder farmers..",
    },
    {
      title: "Our Vision",
      text: "Our mission to disseminate appropriate innovative agricultural technologies and institution approaches through the whole value chain to improve the livelihoods of rural communities..",
    },
    {
      title: "Our Values",
      text: "Our vision is premised on using tools agricultural science and technological innovations and strategic partnerships with grassroots communities, governments, research institutions, public/private sector and development partners at different levels to create sustainable life-changing impact and developing working models based on crop value chains, which could be shared widely to further scale up the impact..",
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
       saveLoggedinUser(auth);
      firstName(response.data.message.user.firstName);
      storeRoles(JSON.stringify(response.data.message.user.roles));
      permissions(JSON.stringify(response.data.message.user.permissions));
      storeUserId(response.data.message.user.userId);
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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section - Background Image with Carousel */}
      <div className="w-full md:w-1/2 h-[300px] md:h-screen relative order-2 md:order-1">
        <div
          className="absolute inset-0 bg-cover bg-center md:rounded-tr-3xl md:rounded-bl-3xl m-0 md:m-2"
          style={{
            backgroundImage: `url(${Farm})`,
          }}
        >
          {/* Overlay with yellow-orange tint */}
          <div className="absolute inset-0 bg-yellowOrange bg-opacity-50 md:rounded-tr-3xl md:rounded-bl-3xl flex items-center justify-center overflow-hidden"></div>

          {/* Cubes Animation - hidden on mobile if too heavy, optional */}
          <div className="hidden md:block">
            <CubeAnimation />
          </div>

          {/* Sliding Carousel */}
          <div className="absolute inset-0 flex items-center justify-center text-white p-4 md:p-10">
            <div className="overflow-hidden w-full max-w-[300px] sm:max-w-[500px] md:max-w-[800px]">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="min-w-full px-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-green-800 font-bold text-center md:text-left">
                      {item.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-xl font-semibold break-words whitespace-normal text-center md:text-left">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation Icons */}
              <div className="flex justify-center mt-4 md:mt-6 space-x-2">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                      currentIndex === index ? "bg-white" : "bg-green-800"
                    }`}
                    aria-label={`Go to item ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 order-1 md:order-2">
        <div className="flex justify-center w-full mb-2 sm:mb-8">
          <img 
            src={logo1} 
            alt="Logo" 
            className="h-20 sm:h-20 md:h-24 lg:h-32 w-auto" 
          />
        </div>
        
        <div className="sm:p-6 md:p-8 lg:p-2 w-full">
          <form
            onSubmit={handleLogin}
            className="flex w-full max-w-sm sm:max-w-md mx-auto flex-col space-y-4 sm:space-y-5"
          >
            <div>
              <div className="relative mt-2 w-full">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-xs sm:text-sm text-gray-900 focus:border-liftonGreen focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-xs sm:text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-green-600"
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
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-xs sm:text-sm text-gray-900 focus:border-liftonGreen focus:outline-none focus:ring-0"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-xs sm:text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-green-600"
                >
                  Enter Your Password
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="rounded-lg bg-yellowOrange py-2.5 sm:py-3 px-4 font-bold text-white flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Forgot Password Link - Small font, aligned right */}
            <div className="flex justify-end mt-1 sm:mt-2">
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 hover:text-liftonBlue hover:underline"
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