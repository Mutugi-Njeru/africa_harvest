import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";

const CreateRegion = ({ isOpen, onClose, onRegionCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        BASE_REST_API_URL + "/geographic/v1/regions",
        formData
      );
      toast.success("Region created successfully");
      setFormData({
        region: "",
        description: "",
      });
      onClose();
      onRegionCreated();
    } catch (error) {
      if (error.response) {
        const errorViolations =
          error.response.data.message || "Region creation failed";
        toast.error(errorViolations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
            Create Region
          </h3>
          
          {/* Form content */}
          <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} id="createRegionForm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Region Name
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Region Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                  placeholder="Enter description"
                  rows="4"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer with buttons - Updated to match reference modal */}
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
        <button
          type="submit"
          form="createRegionForm"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default CreateRegion;
