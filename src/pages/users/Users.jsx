import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import { exportToCSV, hasPermission } from "../../utils/Utils";
import CreateUser from "./CreateUser";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";

const Users = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const userPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const canCreateUser = hasPermission(userPermissions, "CREATE_USER");
  const canViewReports = hasPermission(userPermissions, "VIEW_REPORTS");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(BASE_REST_API_URL + "/users/v1/all");
      setUsers(response.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadUsers = () => {
    exportToCSV(users);
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-gray-600">Users</div>
        <div className="flex justify-end items-center">
          {canCreateUser && (
            <button
              className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange text-white"
              onClick={() => setShowCreateUserModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2 mr-2">Create User</span>
            </button>
          )}
          {canViewReports && (
            <button
              className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black"
              onClick={downloadUsers}
            >
              <Download className="w-4 h-4" />
              <span className="mr-2">Export CSV</span>
            </button>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      )}

      {/* table */}
      {!isLoading && canViewReports && <UsersTable users={users} />}
      <CreateUser
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={fetchUsers}
      />
    </div>
  );
};

export default Users;
