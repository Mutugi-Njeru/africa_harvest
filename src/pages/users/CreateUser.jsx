import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { BASE_REST_API_URL } from "../../service/AuthService";

const CreateUser = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const accountId = localStorage.getItem("accountId");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    msisdn: "",
    password: "",
    description: "",
    roles: [],
    permissions: [],
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + "security/v1/roles"
        );
        setRoles(response.data.message);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + "security/v1/users/1/permissions"
        );
        setPermissions(response.data.message);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchRoles();
    fetchPermissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        roles: selectedRoles.map((role) => role.value),
        permissions: selectedPermissions.map((permission) => permission.value),
      };
      const response = await axios.post(
        BASE_REST_API_URL + `users/v1/create?accountId=${accountId}`,
        updatedFormData
      );
      toast.success(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        msisdn: "",
        password: "",
        description: "",
        roles: [],
        permissions: [],
      });
      setSelectedRoles([]);
      setSelectedPermissions([]);
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const roleOptions = roles.map((role) => ({
    value: role.role,
    label: role.role,
  }));
  const permissionOptions = permissions.map((permission) => ({
    value: permission.permission,
    label: permission.permission,
  }));

  const handleRolesChange = (selectedOptions) => {
    setSelectedRoles(selectedOptions);
  };
  const handlePermissionsChange = (selectedOptions) => {
    setSelectedPermissions(selectedOptions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6  shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create User</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleChange}
                placeholder="254712345678"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Roles and Permissions Dropdowns */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Roles
              </label>
              <Select
                isMulti
                name="roles"
                options={roleOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleRolesChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              <Select
                isMulti
                name="permissions"
                options={permissionOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handlePermissionsChange}
              />
            </div>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="3"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 bg-gray-400 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
