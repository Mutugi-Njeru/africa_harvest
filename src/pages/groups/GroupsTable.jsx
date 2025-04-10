import axios from "axios";
import { ClipboardEditIcon, Edit, Search } from "lucide-react";
import React, { useState } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import UpdateGroupDetails from "./UpdateGroupDetails";

const GroupsTable = ({ groups, isLoading, fetchGroups }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const activateGroup = async (groupId) => {
    try {
      const response = await axios.post(
        BASE_REST_API_URL + `/groups/v1/${groupId}/restore`
      );
      toast.success(response.data.message);
      fetchGroups();
    } catch (error) {
      console.error("Error activating group:", error);
      toast.error("Cannot activate group");
    }
  };

  const deactivateGroup = async (groupId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/groups/v1/${groupId}`
      );
      toast.success(response.data.message);
      fetchGroups();
    } catch (error) {
      console.error("Error deactivating group:", error);
      toast.error("Cannot deactivate group");
    }
  };

  const handleToggleStatus = (groupId, currentStatus) => {
    if (currentStatus) {
      deactivateGroup(groupId);
    } else {
      activateGroup(groupId);
    }
  };
  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedGroup(null);
  };
  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setIsUpdateModalOpen(true);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email or roles"
              className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Group Name</th>
                    <th className="px-6 py-4">Group Manager</th>
                    <th className="px-6 py-4">Ward</th>
                    <th className="px-6 py-4">Sub County</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr
                      key={group.groupId}
                      className="bg-white border-b  hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-3 truncate max-w-[200px]">
                        {group.groupName}
                      </td>
                      <td className="px-6 py-3">{group.groupManager}</td>
                      <td className="px-6 py-3">{group.wardTitle}</td>

                      <td className="px-6 py-3 truncate max-w-[150px]">
                        {group.subCountyTitle}
                      </td>
                      <td className="px-6 py-3 truncate max-w-[150px]">
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              group.groupId,
                              !group.softDeleted
                            )
                          }
                          className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                            group.softDeleted
                              ? "bg-yellowOrange"
                              : "bg-green-500"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              group.softDeleted
                                ? "translate-x-0"
                                : "translate-x-4"
                            }`}
                          ></div>
                        </button>
                      </td>
                      <td className="flex items-center px-6 py-3 relative">
                        <div className="relative">
                          <a
                            onClick={() => handleEditClick(group)}
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {isUpdateModalOpen && (
        <UpdateGroupDetails
          handleCloseModal={handleCloseModal}
          group={selectedGroup}
          fetchGroups={fetchGroups}
        />
      )}
    </div>
  );
};

export default GroupsTable;
