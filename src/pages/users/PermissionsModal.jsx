import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";

const PermissionsModal = ({ handleCloseModal, user, onCloseModal }) => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [isRemovingPermission, setIsRemovingPermission] = useState(false);
  const [isRemovingRole, setIsRemovingRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
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
    const fetchAllRoles = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + "security/v1/roles"
        );
        setRoles(response.data.message);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchAllPermissions();
    fetchAllRoles();
    fetchUserPermissions();
    fetchUserRoles();
  }, [user.userId]);

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

  //add permissions to user
  const handleAddPermissions = async (e) => {
    setIsAddingPermission(true);
    try {
      const permissionIds = selectedPermissions.map((perm) =>
        Number(perm.value)
      );
      const response = await axios.post(
        BASE_REST_API_URL + `security/v1/users/${user.userId}/permissions`,
        { permissionIds }
      );
      setSelectedPermissions([]);
      fetchUserPermissions();
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
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
  //add roles to user
  const handleAddRoles = async (e) => {
    e.preventDefault();
    setIsAddingRole(true);
    try {
      const roleIds = selectedRoles.map((role) => role.value);
      const response = await axios.post(
        BASE_REST_API_URL + `security/v1/users/${user.userId}/roles`,
        { roleIds }
      );
      setSelectedRoles([]);
      fetchUserRoles();
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
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
          toast.error("Adding role failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsAddingRole(false);
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
      setSelectedUserPermissions([]);
      fetchUserPermissions();
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
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
      toast.success(response.data.message.details[0]);
      setSelectedUserRoles([]);
      fetchUserRoles();
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
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
  const rolesOptions = roles.map((role) => ({
    value: role.roleId,
    label: role.role,
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
  const handleRolesChange = (selectedOptions) => {
    setSelectedRoles(selectedOptions);
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
              Add Permission(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="permissions"
                options={permissionOptions}
                value={selectedPermissions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handlePermissionsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddPermissions}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={isAddingPermission}
              >
                {isAddingPermission ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Role(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="permissions"
                options={rolesOptions}
                value={selectedRoles}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleRolesChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddRoles}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={isAddingRole}
              >
                {isAddingRole ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Permission(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="user permissions"
                options={userPermissionOptions}
                value={selectedUserPermissions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleUserPermissionsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemovePermissions}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                disabled={isRemovingPermission}
              >
                {isRemovingPermission ? "Removing..." : "Remove"}{" "}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Role(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="roles"
                options={userRolesOptions}
                value={selectedUserRoles}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleUserRolesChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemoveRole}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                disabled={isRemovingRole}
              >
                {isRemovingRole ? "Removing..." : "Remove"}{" "}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              handleCloseModal();
              onCloseModal();
            }}
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
