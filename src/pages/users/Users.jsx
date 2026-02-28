import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import {
  exportToCSV,
  hasPermission,
  hasRolePermission,
} from "../../utils/Utils";
import CreateUser from "./CreateUser";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import CreateRole from "./CreateRole";

const Users = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const accountId = localStorage.getItem("accountId");

  //get user permissions and roles
  const userPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];

  //check permissions
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN"); //check if its super admin to get users
  const canCreateUser = hasPermission(userPermissions, "CREATE_USER");
  const canViewReports = hasPermission(userPermissions, "VIEW_REPORTS");
  const canDownload = hasPermission(userPermissions, "DOWNLOAD");
  const canCreateRole = hasRolePermission(userRoles, ["SUPER_ADMIN", "ADMIN"]); // only superadmin or admin can create role

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      setUsers(response.data.message);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRoles = async () => {
    try {
      setIsRolesLoading(true);
      let url = BASE_REST_API_URL + "security/v1/roles";
      const response = await axios.get(url);
      setRoles(response.data.message);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsRolesLoading(false);
    }
  };

  const downloadUsers = () => {
    exportToCSV(users);
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="flex justify-between items-center mt-3 mb-5">
        {showUsers ? (
          <div className="text-xl font-bold text-gray-600">Users</div>
        ) : (
          <div className="text-xl font-bold text-gray-600">Roles</div>
        )}
        <div className="flex justify-end items-center">
          {canCreateUser && (
            <>
              {showUsers ? (
                <button
                  className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-createButton hover:bg-yellowOrange text-white"
                  onClick={() => setShowCreateUserModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="ml-2 mr-2">Create User</span>
                </button>
              ) : (
                <button
                  className={`flex items-center border pl-3 pr-3 p-2 ${
                    !canCreateRole
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-createButton hover:bg-yellowOrange cursor-pointer"
                  } text-white`}
                  onClick={() => setShowCreateRoleModal(true)}
                  disabled={!canCreateRole}
                >
                  <Plus
                    className={`w-4 h-4 ${!canCreateRole ? "opacity-50" : ""}`}
                  />
                  <span className="ml-2 mr-2">Create Role</span>
                </button>
              )}
            </>
          )}
          {canDownload && (
            <button
              className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100"
              onClick={downloadUsers}
            >
              <Download className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      {(isLoading || isRolesLoading) && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      )}

      {/* table */}
      {!(isLoading || isRolesLoading) && canViewReports && (
        <UsersTable
          users={users}
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          allRoles={roles}
          canCreateRole={canCreateRole}
          fetchUsers={fetchUsers}
        />
      )}
      <CreateUser
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={fetchUsers}
      />
      <CreateRole
        isOpen={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        onRoleCreated={fetchRoles}
      />
    </div>
  );
};

export default Users;
