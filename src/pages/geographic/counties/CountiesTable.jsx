import {
  ChevronDown,
  ClipboardEditIcon,
  Edit,
  Ellipsis,
  Lock,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import CountyCoordinatorsModal from "./CountyCoordinatorsModal";

const CountiesTable = ({ counties, isLoading, fetchCounties }) => {
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setIsCoordinatorsModalOpen(false);
    setSelectedCounty(null);
  };

  const filterCounties = () => {
    if (!searchTerm) return counties;

    const term = searchTerm.toLowerCase();
    return counties.filter((county) => {
      // Check county title
      if (county.title.toLowerCase().includes(term)) return true;

      // Check region name
      if (county.regionName?.toLowerCase().includes(term)) return true;

      // Check coordinators
      if (
        county.coordinators?.some((coordinator) =>
          `${coordinator.firstName} ${coordinator.lastName}`
            .toLowerCase()
            .includes(term)
        )
      )
        return true;

      return false;
    });
  };

  const filteredCounties = filterCounties();

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by county, coordinator, or region"
              className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">County</th>
                    <th className="px-6 py-4">County Coordinator(s)</th>
                    <th className="px-6 py-4">Region Name</th>
                    <th className="px-6 py-4">Region Description</th>
                    <th className="px-6 py-4">UpdatedAt</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCounties.length > 0 ? (
                    filteredCounties.map((county, index) => (
                      <tr
                        key={county.countyId}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {county.title}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {county.coordinators &&
                            county.coordinators.length > 0
                              ? county.coordinators.map((coordinator, idx) => (
                                  <span
                                    key={coordinator.userId}
                                    className="truncate"
                                  >
                                    {`${coordinator.firstName} ${coordinator.lastName}`}
                                    {idx < county.coordinators.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))
                              : "No coordinator assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-3">{county.regionName}</td>
                        <td className="px-6 py-3">
                          {county.description
                            ? county.description
                            : "no description added"}
                        </td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {county.updatedAt}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedCounty(county);
                                setIsCoordinatorsModalOpen(true);
                              }}
                              className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                            >
                              <ClipboardEditIcon className="h-4 w-4 mr-1" />
                              Assign
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        No counties found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {isCoordinatorsModalOpen && (
        <CountyCoordinatorsModal
          handleCloseModal={handleCloseModal}
          county={selectedCounty}
          onCloseModal={fetchCounties}
        />
      )}
    </div>
  );
};

export default CountiesTable;
