import React, { useState, useEffect } from "react";
import logo from "../../assets/ahlogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CubeAnimation from "./CubeAnimation";
import { hasPermission } from "../../utils/Utils";
import {
  accountId,
  accountName,
  coordinator,
  firstName,
  loginUser,
  logout,
  permissions,
  storeRoles,
  storeSuperAdmin,
  storeToken,
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
      firstName(response.data.message.user.firstName); // store user's first name
      coordinator(response.data.message.user.coordinator); // store user's coordinator status
      storeRoles(JSON.stringify(response.data.message.user.roles)); // store user's roles
      permissions(JSON.stringify(response.data.message.user.permissions)); // store user's permissions
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
      {/* Right Section - Login Form (1/4 width) */}
      <div className="flex-[1] flex flex-col items-center justify-center">
        <img src={logo} alt="Logo" className="h-20 w-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-600 mb-2">Welcome Back!</h1>
        <p className="font-bold text-gray-400">Please Log in to continue.</p>
        <div className="p-10 w-full">
          <form
            onSubmit={handleLogin}
            className="flex w-full max-w-md flex-col space-y-5"
          >
            <div>
              <div className="relative mt-2 w-full">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-yellow-600 focus:outline-none focus:ring-0"
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
                  className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-yellow-600 focus:outline-none focus:ring-0"
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
              className="rounded-lg bg-green-800 py-3 font-bold text-white flex items-center justify-center"
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

      {/* Left Section */}
      <div className="flex-[3] relative">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-yellowOrange bg-opacity-90"></div>

        {/* Cubes Animation */}
        <CubeAnimation />

        {/* Sliding Carousel */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="overflow-hidden w-[800px]">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 800}px)`,
              }}
            >
              {carouselItems.map((item, index) => (
                <div key={index} className="min-w-[800px]">
                  <h2 className="text-2xl text-green-800 font-bold">
                    {item.title}
                  </h2>
                  <p className="text-xl font-bold">{item.text}</p>
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
