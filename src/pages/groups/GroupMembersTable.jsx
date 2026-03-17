import axios from "axios";
import { ArrowLeft, Download, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const GroupMembersTable = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { groupId } = useParams();
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Items per page options
  const itemsPerPageOptions = [5, 10, 15, 25, 50, 100];

  useEffect(() => {
    const fetchGroupMembers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          BASE_REST_API_URL + `/groups/v1/${groupId}`,
        );
        setMembers(response.data.message.members);
      } catch (error) {
        console.error("Error fetching members", error);
        toast.error("Failed to fetch members");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupMembers();
  }, [groupId, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    const membersArray = Array.isArray(members) ? members : [];

    if (!searchTerm) return membersArray;

    const searchLower = searchTerm.toLowerCase();
    return membersArray.filter((member) => {
      return (
        member.firstName?.toLowerCase().includes(searchLower) ||
        member.lastName?.toLowerCase().includes(searchLower) ||
        member.msisdn?.includes(searchTerm) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.wardTitle?.toLowerCase().includes(searchLower) ||
        member.subCountyTitle?.toLowerCase().includes(searchLower) ||
        member.countyTitle?.toLowerCase().includes(searchLower)
      );
    });
  }, [members, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
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
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Members</div>
      </div>
      <div className="flex justify-between">
        <div className=" justify-between items-center gap-3 mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email, location..."
              className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          {" "}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      {/* table */}
      <div className="relative overflow-x-auto shadow-md mt-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <div>
              <table className="w-full text-xs text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-500 border-b bg-white">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Firstname</th>
                    <th className="px-3 py-2">Lastname</th>
                    <th className="px-3 py-2">Phone Number</th>
                    <th className="px-3 py-2">Gender</th>
                    <th className="px-3 py-2">Id Number</th>
                    <th className="px-3 py-2">DOB</th>
                    <th className="px-3 py-2">Ward</th>
                    <th className="px-3 py-2">Value Chains</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((member, index) => (
                      <tr
                        key={member.memberId}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-3 py-1 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="px-3 py-1 truncate max-w-[150px]">
                          {member.firstName || "N/A"}
                        </td>
                        <td className="px-3 py-1 truncate max-w-[150px]">
                          {member.lastName || "N/A"}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {member.msisdn || "N/A"}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap capitalize">
                          {member.gender || "N/A"}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {member.idNumber || "N/A"}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {formatDate(member.dob)}
                        </td>
                        <td
                          className="px-3 py-1 truncate max-w-[200px]"
                          title={member.wardTitle}
                        >
                          {member.wardTitle || "N/A"}
                        </td>
                        <td className="px-3 py-1 relative group">
                          {member.subActivities && member.subActivities.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-1 max-w-[250px] cursor-help">
                                {member.subActivities.slice(0, 3).map((subActivity, idx) => (
                                  <span
                                    key={subActivity.subActivityId || idx}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {subActivity.subActivity.length > 15
                                      ? `${subActivity.subActivity.substring(0, 15)}...`
                                      : subActivity.subActivity}
                                  </span>
                                ))}
                                {member.subActivities.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                    +{member.subActivities.length - 3}
                                  </span>
                                )}
                              </div>
                              
                              {/* Tooltip showing all subactivities */}
                              <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white text-xs rounded p-2 mt-1 min-w-[200px] shadow-lg">
                                <p className="font-semibold mb-1">Value Chains:</p>
                                <ul className="list-disc pl-4">
                                  {member.subActivities.map((sa, idx) => (
                                    <li key={idx} className="mb-1">
                                      <span className="font-medium">{sa.subActivity}</span>
                                      {sa.activityName && (
                                        <span className="text-gray-300 text-xs block">
                                          ({sa.activityName})
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">No value chains</span>
                          )}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {member.isActive ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {formatDate(member.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b">
                      <td
                        colSpan="11"
                        className="px-3 py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No members match your search"
                          : "No members found in this group"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredMembers.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-6 mt-4">
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
                  {/* Left side - Showing entries and items per page selector */}
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredMembers.length)} of{" "}
                      {filteredMembers.length} entries
                    </div>
                    
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-white"
                      >
                        {itemsPerPageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-700">entries</span>
                    </div>
                  </div>

                  {/* Pagination buttons */}
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
    </div>
  );
};

export default GroupMembersTable;