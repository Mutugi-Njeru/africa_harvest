import React, { useEffect, useState } from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import Select from "react-select";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";

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
        payload
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
        BASE_REST_API_URL + `activities/v1/all/${accountId}`
      );
      console.log(response.data.message);
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
        <h2 className="text-lg font-semibold mb-4">Create Subactivity</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subactivity Name
              </label>
              <input
                type="text"
                name="subActivity"
                value={formData.subActivity}
                onChange={handleInputChange}
                placeholder="Subactivity Name"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Select Activity
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
          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubactivity;
