import { Download, Plus, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CountyEA = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  useEffect(() => { 
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_REST_API_URL + '/users/v1/county-coordinators');
      
      if (response.data.isSuccess) {
        setCoordinators(response.data.message.data);
      } else {
        toast.error('Failed to fetch coordinators');
      }
    } catch (err) {
      toast.error('Error fetching data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter coordinators based on search term
  const filteredCoordinators = coordinators.filter(coord => {
    const fullName = `${coord.user.firstName} ${coord.user.lastName}`.toLowerCase();
    const email = coord.user.email?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoordinators.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoordinators.length / itemsPerPage);

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

  const getStatusDisplay = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
        Inactive
      </span>
    );
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return '—';
    return gender === 'MALE' ? 'Male' : gender === 'FEMALE' ? 'Female' : gender;
  };

  const getCountiesNames = (counties) => {
    if (!counties || counties.length === 0) return 'No counties assigned';
    return counties.map(c => c.countyTitle).join(', ');
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">
          County Extension Agents
        </div>
      </div>
      <div className=" justify-between items-center gap-3 mb-3">
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by trainer, coordinator..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* table */}
      <div className="relative overflow-x-auto shadow-md mt-3">
        {loading ? (
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
                    <th className="px-2 py-4">Firstname</th>
                    <th className="px-2 py-4">Lastname</th>
                    <th className="px-2 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Counties</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((coordinator, index) => (
                      <tr key={coordinator.user.userId} className="bg-white border-b hover:bg-gray-50">
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="px-2 py-3 truncate max-w-[200px]">
                          {coordinator.user.firstName || '—'}
                        </td>
                        <td className="px-2 py-3 truncate max-w-[200px]">
                          {coordinator.user.lastName || '—'}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {coordinator.user.msisdn || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {coordinator.user.email || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {getGenderDisplay(coordinator.user.gender)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="truncate max-w-[300px]" title={getCountiesNames(coordinator.counties)}>
                            {getCountiesNames(coordinator.counties)}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {getStatusDisplay(coordinator.user.isActive)}
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              ></path>
                            </svg>
                            Assign
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No coordinators match your search' : 'No regional coordinators found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Matching GroupsTable design */}
            {filteredCoordinators.length > 0 && (
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
                    {Math.min(indexOfLastItem, filteredCoordinators.length)} of{" "}
                    {filteredCoordinators.length} entries
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
    </div>
  );
};

export default CountyEA;