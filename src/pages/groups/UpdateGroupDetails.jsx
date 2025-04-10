import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";

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
        payload
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">
          Update {group?.groupName} Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Group Name"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              rows="3"
            />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGroupDetails;
