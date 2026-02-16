import React, { useState, useEffect } from "react";
import logo from "../../assets/1.png";
import logo1 from "../../assets/ahlogo.png";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const navigate = useNavigate();

  const carouselItems = [
    {
      title: "Our History",
      text: "Africa Harvest's vision of an Africa free of hunger, poverty and malnutrition is being achieved through the use of science and technology, gender-sensitive, appropriate agricultural technologies and innovative institutional approaches to improve the livelihoods of rural communities, particularly smallholder farmers..”.",
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
    <div className="flex flex-col-reverse lg:flex-row h-screen">
      {/* Right Section - Login Form (1/4 width on large screens) */}
      <div className="lg:flex-[1] flex flex-col items-center justify-center p-4 lg:p-0">
        <img src={logo1} alt="Logo" className="h-16 lg:h-20 w-auto mb-4 lg:mb-6" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-600 mb-2">Welcome Back!</h1>
        <p className="font-bold text-gray-400 text-sm lg:text-base">Please Log in to continue.</p>
        <div className="p-4 lg:p-10 w-full max-w-md lg:max-w-none">
          <form
            onSubmit={handleLogin}
            className="flex w-full flex-col space-y-4 lg:space-y-5"
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
              className="rounded-lg bg-yellowOrange py-3 font-bold text-white flex items-center justify-center"
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
          </form>
        </div>
      </div>

      {/* Left Section - Sliders (on bottom for mobile) */}
      <div className="lg:flex-[3] relative h-[40vh] lg:h-full">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-yellowOrange bg-opacity-90"></div>

        {/* Cubes Animation */}
        <CubeAnimation />

        {/* Sliding Carousel */}
        <div className="absolute inset-0 flex items-center justify-center text-white px-4 lg:px-0">
          <div className="overflow-hidden w-full max-w-[800px]">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {carouselItems.map((item, index) => (
                <div key={index} className="min-w-full lg:min-w-[800px] px-4 lg:px-0">
                  <h2 className="text-xl lg:text-2xl text-green-800 font-bold mb-2 lg:mb-4">
                    {item.title}
                  </h2>
                  <p className="text-base lg:text-xl font-bold">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
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

export default Login;