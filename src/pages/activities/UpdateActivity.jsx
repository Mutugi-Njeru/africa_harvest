import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const UpdateActivity = ({ isOpen, onClose, activity, fetchActivities }) => {
  const accountId = parseInt(localStorage.getItem("accountId"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    activity: "",
    description: "",
    accountId: accountId,
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        activity: activity.activity || "",
        description: activity.description || "",
        accountId: accountId,
      });
    }
  }, [activity, accountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(
        `${BASE_REST_API_URL}/activities/v1/${activity.activityId}`,
        formData,
      );
      toast.success("Activity Updated Successfully");
      onClose();
      fetchActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[600px]">
        <h2 className="text-lg font-semibold mb-4">Update Value Chain Type</h2>
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
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white min-w-[100px] ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-saveButton hover:bg-yellowOrange"
              }`}
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Check size={20} />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateActivity;
