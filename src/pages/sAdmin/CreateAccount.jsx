import React, { useState } from "react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const CreateAccount = ({ isModalOpen, closeModal, onAccountCreated }) => {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    msisdn: "",
    address: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      accountName: "",
      email: "",
      msisdn: "",
      address: "",
      description: "",
    });
  };

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BASE_REST_API_URL + "accounts/v1/create",
        formData
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully");
        resetForm();
        closeModal();
        onAccountCreated();
      }
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.errors[0] || "Account creation failed";
        toast.error(errorViolations);
      }
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Create Account</h2>
            <form onSubmit={createAccount}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter description"
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-gray-400 text-white p-3 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-green-800 text-white p-3 hover:bg-yellowOrange ml-0"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
