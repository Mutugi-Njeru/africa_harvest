import axios from "axios";
import { ClipboardEditIcon, Edit, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import UpdateGroupDetails from "./UpdateGroupDetails";
import { FaEye } from "react-icons/fa";

const GroupsTable = ({ groups, isLoading, fetchGroups, searchTerm }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => { 
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    const groupsArray = Array.isArray(groups) ? groups : [];

    if (!searchTerm) return groupsArray;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return groupsArray.filter((group) => {
      const groupNameMatch = group.groupName?.toLowerCase().includes(lowerCaseSearch);
      const groupManagerMatch = group.groupManager?.toLowerCase().includes(lowerCaseSearch);
      const wardMatch = group.wardTitle?.toLowerCase().includes(lowerCaseSearch);
      const subCountyMatch = group.subCountyTitle?.toLowerCase().includes(lowerCaseSearch);
      
      return groupNameMatch || groupManagerMatch || wardMatch || subCountyMatch;
    });
  }, [groups, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b">
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
                  {currentItems.length > 0 ? (
                    currentItems.map((group, index) => (
                      <tr
                        key={group.groupId}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
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
                          <a
                            onClick={() => handleEditClick(group)}
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center pr-3"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                           <div className="relative">
                          <a
                            onClick={() => handleEditClick(group)}
                            className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Members
                          </a>
                          </div>
                          
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchTerm ? "No groups match your search" : "No groups found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredGroups.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredGroups.length)} of{" "}
                    {filteredGroups.length} entries
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === 1
                            ? "cursor-not-allowed bg-gray-50"
                            : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {getPageNumbers().map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            pageNumber !== "..." && handlePageChange(pageNumber)
                          }
                          disabled={pageNumber === "..."}
                          aria-current="page"
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            pageNumber === currentPage
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
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === totalPages
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