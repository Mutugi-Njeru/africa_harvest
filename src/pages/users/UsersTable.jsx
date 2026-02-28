import {
  ChevronDown,
  Edit,
  Ellipsis,
  Lock,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import UpdateUser from "./UpdateUser";
import { hasPermission } from "../../utils/Utils";
import PermissionsModal from "./PermissionsModal";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

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
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  // Pagination states for users
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination states for roles
  const [currentRolePage, setCurrentRolePage] = useState(1);
  const [rolesPerPage] = useState(10);

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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentUserPage(1);
  }, [searchTerm]);

  // Users Pagination logic
  const indexOfLastUser = currentUserPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Roles Pagination logic
  const indexOfLastRole = currentRolePage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = allRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalRolePages = Math.ceil(allRoles.length / rolesPerPage);

  const handleUserPageChange = (pageNumber) => {
    setCurrentUserPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRolePageChange = (pageNumber) => {
    setCurrentRolePage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousUserPage = () => {
    if (currentUserPage > 1) {
      setCurrentUserPage(currentUserPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextUserPage = () => {
    if (currentUserPage < totalUserPages) {
      setCurrentUserPage(currentUserPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousRolePage = () => {
    if (currentRolePage > 1) {
      setCurrentRolePage(currentRolePage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextRolePage = () => {
    if (currentRolePage < totalRolePages) {
      setCurrentRolePage(currentRolePage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display for users
  const getUserPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalUserPages <= maxPagesToShow) {
      for (let i = 1; i <= totalUserPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentUserPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalUserPages);
      } else if (currentUserPage >= totalUserPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalUserPages - 3; i <= totalUserPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentUserPage - 1; i <= currentUserPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalUserPages);
      }
    }

    return pageNumbers;
  };

  // Generate page numbers to display for roles
  const getRolePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalRolePages <= maxPagesToShow) {
      for (let i = 1; i <= totalRolePages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentRolePage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalRolePages);
      } else if (currentRolePage >= totalRolePages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalRolePages - 3; i <= totalRolePages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentRolePage - 1; i <= currentRolePage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalRolePages);
      }
    }

    return pageNumbers;
  };

  const deactivateUser = async (userId) => {
    try {
      const response = await axios.put(
        BASE_REST_API_URL + `/users/v1/${userId}/deactivate`,
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Cannot deactivate user");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/users/v1/${userId}/delete`,
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Cannot delete user");
    }
  };

  const activateUser = async (userId) => {
    try {
      const response = await axios.put(
        BASE_REST_API_URL + `/users/v1/${userId}/activate`,
      );
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Cannot activate user");
    }
  };

  const handleStatusToggle = (user) => {
    setSelectedUser(user);
    if (user.isActive) {
      setShowDeactivateModal(true);
    } else {
      setShowActivateModal(true);
    }
  };

  const handleConfirmDeactivation = () => {
    if (selectedUser) {
      deactivateUser(selectedUser.userId);
      setShowDeactivateModal(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmActivation = () => {
    if (selectedUser) {
      activateUser(selectedUser.userId);
      setShowActivateModal(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmDeletion = () => {
    if (selectedUser) {
      deleteUser(selectedUser.userId);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

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
              className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent disabled:cursor-not-allowed"
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
                    {canEditUser || canDeleteUser ? (
                      <th className="px-4 py-4">Status</th>
                    ) : null}
                    {canEditUser || canDeleteUser ? (
                      <th className="px-4 py-4">Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr
                        key={user.userId}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-green-600 whitespace-nowrap "
                        >
                          {indexOfFirstUser + index + 1}
                        </th>
                        <td className="px-4 py-3 truncate max-w-[200px]">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.msisdn}</td>
                        <td
                          className="px-4 py-3 truncate max-w-[150px]"
                          title={user.roles.join(", ")}
                        >
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
                        {(canEditUser || canDeleteUser) && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleStatusToggle(user)}
                              className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                                user.isActive
                                  ? "bg-green-500"
                                  : "bg-yellowOrange"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  user.isActive
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                }`}
                              ></div>
                            </button>
                          </td>
                        )}
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
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </a>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="text-center py-8 text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
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
                  {currentRoles.length > 0 ? (
                    currentRoles.map((role, index) => (
                      <tr
                        key={role.roleId}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                        >
                          {indexOfFirstRole + index + 1}
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
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500"
                      >
                        No roles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users Pagination Controls - Moved outside the min-h div with mt-4 spacing */}
        {showUsers && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePreviousUserPage}
                disabled={currentUserPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentUserPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextUserPage}
                disabled={currentUserPage === totalUserPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentUserPage === totalUserPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span>{" "}
                  entries
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePreviousUserPage}
                    disabled={currentUserPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentUserPage === 1
                        ? "cursor-not-allowed bg-gray-50"
                        : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {getUserPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        pageNumber !== "..." && handleUserPageChange(pageNumber)
                      }
                      disabled={pageNumber === "..."}
                      aria-current="page"
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNumber === currentUserPage
                          ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          : pageNumber === "..."
                          ? "text-gray-700 cursor-default"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={handleNextUserPage}
                    disabled={currentUserPage === totalUserPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentUserPage === totalUserPages
                        ? "cursor-not-allowed bg-gray-50"
                        : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Roles Pagination Controls - Moved outside the min-h div with mt-4 spacing */}
        {!showUsers && allRoles.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePreviousRolePage}
                disabled={currentRolePage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentRolePage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextRolePage}
                disabled={currentRolePage === totalRolePages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentRolePage === totalRolePages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {allRoles.length > 0 ? indexOfFirstRole + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastRole, allRoles.length)}
                  </span>{" "}
                  of <span className="font-medium">{allRoles.length}</span>{" "}
                  entries
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePreviousRolePage}
                    disabled={currentRolePage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentRolePage === 1
                        ? "cursor-not-allowed bg-gray-50"
                        : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {getRolePageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        pageNumber !== "..." && handleRolePageChange(pageNumber)
                      }
                      disabled={pageNumber === "..."}
                      aria-current="page"
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNumber === currentRolePage
                          ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          : pageNumber === "..."
                          ? "text-gray-700 cursor-default"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={handleNextRolePage}
                    disabled={currentRolePage === totalRolePages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentRolePage === totalRolePages
                        ? "cursor-not-allowed bg-gray-50"
                        : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deactivation</h2>
            <p>Are you sure you want to deactivate this user?</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
              >
                <X size={20} />
                Cancel
              </button>

              <button
                onClick={handleConfirmDeactivation}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white min-w-[100px] bg-saveButton hover:bg-yellowOrange"
              >
                <Check size={20} />
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Activation</h2>
            <p>Are you sure you want to activate this user?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowActivateModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
              >
                 <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleConfirmActivation}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-md text-white min-w-[100px] bg-saveButton hover:bg-yellowOrange"
              >
                 <Check size={20} />
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
              >
                <X size={20} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeletion}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-red-500 rounded-md bg-red-100 text-red-500 hover:bg-gray-50 min-w-[100px]"
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
          onCloseModal={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersTable;
