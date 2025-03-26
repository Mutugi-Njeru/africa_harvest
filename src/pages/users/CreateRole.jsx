import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";

const CreateRole = ({ isOpen, onClose, onRoleCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    description: "",
  });

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
      const response = await axios.post(
        BASE_REST_API_URL + "/security/v1/roles",
        formData
      );
      toast.success(response.data.message);
      setFormData({
        role: "",
        description: "",
      });
      onClose();
      onRoleCreated();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Role creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6  shadow-lg w-[600px]">
        <h2 className="text-lg font-semibold mb-4">Create Role</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Role Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              required
            />
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              rows="3"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
