import {
  ClipboardEditIcon,
  Edit,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import UpdateActivity from "./UpdateActivity";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const ActivitiesTable = ({
  showActivities,
  setShowActivities,
  activities,
  isLoading,
  fetchActivities,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSubactivity, setSelectedSubactivity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSubActivityModal, setShowDeleteSubActivityModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showActivities]);

  const deleteActivity = async (activityId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/activities/v1/${activityId}`,
      );
      toast.success(response.data.message);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error(error.response?.data?.message || "Cannot delete activity");
    }
  };

  const deleteSubActivity = async (subAtivityId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/activities/v1/sub/${subAtivityId}`,
      );
      toast.success(response.data.message);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting subactivity:", error);
      toast.error(error.response?.data?.message || "Cannot delete subactivity");
    }
  };

  // Filter activities based on search term
  const filteredActivities = useMemo(() => {
    if (!searchTerm.trim()) return activities;

    return activities.filter(
      (activity) =>
        activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activities, searchTerm]);

  // Create all subactivities with parent activity info
  const allSubactivities = useMemo(() => {
    return activities.flatMap((activity) =>
      (activity.subActivities || []).map((sub) => ({
        ...sub,
        parentActivity: activity.activity,
      })),
    );
  }, [activities]);

  // Filter subactivities based on search term
  const filteredSubactivities = useMemo(() => {
    if (!searchTerm.trim()) return allSubactivities;

    return allSubactivities.filter(
      (subactivity) =>
        subactivity.subActivity
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subactivity.parentActivity
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [allSubactivities, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentActivities = useMemo(() => {
    return filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredActivities, indexOfFirstItem, indexOfLastItem]);

  const currentSubactivities = useMemo(() => {
    return filteredSubactivities.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredSubactivities, indexOfFirstItem, indexOfLastItem]);

  const totalPages = showActivities
    ? Math.ceil(filteredActivities.length / itemsPerPage)
    : Math.ceil(filteredSubactivities.length / itemsPerPage);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedActivity(null);
  };

  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmDeletion = () => {
    if (selectedActivity) {
      deleteActivity(selectedActivity.activityId);
      setShowDeleteModal(false);
      setSelectedActivity(null);
    }
  };

  const handleConfirmSubactivityDeletion = () => {
    if (selectedSubactivity) {
      deleteSubActivity(selectedSubactivity.subActivityId);
      setShowDeleteSubActivityModal(false);
      setSelectedSubactivity(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        <div className="flex items-center justify-between mb-3">
          <div className="border border-gray-200 flex items-center justify-between p-1 rounded-lg bg-gray-50">
            <button
              onClick={() => setShowActivities(true)}
              className={`mr-2 text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 shadow-sm ${
                showActivities ? "text-white bg-green-800" : "bg-transparent"
              }`}
            >
              Value Chain Types
            </button>
            <button
              onClick={() => setShowActivities(false)}
              className={`text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 transition-colors shadow-sm ${
                !showActivities ? "text-white bg-green-800" : "bg-transparent"
              }`}
            >
              Value Chain
            </button>
          </div>
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={
                showActivities
                  ? "Search by activity..."
                  : "Search by subactivity or activity..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-72 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            />
          </div>
        </div>

        <div className="relative overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
            </div>
          ) : showActivities ? (
            <div>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No activities match your search"
                    : "No activities available"}
                </div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Value Chain Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4">Updated At</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentActivities.map((activity, index) => (
                      <tr
                        key={activity.activityId}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {activity.activity}
                        </td>
                        <td className="px-6 py-3">{activity.description}</td>
                        <td className="px-6 py-3">{activity.createdAt}</td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {activity.updatedAt}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <a
                            onClick={() => handleEditClick(activity)}
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedActivity(activity);
                                setShowDeleteModal(true);
                              }}
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              {filteredSubactivities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm
                    ? "No subactivities match your search"
                    : "No subactivities available"}
                </div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Value Chain </th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Value Chain Type</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4">Updated At</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubactivities.map((subactivity, index) => (
                      <tr
                        key={subactivity.subActivityId}
                        className="bg-white border-b  hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {subactivity.subActivity}
                        </td>
                        <td className="px-6 py-3">-</td>
                        <td className="px-6 py-3">
                          {subactivity.parentActivity}
                        </td>
                        <td className="px-6 py-3">{subactivity.createdAt}</td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {subactivity.updatedAt}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <a className="font-medium text-green-600 cursor-pointer hover:underline flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedSubactivity(subactivity);
                                setShowDeleteSubActivityModal(true);
                              }}
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {((showActivities && filteredActivities.length > 0) ||
          (!showActivities && filteredSubactivities.length > 0)) && (
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
                {Math.min(
                  indexOfLastItem,
                  showActivities
                    ? filteredActivities.length
                    : filteredSubactivities.length,
                )}{" "}
                of{" "}
                {showActivities
                  ? filteredActivities.length
                  : filteredSubactivities.length}{" "}
                entries
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

      {/* Delete Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this value chain type?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
              >
                <X size={20} />
                Cancel
              </button>
              <button
               onClick={handleConfirmDeletion}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-red-500 rounded-md bg-red-500 text-white hover:bg-red-600 min-w-[100px]"
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSubActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this value chain? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteSubActivityModal(false)}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
              >
                <X size={20} />
                Cancel
              </button>

              <button
                onClick={handleConfirmSubactivityDeletion}
                className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-red-500 rounded-md bg-red-500 text-white hover:bg-red-600 min-w-[100px]"
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <UpdateActivity
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          activity={selectedActivity}
          fetchActivities={fetchActivities}
        />
      )}
    </div>
  );
};

export default ActivitiesTable;
