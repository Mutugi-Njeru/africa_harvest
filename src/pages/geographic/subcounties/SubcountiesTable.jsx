// SubcountiesTable.js
import { ClipboardEditIcon } from "lucide-react";
import { useState } from "react";
import SubcountyCoordinatorsModal from "./SubcountyCoordinatorsModal";

const SubcountiesTable = ({ isLoading, subCounties, fetchsubCounties, searchTerm }) => {
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  const [selectedSubcounty, setSelectedSubcounty] = useState(false);

  const handleCloseModal = () => {
    setIsCoordinatorsModalOpen(false);
    setSelectedSubcounty(null);
  };

  const filterSubcounties = () => {
    if (!searchTerm) return subCounties;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return subCounties.filter((subcounty) => {
      // Check subcounty title
      if (subcounty.title.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check county name
      if (subcounty.countyName.toLowerCase().includes(lowerCaseSearchTerm)) {
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
  };

  const filteredSubcounties = filterSubcounties();

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
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">SubCounty</th>
                    <th className="px-6 py-4">Subcounty Coordinator(s)</th>
                    <th className="px-6 py-4">County</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubcounties.length > 0 ? (
                    filteredSubcounties.map((subcounty, index) => (
                      <tr
                        key={subcounty.subCountyId}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {subcounty.title}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                            {subcounty.coordinators &&
                            subcounty.coordinators.length > 0
                              ? subcounty.coordinators.map(
                                  (coordinator, idx) => (
                                    <span
                                      key={coordinator.userId}
                                      className="truncate"
                                    >
                                      {`${coordinator.firstName} ${coordinator.lastName}`}
                                      {idx < subcounty.coordinators.length - 1
                                        ? ","
                                        : ""}
                                    </span>
                                  )
                                )
                              : "No coordinator assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-3">{subcounty.countyName}</td>

                        <td className="flex items-center px-6 py-3">
                          <a
                            onClick={() => {
                              setSelectedSubcounty(subcounty);
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
                      <td colSpan="5" className="px-6 py-4 text-center">
                        No subcounties found matching your search
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