import axios from "axios";
import {
  ArrowLeft,
  Download,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import UpdateModule from "./UpdateModule";

const ModulesTable = () => {
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [selectedModuleForUpdate, setSelectedModuleForUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCourseModules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/training/v1/courses/${courseId}/modules`,
      );
      setModules(response.data.message);
    } catch (error) {
      console.error("Error fetching modules", error);
      toast.error("Failed to fetch modules");
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseModules();
  }, [courseId, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  // Filter modules based on search term
  const filteredModules = useMemo(() => {
    const modulesArray = Array.isArray(modules) ? modules : [];

    if (!searchTerm) return modulesArray;

    const searchLower = searchTerm.toLowerCase();
    return modulesArray.filter((module) => {
      return (
        module.title?.toLowerCase().includes(searchLower) ||
        module.moduleCode?.toLowerCase().includes(searchLower) ||
        module.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [modules, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  const handleOpenUpdateModal = (module) => {
    setSelectedModuleForUpdate(module);
    setIsUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedModuleForUpdate(null);
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
    <>
      <div className="pr-4 pl-3 relative">
        <div className="mt-3 mb-4">
          <div className="text-xl font-bold text-gray-600">Modules</div>
        </div>
        <div className="flex justify-between">
          <div className="justify-between items-center gap-3 mb-3">
            <div className="mb-2 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, code, or description..."
                className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div>
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
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                    <tr>
                      <th className="px-3 py-4">ID</th>
                      <th className="px-2 py-4">Code</th>
                      <th className="px-1 py-4">Module</th>
                      <th className="px-2 py-4">Description</th>
                      <th className="px-6 py-4">Duration (Hours)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date Created</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((module, index) => (
                        <tr
                          key={module.moduleId}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <th
                            scope="row"
                            className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                          >
                            {indexOfFirstItem + index + 1}
                          </th>
                          <td className="px-1 py-3 truncate max-w-[150px]">
                            {module.moduleCode || "N/A"}
                          </td>
                          <td className="px-1 py-3 truncate max-w-[150px]">
                            {module.title || "N/A"}
                          </td>
                          <td
                            className="px-2 py-3 truncate max-w-[250px]"
                            title={module.description}
                          >
                            {module.description || "N/A"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            {module.durationHours || "N/A"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            {module.isActive ? (
                              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            {formatDate(module.createdAt)}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <a
                              onClick={() => handleOpenUpdateModal(module)}
                              className="font-medium text-green-600 cursor-pointer hover:underline flex items-center pr-3"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Module
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white border-b">
                        <td
                          colSpan="8"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          {searchTerm
                            ? "No modules match your search"
                            : "No modules found for this course"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls*/}
              {filteredModules.length > 0 && (
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
                      {Math.min(indexOfLastItem, filteredModules.length)} of{" "}
                      {filteredModules.length} modules
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
                              pageNumber !== "..." &&
                              handlePageChange(pageNumber)
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
                          <ChevronRight
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
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
      {selectedModuleForUpdate && (
        <UpdateModule
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          module={selectedModuleForUpdate}
          onModuleUpdated={fetchCourseModules}
        />
      )}
    </>
  );
};

export default ModulesTable;
