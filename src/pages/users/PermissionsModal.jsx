import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";

const PermissionsModal = ({ handleCloseModal, user }) => {
  const [permissions, setPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [isRemovingPermission, setIsRemovingPermission] = useState(false);
  const [isRemovingRole, setIsRemovingRole] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);

  //permissions
  useEffect(() => {
    //get all permissions
    const fetchAllPermissions = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + "security/v1/permissions"
        );
        setPermissions(response.data.message);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    //get user permissions
    const fetchUserPermissions = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + `security/v1/users/${user.userId}/permissions`
        );
        setUserPermissions(response.data.message);
      } catch (error) {
        console.error("Error fetching User permissions:", error);
      }
    };
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + `security/v1/users/${user.userId}/roles`
        );
        setUserRoles(response.data.message);
      } catch (error) {
        console.error("Error fetching User roles:", error);
      }
    };
    fetchAllPermissions();
    fetchUserPermissions();
    fetchUserRoles();
  }, [user.userId]);

  //add permissions to user
  const handleAddPermissions = async (e) => {
    e.preventDefault();
    setIsAddingPermission(true);
    try {
      const permissionIds = selectedPermissions.map((perm) => perm.value);
      const response = await axios.post(
        BASE_REST_API_URL + `security/v1/users/${user.userId}/permissions`,
        { permissionIds }
      );
      toast.success(response.data.message);
      setSelectedPermissions([]);
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message.details)
        ) {
          error.response.data.message.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Adding permissions failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsAddingPermission(false);
    }
  };

  //remove permissions from user
  const handleRemovePermissions = async (e) => {
    e.preventDefault();
    setIsRemovingPermission(true);
    try {
      const permissionIds = selectedUserPermissions.map((perm) => perm.value);
      console.log(
        BASE_REST_API_URL +
          `/security/v1/users/${user.userId}/permissions/deactivate`,
        { permissionIds }
      );
      const response = await axios.put(
        BASE_REST_API_URL +
          `/security/v1/users/${user.userId}/permissions/deactivate`,
        { permissionIds }
      );
      toast.success(response.data.message);
      setSelectedUserPermissions([]);
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message.details)
        ) {
          error.response.data.message.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Removing permissions failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsRemovingPermission(false);
    }
  };
  //remove roles from user
  const handleRemoveRole = async (e) => {
    e.preventDefault();
    setIsRemovingRole(true);
    try {
      const roleIds = selectedUserRoles.map((perm) => perm.value);
      const response = await axios.delete(
        BASE_REST_API_URL + `security/v1/users/${user.userId}/roles`,
        { data: { roleIds } }
      );
      toast.success(response.data.message);
      setSelectedUserRoles([]);
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message.details)
        ) {
          error.response.data.message.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Removing role failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsRemovingRole(false);
    }
  };

  const permissionOptions = permissions.map((permission) => ({
    value: permission.permissionId,
    label: permission.permission,
  }));
  const userPermissionOptions = userPermissions.map((permission) => ({
    value: permission.permissionId,
    label: permission.permission,
  }));
  const userRolesOptions = userRoles.map((role) => ({
    value: role.roleId,
    label: role.role,
  }));
  const handlePermissionsChange = (selectedOptions) => {
    setSelectedPermissions(selectedOptions);
  };
  const handleUserPermissionsChange = (selectedOptions) => {
    setSelectedUserPermissions(selectedOptions);
  };
  const handleUserRolesChange = (selectedOptions) => {
    setSelectedUserRoles(selectedOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[800px] ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Manage Roles and permissions for {user.firstName}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Permissions
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="permissions"
                options={permissionOptions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handlePermissionsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddPermissions}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Permissions
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="user permissions"
                options={userPermissionOptions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleUserPermissionsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemovePermissions}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Remove
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Role
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="roles"
                options={userRolesOptions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleUserRolesChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemoveRole}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCloseModal}
            className="w-1/2 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
