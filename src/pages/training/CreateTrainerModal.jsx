import React, { useState, useEffect } from 'react'
import Select from "react-select";
import CustomFiltersStyles from '../../styles/CustomFiltersStyles';
import { BASE_REST_API_URL } from '../../service/AuthService';
import axios from 'axios';
import { hasRolePermission } from '../../utils/Utils';
import { toast } from 'react-toastify';

const CreateTrainerModal = ({isOpen, onClose, onTrainerCreated}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    qualification: '',
    specialization: '',
    bio: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      qualification: '',
      specialization: '',
      bio: '',
      status: 'ACTIVE'
    });
    setError('');
  };

  const fetchUsers = async () => {
    try {
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      setUsers(response.data.message || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }
    if (!formData.qualification || !formData.specialization || !formData.bio) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const requestBody = {
        qualification: formData.qualification,
        specialization: formData.specialization,
        bio: formData.bio,
        status: formData.status,
        accountId: superAdmin ? parseInt(accountId) : parseInt(localStorage.getItem("accountId")),
        userId: selectedUser.value
      };
      console.log(requestBody)

      const response = await axios.post(
        `${BASE_REST_API_URL}/training/v1/trainers`,
        requestBody
      );
      toast.success(response.data.message || "Trainer created successfully");
      // if (onTrainerCreated) {
      //   onTrainerCreated();
      // }
      onClose();
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Trainer creation failed";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create Trainer</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className='mb-4'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Select
                name="userId"
                className="basic-multi-select"
                styles={CustomFiltersStyles}
                required
                value={selectedUser}
                onChange={handleUserChange}
                options={users.map(user => ({
                  value: user.userId,
                  label: user.username
                }))}
                placeholder="Select a user..."
                isClearable
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="e.g., Certified Personal Trainer"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g., Strength Training, Yoga"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Trainer's biography..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                rows="3"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600 text-white rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTrainerModal;