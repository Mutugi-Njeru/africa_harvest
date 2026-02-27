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
    fetchActivities();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Value Chain</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Value Chain
              </label>
              <input
                type="text"
                name="subActivity"
                value={formData.subActivity}
                onChange={handleInputChange}
                placeholder="Subactivity Name"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                required
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700">
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
                required
              />
            </div>
          </div>
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

export default CreateSubactivity;
