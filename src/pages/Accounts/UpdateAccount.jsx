import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const UpdateAccount = ({ isOpen, onClose, account, onAccountUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: account?.accountName || "",
    email: account?.email || "",
    msisdn: account?.msisdn || "",
    address: account?.address || "",
    description: account?.description || "",
  });

  // Update formData when account prop changes
  useEffect(() => {
    if (account) {
      setFormData({
        accountName: account.accountName || "",
        email: account.email || "",
        msisdn: account.msisdn || "",
        address: account.address || "",
        description: account.description || "",
      });
    }
  }, [account]);

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
        formData,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Edit Account</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={updateAccount} id="update-account-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                placeholder="Enter phone number"
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
                onChange={handleChange}
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
                onChange={handleChange}
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
            onClick={onClose}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-white text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>

          <button
            type="submit"
            form="update-account-form"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-saveButton hover:bg-yellowOrange"
            } text-white`}
          >
            {isLoading ? (
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

export default UpdateAccount;