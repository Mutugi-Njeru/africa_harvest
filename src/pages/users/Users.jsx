import { Plus } from "lucide-react";
import React, { useState } from "react";
import UsersTable from "./UsersTable";
import { hasPermission } from "../../utils/Utils";
import CreateUser from "./CreateUser";

const Users = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const userPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const canCreateUser = hasPermission(userPermissions, "CREATE_USER");
  const canViewReports = hasPermission(userPermissions, "VIEW_REPORTS");
  return (
    <div className="pr-4 pl-3 relative">
      {canCreateUser && (
        <div className="flex justify-end items-center">
          <button
            className="flex items-center cursor-pointer border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange text-white"
            onClick={() => setShowCreateUserModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create User</span>
          </button>
        </div>
      )}
      {/* table */}
      {canViewReports && <UsersTable />}
      <CreateUser
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
      />
    </div>
  );
};

export default Users;
