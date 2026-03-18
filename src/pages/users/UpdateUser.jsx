import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Check, X } from "lucide-react";

const UpdateUser = ({ isOpen, onClose, userData, onUserUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        msisdn: userData.msisdn || "",
        password: "",
        description: userData.description || "",
      });
    }
  }, [userData]);

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
        `${BASE_REST_API_URL}/users/v1/${userData.userId}`,
        formData
      );
      toast.success(response.data.message);
      onClose();
      onUserUpdated();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Update User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="update-user-form">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                />
                <button
                  type="button"
                  className="absolute top-8 right-3 flex items-center text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@gmail.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="msisdn"
                  value={formData.msisdn}
                  onChange={handleChange}
                  placeholder="254712345678"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                rows="3"
                required
                placeholder="Enter description"
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex gap-3 p-6 border-t flex-row-reverse">
          <button
            type="submit"
            form="update-user-form"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-saveButton hover:bg-yellowOrange"
            } text-white`}
          >
            {isLoading ? (
              "Updating..."
            ) : (
              <>
                <Check size={20} />
                Update
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-cancelButton text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;