import {
  ChevronDown,
  Edit,
  Ellipsis,
  Lock,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import UpdateUser from "./UpdateUser";
import { hasPermission } from "../../utils/Utils";
import PermissionsModal from "./PermissionsModal";

const UsersTable = ({
  users,
  showUsers,
  setShowUsers,
  allRoles,
  canCreateRole,
  fetchUsers,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const userPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const canEditUser = hasPermission(userPermissions, "EDIT_USER");
  const canDeleteUser = hasPermission(userPermissions, "DELETE_USER");

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setIsRolesModalOpen(false);
    setSelectedUser(null);
  };
  const handleRolesClick = (user) => {
    setSelectedUser(user);
    setIsRolesModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchLower) ||
      user.msisdn.toLowerCase().includes(searchLower) ||
      user.roles.some((role) => role.toLowerCase().includes(searchLower)) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="border border-gray-200 flex items-center justify-between p-1 rounded-lg bg-gray-50">
            <button
              onClick={() => setShowUsers(true)}
              className={`mr-2 text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 shadow-sm ${
                showUsers ? "text-white bg-green-800" : "bg-transparent"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setShowUsers(false)}
              className="bg-transparent border text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 transition-colors shadow-sm "
              disabled={!canCreateRole}
            >
              Roles
            </button>
          </div>
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email or roles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
              disabled={!showUsers}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto min-h-[400px]">
          {showUsers ? (
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Full Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Roles</th>
                    <th className="px-4 py-4">Permissions</th>
                    <th className="px-4 py-4">Regional</th>
                    <th className="px-4 py-4">County</th>
                    <th className="px-4 py-4">Subcounty</th>
                    <th className="px-4 py-4">Ward</th>
                    <th className="px-4 py-4">Status</th>
                    {canEditUser || canDeleteUser ? (
                      <th className="px-4 py-4">Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.userId}
                      className="bg-white border-b  hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-green-600 whitespace-nowrap "
                      >
                        {index + 1}
                      </th>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.msisdn}</td>
                      <td className="px-4 py-3 truncate max-w-[150px]">
                        {user.roles.join(", ")}
                      </td>
                      <td
                        className="px-4 py-3 truncate max-w-[200px]"
                        title={user.permissions?.join(", ") || ""}
                      >
                        {user.permissions?.join(", ") || "No permissions"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isRegionalCoordinator ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isCountyCoordinator ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isSubcountyCoordinator ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isWardCoordinator ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                            user.isActive ? "bg-green-500" : "bg-yellowOrange"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              user.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </td>
                      {(canEditUser || canDeleteUser) && (
                        <td className="flex items-center px-4 py-3 relative">
                          {canEditUser && (
                            <>
                              <a
                                onClick={() => handleEditClick(user)}
                                className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </a>
                              <div className="relative">
                                <a
                                  className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center ml-3"
                                  onClick={() => handleRolesClick(user)}
                                >
                                  <Lock className="h-4 w-4 mr-1" />
                                  Roles
                                </a>
                              </div>
                            </>
                          )}
                          {canDeleteUser && (
                            <a
                              href="#"
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Role Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4">Updated At</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoles.map((role, index) => (
                    <tr
                      key={role.roleId}
                      className="bg-white border-b  hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-3 truncate max-w-[200px]">
                        {role.role}
                      </td>
                      <td className="px-6 py-3">{role.description}</td>
                      <td className="px-6 py-3">{role.createdAt}</td>

                      <td className="px-6 py-3 truncate max-w-[150px]">
                        {role.updatedAt}
                      </td>
                      <td className="px-6 py-3 truncate max-w-[200px]">
                        Active
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isUpdateModalOpen && (
        <UpdateUser
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          userData={selectedUser}
          onUserUpdated={fetchUsers}
        />
      )}
      {isRolesModalOpen && (
        <PermissionsModal
          handleCloseModal={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersTable;
