import React, { useEffect, useState } from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import Select from "react-select";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { hasRolePermission } from "../../utils/Utils";
import { toast } from "react-toastify";

const CreateEngagementModal = ({ handleCloseModal, fetchEngagements }) => {
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const accountId = localStorage.getItem("accountId");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    resource: "",
    description: "",
    quantity: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  //predefined categories
  const categories = [
    { value: "Training", label: "Training" },
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" },
    { value: "Seed Distribution", label: "Seed Distribution" },
    { value: "Equipment Distribution", label: "Equipment Distribution" },
    { value: "Fertilizer Distribution", label: "Fertilizer Distribution" },
    { value: "Technical Support", label: "Technical Support" },
    { value: "Advisory Service", label: "Advisory Service" },
    { value: "Consultancy", label: "Consultancy" },
    { value: "Funding", label: "Funding" },
    { value: "Loan", label: "Loan" },
    { value: "Grant", label: "Grant" },
    { value: "Market Linkage", label: "Market Linkage" },
    { value: "Product Promotion", label: "Product Promotion" },
    { value: "Exhibition", label: "Exhibition" },
    { value: "Meeting", label: "Meeting" },
    { value: "Field Visit", label: "Field Visit" },
    { value: "Survey", label: "Survey" },
    { value: "Other", label: "Other" },
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //create engagement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        userId: selectedUser.value,
        category: selectedCategory.value,
        quantity: parseInt(formData.quantity),
      };

      const response = await axios.post(
        BASE_REST_API_URL + "/engagements/v1/create",
        payload
      );
      toast.success(response.data.message.successMsg);
      setFormData({
        resource: "",
        description: "",
        quantity: "",
      });
      setSelectedUser(null);
      setSelectedCategory(null);
      handleCloseModal();
      fetchEngagements();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Engagement creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.userId,
    label: user.username,
  }));

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Engagement</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource
              </label>
              <input
                type="text"
                name="resource"
                value={formData.resource}
                onChange={handleInputChange}
                placeholder="resource"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g 100"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
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
                value={selectedUser}
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
                name="category"
                options={categories}
                value={selectedCategory}
                onChange={handleCategoryChange}
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
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
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

export default CreateEngagementModal;
