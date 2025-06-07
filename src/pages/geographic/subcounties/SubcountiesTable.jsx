import { ClipboardEditIcon, Edit, Search } from "lucide-react";
import { useState } from "react";
import SubcountyCoordinatorsModal from "./SubcountyCoordinatorsModal";

const SubcountiesTable = ({ isLoading, subCounties, fetchsubCounties }) => {
  const [isCoordinatorsModalOpen, setIsCoordinatorsModalOpen] = useState(false);
  const [selectedSubcounty, setSelectedSubcounty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="flex items-center justify-between mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by subcounty, coordinator or county"
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
