import axios from "axios";
import React, { useState } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const UpdateAccount = ({ isOpen, onClose, account, onAccountUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: account?.accountName || "",
    email: account?.email || "",
    msisdn: account?.msisdn || "",
    address: account?.address || "",
    description: account?.description || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const updateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        BASE_REST_API_URL + `accounts/v1/${account.accountId}`,
        formData
      );
      toast.success(response.data.message);
      onClose();
      onAccountUpdate();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Update Account failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      {" "}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 shadow-lg w-1/3">
          <h2 className="text-lg font-semibold mb-4">Edit Account</h2>
          <form onSubmit={updateAccount}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Account Name
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                placeholder="Enter Account name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                placeholder="Enter account email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                placeholder="Enter address"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                placeholder="Enter description"
                rows="4"
                required
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-red-400 text-white p-3 hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-green-500 text-white p-3 hover:bg-green-600 ml-0"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;
