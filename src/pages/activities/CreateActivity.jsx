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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Create Value Chain Type</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="create-activity-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value Chain Type
              </label>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="Enter activity name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                rows="3"
                placeholder="Enter activity description..."
                required
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-white text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>

          <button
            type="submit"
            form="create-activity-form"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-saveButton hover:bg-yellowOrange"
            } text-white`}
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
      </div>
    </div>
  );
};

export default CreateActivity;