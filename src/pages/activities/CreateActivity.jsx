import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { Check, X } from "lucide-react";

const CreateActivity = ({ isOpen, onClose, onActivityCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const [formData, setFormData] = useState({
    activity: "",
    description: "",
    accountId: accountId,
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
        BASE_REST_API_URL + "/activities/v1/create",
        formData,
      );
      toast.success(response.data.message);
      setFormData({
        activity: "",
        description: "",
        accountId: accountId,
      });
      onClose();
      onActivityCreated();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Activity creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[600px]">
        <h2 className="text-lg font-semibold mb-4">Create Value Chain Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Value Chain Type
            </label>
            <input
              type="text"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              placeholder="Activity Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
              rows="3"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
            >
              <X size={20} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white min-w-[100px] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-saveButton hover:bg-yellowOrange"
              }`}
            >
              {isLoading ? (
                "Creating..."
              ) : (
                <>
                  <Check size={20} />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;
