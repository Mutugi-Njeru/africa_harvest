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
          error.response.data.errors[0] || "Account creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay with higher z-index */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          {/* Modal container - positioned to account for fixed header */}
          <div className="flex items-start justify-center min-h-screen pt-20 px-4 pb-20 text-center sm:block sm:p-0 z-50">
            {/* This element is to trick the browser into centering the modal contents */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  {/* Header */}
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Create Account
                  </h3>

                  {/* Form content */}
                  <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2">
                    <form onSubmit={createAccount} id="createAccountForm">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Account Name
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                          placeholder="254712345678"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                          placeholder="Enter description"
                          rows="4"
                          required
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Footer with buttons */}
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="submit"
                  form="createAccountForm"
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
                    isLoading
                      ? "bg-gray-400"
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

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-cancelButton text-saveButton hover:bg-gray-50"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAccount;
