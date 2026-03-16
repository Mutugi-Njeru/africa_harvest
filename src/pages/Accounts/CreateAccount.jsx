import React, { useState } from "react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const CreateAccount = ({ isModalOpen, closeModal, onAccountCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      const response = await axios.post(
        BASE_REST_API_URL + "accounts/v1/create",
        formData,
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
          error.response.data.errors?.[0] || "Account creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Create Account</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={createAccount} id="create-account-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="Enter Account name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="Enter account email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="254712345678"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="Enter address"
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
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="Enter description"
                rows="4"
                required
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={closeModal}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-white text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>

          <button
            type="submit"
            form="create-account-form"
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

export default CreateAccount;