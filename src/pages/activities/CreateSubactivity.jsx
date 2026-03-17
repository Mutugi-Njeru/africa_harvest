import React, { useEffect, useState } from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import Select from "react-select";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const CreateSubactivity = ({ isOpen, onClose, onSubactivityCreated }) => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const [formData, setFormData] = useState({
    subActivity: "",
    activityId: "",
  });

  useEffect(() => {
    if (accountId) {
      fetchActivities();
    }
  }, [accountId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        subActivity: formData.subActivity,
        activityId: selectedActivity.value,
      };

      const response = await axios.post(
        BASE_REST_API_URL + "/activities/v1/create-subactivity",
        payload,
      );
      toast.success(response.data.message);
      setFormData({
        subActivity: "",
        activityId: "",
      });
      setSelectedActivity(null);
      onClose();
      onSubactivityCreated();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Subactivity creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `activities/v1/all/${accountId}`,
      );
      setActivities(response.data.message);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      toast.error("Failed to fetch activities");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const activityOptions = activities.map((activity) => ({
    value: activity.activityId,
    label: activity.activity,
  }));

  const handleActivityChange = (selectedOption) => {
    setSelectedActivity(selectedOption);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Create Value Chain</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="create-subactivity-form">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value Chain
                </label>
                <input
                  type="text"
                  name="subActivity"
                  value={formData.subActivity}
                  onChange={handleInputChange}
                  placeholder="Enter subactivity name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Value Chain Type
                </label>
                <Select
                  name="activityId"
                  options={activityOptions}
                  value={selectedActivity}
                  onChange={handleActivityChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={CustomFiltersStyles}
                  placeholder="Select value chain type..."
                  required
                />
              </div>
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
            form="create-subactivity-form"
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

export default CreateSubactivity;