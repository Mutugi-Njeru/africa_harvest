import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { Check, X } from "lucide-react";

const UpdateGroupDetails = ({ handleCloseModal, group, fetchGroups }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  });

  useEffect(() => {
    if (group) {
      setFormData({
        groupName: group.groupName || "",
        description: group.description || "",
      });
    }
  }, [group]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = {
        groupName: formData.groupName,
        description: formData.description,
        wardId: group.wardId,
      };
      const response = await axios.put(
        `${BASE_REST_API_URL}groups/v1/${group.groupId}`,
        payload,
      );
      toast.success("Group Details Updated Successfully");
      handleCloseModal();
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update group";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-1/3 max-w-[800px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">
            Update {group?.groupName} Details
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="update-group-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Group Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                rows="4"
                placeholder="Enter group description..."
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={handleCloseModal}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-white text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>

          <button
            type="submit"
            form="update-group-form"
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
              isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-saveButton hover:bg-yellowOrange"
            } text-white`}
          >
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                <Check size={20} />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupDetails;