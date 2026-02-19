import { useState, useMemo } from "react";
import { ClipboardEditIcon } from "lucide-react";
import CoordinatorsAndCountiesModal from "./CoordinatorsAndCountiesModal";

const RegionsTable = ({ regions = [], isLoading, fetchRegions, searchTerm }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);

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
                  {filteredRegions.length > 0 ? (
                    filteredRegions.map((region, index) => (
                      <tr
                        key={region.regionId || index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {index + 1}
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