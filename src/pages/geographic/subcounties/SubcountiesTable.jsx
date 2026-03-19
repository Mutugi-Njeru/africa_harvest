// SubcountiesTable.js
import { ClipboardEditIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import SubcountyCoordinatorsModal from "./SubcountyCoordinatorsModal";

const SubcountiesTable = ({ isLoading, subCounties, fetchsubCounties, searchTerm }) => {
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  const [selectedSubcounty, setSelectedSubcounty] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Items per page options
  const itemsPerPageOptions = [5, 10, 15, 25, 50, 100];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleCloseModal = () => {
    setIsCoordinatorsModalOpen(false);
    setSelectedSubcounty(null);
  };

  // Filter subcounties based on search term
  const filterSubcounties = useMemo(() => {
    const subCountiesArray = Array.isArray(subCounties) ? subCounties : [];

    if (!searchTerm) return subCountiesArray;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return subCountiesArray.filter((subcounty) => {
      // Check subcounty title
      if (subcounty.title?.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Check county name
      if (subcounty.countyName?.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Check coordinators
      if (subcounty.coordinators && subcounty.coordinators.length > 0) {
        const hasMatchingCoordinator = subcounty.coordinators.some(
          (coordinator) => {
            const fullName =
              `${coordinator.firstName} ${coordinator.lastName}`.toLowerCase();
            return fullName.includes(lowerCaseSearchTerm);
          }
        );
        if (hasMatchingCoordinator) return true;
      }
      return false;
    });
  }, [subCounties, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterSubcounties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterSubcounties.length / itemsPerPage);

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
    <div>
      <div className="relative overflow-x-auto mt-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <table className="w-full text-xs text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-500 border-b bg-white">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">SubCounty</th>
                  <th className="px-3 py-2">Subcounty Coordinator(s)</th>
                  <th className="px-3 py-2">County</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((subcounty, index) => (
                    <tr
                      key={subcounty.subCountyId}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-3 py-1 font-medium text-green-600 whitespace-nowrap"
                      >
                        {indexOfFirstItem + index + 1}
                      </th>
                      <td className="px-3 py-1 max-w-[200px] truncate">
                        {subcounty.title}
                      </td>
                      <td className="px-3 py-1 max-w-[200px]">
                        <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                          {subcounty.coordinators && subcounty.coordinators.length > 0
                            ? subcounty.coordinators.map((coordinator, idx) => (
                                <span
                                  key={coordinator.userId}
                                  className="truncate"
                                >
                                  {`${coordinator.firstName} ${coordinator.lastName}`}
                                  {idx < subcounty.coordinators.length - 1
                                    ? ","
                                    : ""}
                                </span>
                              ))
                            : "No coordinator assigned"}
                        </div>
                      </td>
                      <td className="px-3 py-1 max-w-[150px] truncate">
                        {subcounty.countyName}
                      </td>
                      <td className="px-3 py-1">
                        <a
                          onClick={() => {
                            setSelectedSubcounty(subcounty);
                            setIsCoordinatorsModalOpen(true);
                          }}
                          className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                        >
                          <ClipboardEditIcon className="h-4 w-4 mr-2" />
                          Assign
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td
                      colSpan="5"
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      {searchTerm ? "No subcounties match your search" : "No subcounties found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filterSubcounties.length > 0 && (
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
                      {Math.min(indexOfLastItem, filterSubcounties.length)} of{" "}
                      {filterSubcounties.length} entries
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
      {isCoordinatorsModalOpen && (
        <SubcountyCoordinatorsModal
          handleCloseModal={handleCloseModal}
          subcounty={selectedSubcounty}
          onCloseModal={fetchsubCounties}
        />
      )}
    </div>
  );
};

export default SubcountiesTable;