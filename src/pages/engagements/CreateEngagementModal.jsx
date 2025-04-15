import React, { useEffect, useState } from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import Select from "react-select";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { hasRolePermission } from "../../utils/Utils";

const CreateEngagementModal = ({ handleCloseModal }) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const accountId = localStorage.getItem("accountId");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  //get all categories
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      setUsers(response.data.message);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  const userOptions = users.map((user) => ({
    value: user.userId,
    label: user.username,
  }));

  const handleUserChange = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Engagement</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource
              </label>
              <input
                type="text"
                name="resource"
                // value={formData.groupName}
                // onChange={handleInputChange}
                placeholder="resource"
                className=" block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="text"
                name="resource"
                // value={formData.groupName}
                // onChange={handleInputChange}
                placeholder="e.g 100"
                className=" block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Manager
              </label>
              <Select
                name="userId"
                options={userOptions}
                onChange={handleUserChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                name="wardId"
                // options={wardOptions}
                // onChange={handleWardChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
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
              //   value={formData.description}
              //   onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              rows="3"
            />
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              //   disabled={isCreating}
            >
              {/* {isCreating ? "Creating" : "Create"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEngagementModal;
