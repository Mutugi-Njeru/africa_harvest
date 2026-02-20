import { useState, useMemo } from "react";
import { ClipboardEditIcon, ChevronLeft, ChevronRight } from "lucide-react";
import CoordinatorsAndCountiesModal from "./CoordinatorsAndCountiesModal";

const RegionsTable = ({ regions = [], isLoading, fetchRegions, searchTerm }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleCloseModal = () => {
    setIsCoordinatorsModalOpen(false);
    setSelectedRegion(null);
  };

  // Filter regions based on search term
  const filteredRegions = useMemo(() => {
    const regionsArray = Array.isArray(regions) ? regions : [];

    if (!searchTerm) return regionsArray;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return regionsArray.filter((region) => {
      const regionNameMatch = region.region
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const descriptionMatch = region.description
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const coordinatorsMatch = region.coordinators?.some((coordinator) => {
        const fullName =
          `${coordinator.firstName} ${coordinator.lastName}`.toLowerCase();
        return fullName.includes(lowerCaseSearch);
      });

      return regionNameMatch || descriptionMatch || coordinatorsMatch;
    });
  }, [regions, searchTerm]);

  // Reset to first page when search term changes
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when page changes
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
                    <th className="px-3 py-4">ID</th>
                    <th className="px-2 py-4">Region</th>
                    <th className="px-1 py-4">Description</th>
                    <th className="px-2 py-4">Coordinator</th>
                    <th className="px-6 py-4">Counties</th>
                    <th className="px-6 py-4">Updated At</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((region, index) => (
                      <tr
                        key={region.regionId || index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="px-1 py-3 truncate max-w-[200px]">
                          {region.region || "N/A"}
                        </td>
                        <td className="px-1 py-3 truncate max-w-[200px]">
                          {region.description || "N/A"}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {region.coordinators && region.coordinators.length > 0
                              ? region.coordinators.map((coordinator, idx) => (
                                  <span
                                    key={coordinator.userId}
                                    className="truncate"
                                  >
                                    {`${coordinator.firstName} ${coordinator.lastName}`}
                                    {idx < region.coordinators.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))
                              : "No coordinator assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {region.counties && region.counties.length > 0
                              ? region.counties.map((county, idx) => (
                                  <span
                                    key={county.countyId}
                                    className="truncate"
                                  >
                                    {county.title}
                                    {idx < region.counties.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))
                              : "No county assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {region.updatedAt || "N/A"}
                        </td>
                        <td className="px-6 py-3">
                          <a
                            onClick={() => {
                              setSelectedRegion(region);
                              setIsCoordinatorsModalOpen(true);
                            }}
                            className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                          >
                            <ClipboardEditIcon className="h-4 w-4 mr-1" />
                            Assign
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchTerm ? "No regions match your search" : "No regions found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRegions.length > 0 && (
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
                  {/* Showing entries text moved to left side */}
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredRegions.length)} of{" "}
                    {filteredRegions.length} entries
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
      {isCoordinatorsModalOpen && (
        <CoordinatorsAndCountiesModal
          handleCloseModal={handleCloseModal}
          region={selectedRegion}
          onCloseModal={fetchRegions}
          fetchRegions={fetchRegions}
        />
      )}
    </div>
  );
};

export default RegionsTable;