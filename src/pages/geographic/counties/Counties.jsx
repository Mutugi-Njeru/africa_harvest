import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import CountiesTable from "./CountiesTable";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import axios from "axios";
import AssignCoordinatorModal from "./AssignCoordinatorModal";
import { hasRolePermission } from "../../../utils/Utils";

const Counties = () => {
  const accountId = localStorage.getItem("accountId");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [counties, setCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Added missing searchTerm state
  const userId = Number(localStorage.getItem("userId"));
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  //roles
  const isAdmin = hasRolePermission(userRoles, "ADMIN");

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
  };

  useEffect(() => {
    fetchCounties();
  }, [accountId]);

  //fetch assigned counties by regional coordinator or admin
  const fetchCounties = async () => {
    try {
      setIsLoading(true);
      let countiesWithRegions;

      if (isAdmin) {
        const response = await axios.get(
          BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
        );
        countiesWithRegions = response.data.message.flatMap((region) =>
          region.counties.map((county) => ({
            ...county,
            regionName: region.region,
            updatedAt: region.updatedAt,
            description: region.description,
          }))
        );
      } else {
        const response = await axios.get(
          BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
        );
        const regions = response.data.message.filter((region) =>
          region.coordinators.some((coord) => coord.userId === userId)
        );
        countiesWithRegions = regions.flatMap((region) =>
          region.counties.map((county) => ({
            ...county,
            regionName: region.region,
            updatedAt: region.updatedAt,
            description: region.description,
          }))
        );
      }

      setCounties(countiesWithRegions);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* Header - Counties title only */}
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Regional Extension Agent</div>
      </div>

      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by county, coordinator, or region"
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-2">
          <button
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-createButton hover:bg-yellowOrange cursor-pointer text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Assign County Coordinator</span>
          </button>
          <button className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100 rounded-md">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* table */}
      <CountiesTable
        counties={counties}
        isLoading={isLoading}
        fetchCounties={fetchCounties}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {isAssignModalOpen && (
        <AssignCoordinatorModal
          handleCloseModal={handleCloseModal}
          onCloseModal={fetchCounties}
        />
      )}
    </div>
  );
};

export default Counties;