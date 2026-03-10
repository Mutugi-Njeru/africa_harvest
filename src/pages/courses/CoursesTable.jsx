import { Edit, Eye, ChevronLeft, ChevronRight, SquarePen } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import CourseModuleModal from './CourseModuleModal'; // Adjust the import path as needed
import UpdateCourse from './UpdateCourse';

const CoursesTable = ({ courses, loading, searchTerm, onCourseUpdated }) => {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState(null);

  useEffect(() => { 
    setCurrentPage(1);
  }, [searchTerm]);

  


  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    const coursesArray = Array.isArray(courses) ? courses : [];

    if (!searchTerm) return coursesArray;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return coursesArray.filter((course) => {
      const courseCodeMatch = course.courseCode?.toLowerCase().includes(lowerCaseSearch);
      const titleMatch = course.title?.toLowerCase().includes(lowerCaseSearch);
      const descriptionMatch = course.description?.toLowerCase().includes(lowerCaseSearch);
      
      return courseCodeMatch || titleMatch || descriptionMatch;
    });
  }, [courses, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

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

  // Modal handlers
  const handleOpenModuleModal = (course) => {
    setSelectedCourse(course);
    setIsModuleModalOpen(true);
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setSelectedCourse(null);
  };

  const handleModuleCreated = () => {
    if (onCourseUpdated) {
      onCourseUpdated();
    }
  };
  const handleOpenUpdateModal = (course) => {
    setSelectedCourseForUpdate(course);
    setIsUpdateModalOpen(true);
  };

   const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCourseForUpdate(null);
  };

  const handleCourseUpdated = () => {
    if (onCourseUpdated) {
      onCourseUpdated();
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

  if (loading) {
    return (
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="relative overflow-x-auto min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No courses found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="relative overflow-x-auto min-h-[400px]">
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                <tr>
                  <th className="px-3 py-4">ID</th>
                  <th className="px-2 py-4">Course Code</th>
                  <th className="px-2 py-4">Title</th>
                  <th className="px-2 py-4">Duration (Hours)</th>
                  <th className="px-2 py-4">Description</th>
                  <th className="px-2 py-4">Status</th>
                  <th className="px-2 py-4">Date Created</th>
                  <th className="px-2 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((course, index) => (
                  <tr key={course.courseId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-green-600 whitespace-nowrap">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 py-3 truncate max-w-[150px]">
                      {course.courseCode}
                    </td>
                    <td className="px-2 py-3 truncate max-w-[200px]">
                      {course.title}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {course.durationHours}
                    </td>
                    <td className="px-2 py-3 truncate max-w-[200px]">
                      {course.description || '-'}
                    </td>
                    
                    <td className="px-2 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="flex items-center px-2 py-3 relative">
                      <a
                      onClick={() => handleOpenUpdateModal(course)}
                        className="font-medium text-green-600 cursor-pointer hover:underline flex items-center pr-3"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </a>
                      
                      <a
                        onClick={() => handleOpenModuleModal(course)}
                        className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center pr-3"
                      >
                        <SquarePen className="h-4 w-4 mr-1" />
                        Create Module
                      </a>
                      
                      <a
                        className="font-medium text-saveButton cursor-pointer hover:underline flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Modules
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCourses.length > 0 && (
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
                  {Math.min(indexOfLastItem, filteredCourses.length)} of{" "}
                  {filteredCourses.length} entries
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

      {selectedCourseForUpdate && (
        <UpdateCourse
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          course={selectedCourseForUpdate}
          onCourseUpdated={handleCourseUpdated}
        />
      )}

      {/* Course Module Modal */}
      {selectedCourse && (
        <CourseModuleModal
          isOpen={isModuleModalOpen}
          onClose={handleCloseModuleModal}
          onModuleCreated={handleModuleCreated}
          courseId={selectedCourse.courseId}
          courseTitle={selectedCourse.title}
        />
      )}
    </>
  );
};

export default CoursesTable;