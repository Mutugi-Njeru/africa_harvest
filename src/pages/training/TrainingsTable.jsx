import {
  ClipboardEditIcon,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TrainingsTable = ({ trainings = [], searchTerm = "" }) => {
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleShowAttendance = async (trainingId) => {
    try {
      navigate(`/training/${trainingId}/attendance`);
    } catch (error) {
      console.error("Error navigating to attendance:", error);
      toast.error("Failed to view attendance");
    }
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter trainings based on search term
  const filteredTrainings = useMemo(() => {
    if (!searchTerm) return trainings;

    const searchLower = searchTerm.toLowerCase();
    return trainings.filter((training) => {
      return (
        training.title?.toLowerCase().includes(searchLower) ||
        training.trainingCode?.toLowerCase().includes(searchLower) ||
        training.location?.toLowerCase().includes(searchLower) ||
        training.trainer?.name?.toLowerCase().includes(searchLower) ||
        training.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [trainings, searchTerm]);

  const handleViewResources = (trainingId) => {
  try {
    navigate(`/training/${trainingId}/resources`);
  } catch (error) {
    console.error("Error navigating to resources:", error);
    toast.error("Failed to view resources");
  }
};
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

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
        <div className="relative overflow-x-auto min-h-[400px]">
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Code</th>
                  <th className="px-4 py-4">Value Chain</th>
                  <th className="px-4 py-4">Module</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Start Time</th>
                  <th className="px-4 py-4">End Time</th>
                  <th className="px-4 py-4">Trainer</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((training, index) => (
                    <tr
                      key={training.trainingId || index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-green-600 whitespace-nowrap">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.title || "-"}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.trainingCode || "-"}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.subActivity || "-"}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.moduleTitle || "-"}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.location || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {training.startTime
                          ? new Date(
                              `2000-01-01T${training.startTime}`,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {training.endTime
                          ? new Date(
                              `2000-01-01T${training.endTime}`,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                          {training.user?.name || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.description || "-"}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                          onClick={() =>
                            handleViewResources(training.trainingId)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Resources
                        </button>
                        <button
                          onClick={() =>
                            handleShowAttendance(training.trainingId)
                          }
                          className="font-medium text-yellow-600 cursor-pointer hover:underline flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Attendance
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "No trainings match your search criteria"
                        : "No trainings found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredTrainings.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-2">
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
                  {Math.min(indexOfLastItem, filteredTrainings.length)} of{" "}
                  {filteredTrainings.length} training records
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
      </div>
    </div>
  );
};

export default TrainingsTable;
