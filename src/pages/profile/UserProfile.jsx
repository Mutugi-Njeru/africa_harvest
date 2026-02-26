import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Check } from "lucide-react";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const userId = Number(localStorage.getItem("userId"));
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    msisdn: "",
    password: "",
    description: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_REST_API_URL}/users/v1/${userId}`,
      );
      const userData = response.data.message;
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        msisdn: userData.msisdn,
        password: "", // Don't prefill password
        description: userData.description || "",
      });
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${BASE_REST_API_URL}/users/v1/${userId}`,
        formData,
      );
      toast.success(response.data.message);
      // Refresh user data after update
      await fetchUserDetails();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">User Profile</div>
      </div>

      <div className="bg-white m-5 p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-500"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-500"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-500"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            {/* MSISDN (Phone) */}
            <div className="space-y-2">
              <label
                htmlFor="msisdn"
                className="block text-sm font-medium text-gray-500"
              >
                Phone Number
              </label>
              <input
                id="msisdn"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-500"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (leave blank to keep current)"
                className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Description - Full width */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-500"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 border pl-5 pr-5 p-2 rounded-md ${
                isLoading ? "bg-gray-400" : "bg-saveButton hover:bg-yellowOrange"
              } text-white`}
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Check size={24} />
                  Save Changes
                </>
              )}
            </button> 
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
