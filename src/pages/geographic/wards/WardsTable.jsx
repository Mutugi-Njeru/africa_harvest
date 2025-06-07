import { ClipboardEditIcon, Search } from "lucide-react";
import WardCoordinatorsModal from "./WardCoordinatorsModal";
import { useState } from "react";

const WardsTable = ({ wards, isLoading, fetchWards }) => {
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setIsCoordinatorsModalOpen(false);
    setSelectedWard(null);
  };

  const filterWards = () => {
    if (!searchTerm) return wards;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return wards.filter((ward) => {
      // Check ward title
      if (ward.title.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check subcounty name
      if (ward.subCountyName.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check county name
      if (ward.countyName.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check coordinators
      if (ward.coordinators && ward.coordinators.length > 0) {
        const hasMatchingCoordinator = ward.coordinators.some((coordinator) => {
          const fullName =
            `${coordinator.firstName} ${coordinator.lastName}`.toLowerCase();
          return fullName.includes(lowerCaseSearchTerm);
        });

        if (hasMatchingCoordinator) return true;
      }

      return false;
    });
  };

  const filteredWards = filterWards();

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
              placeholder="Search by ward, coordinator or subcounty"
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
                    <th className="px-6 py-4">Ward</th>
                    <th className="px-6 py-4">Ward Coordinator</th>
                    <th className="px-6 py-4">Sub County</th>
                    <th className="px-6 py-4">County</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWards.length > 0 ? (
                    filteredWards.map((ward, index) => (
                      <tr
                        key={ward.wardId}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {ward.title}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {ward.coordinators && ward.coordinators.length > 0
                              ? ward.coordinators.map((coordinator, idx) => (
                                  <span
                                    key={coordinator.userId}
                                    className="truncate"
                                  >
                                    {`${coordinator.firstName} ${coordinator.lastName}`}
                                    {idx < ward.coordinators.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))
                              : "No coordinator assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-3">{ward.subCountyName}</td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {ward.countyName}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedWard(ward);
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
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td colSpan="6" className="px-6 py-4 text-center">
                        No wards found matching your search
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
        <WardCoordinatorsModal
          handleCloseModal={handleCloseModal}
          ward={selectedWard}
          onCloseModal={fetchWards}
        />
      )}
    </div>
  );
};

export default WardsTable;
