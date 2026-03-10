import axios from "axios";
import { ArrowLeft, Download, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const TrainingAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { trainingId } = useParams();
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchTrainingAttendances = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          BASE_REST_API_URL + `/training/v1/trainings/${trainingId}/attendances`
        );
        setAttendances(response.data.message);
      } catch (error) {
        console.error("Error fetching attendances", error);
        toast.error("Failed to fetch attendance records");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainingAttendances();
  }, [trainingId, navigate]);

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

  // Format time to readable format
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter attendances based on search term
  const filteredAttendances = useMemo(() => {
    const attendancesArray = Array.isArray(attendances) ? attendances : [];

    if (!searchTerm) return attendancesArray;

    const searchLower = searchTerm.toLowerCase();
    return attendancesArray.filter((attendance) => {
      const member = attendance.member || {};
      return (
        member.firstName?.toLowerCase().includes(searchLower) ||
        member.lastName?.toLowerCase().includes(searchLower) ||
        member.msisdn?.includes(searchTerm) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.gender?.toLowerCase().includes(searchLower) ||
        member.idNumber?.includes(searchTerm) ||
        attendance.status?.toLowerCase().includes(searchLower) ||
        attendance.remarks?.toLowerCase().includes(searchLower)
      );
    });
  }, [attendances, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);

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

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'PRESENT':
        return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">PRESENT</span>;
      case 'ABSENT':
        return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">ABSENT</span>;
      case 'LATE':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">LATE</span>;
      case 'EXCUSED':
        return <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">EXCUSED</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{status || 'N/A'}</span>;
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Training Attendance</div>
      </div>
      <div className="flex justify-between">
        <div className=" justify-between items-center gap-3 mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email, status..."
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                  <tr>
                    <th className="px-3 py-4">#</th>
                    <th className="px-2 py-4">Attendance Date</th>
                    <th className="px-2 py-4">Status</th>
                    <th className="px-2 py-4">First Name</th>
                    <th className="px-2 py-4">Last Name</th>
                    <th className="px-2 py-4">Phone Number</th>
                    <th className="px-3 py-4">Email</th>
                    <th className="px-2 py-4">Gender</th>
                    <th className="px-2 py-4">ID Number</th>
                    <th className="px-2 py-4">Check In</th>
                    <th className="px-2 py-4">Check Out</th>
                    <th className="px-4 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((attendance, index) => {
                      const member = attendance.member || {};
                      return (
                        <tr
                          key={attendance.attendanceId}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <th
                            scope="row"
                            className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                          >
                            {indexOfFirstItem + index + 1}
                          </th>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {formatDate(attendance.attendanceDate)}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {getStatusBadge(attendance.status)}
                          </td>
                          <td className="px-2 py-3 truncate max-w-[120px]">
                            {member.firstName || "N/A"}
                          </td>
                          <td className="px-2 py-3 truncate max-w-[120px]">
                            {member.lastName || "N/A"}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {member.msisdn || "N/A"}
                          </td>
                          <td className="px-3 py-3 truncate max-w-[180px]" title={member.email}>
                            {member.email || "N/A"}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap capitalize">
                            {member.gender || "N/A"}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {member.idNumber || "N/A"}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {formatTime(attendance.checkInTime)}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {formatTime(attendance.checkOutTime)}
                          </td>
                          <td className="px-4 py-3 truncate max-w-[200px]" title={attendance.remarks}>
                            {attendance.remarks || "N/A"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-white border-b">
                      <td
                        colSpan="12"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No attendance records match your search"
                          : "No attendance records found for this training"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls*/}
            {filteredAttendances.length > 0 && (
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
                    {Math.min(indexOfLastItem, filteredAttendances.length)} of{" "}
                    {filteredAttendances.length} attendance records
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

export default TrainingAttendance;