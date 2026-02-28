// Subcounties.js
import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import AssignSubCountyCoordinatorModal from "./AssignSubCountyCoordinatorModal";
import SubcountiesTable from "./SubcountiesTable";
import { hasRolePermission } from "../../../utils/Utils";

const Subcounties = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subCounties, setSubCounties] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const accountId = localStorage.getItem("accountId");
  const userId = Number(localStorage.getItem("userId"));
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  //roles
  const isAdmin = hasRolePermission(userRoles, "ADMIN");

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchsubCounties();
  }, [accountId]);

  //fetch subcounties for county coordinator
  const fetchsubCounties = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      let subCounties;
      if (isAdmin) {
        subCounties = response.data.message
          .flatMap((region) => region.counties)
          .flatMap((county) =>
            county.subCounties.map((subCounty) => ({
              ...subCounty,
              countyName: county.title,
            }))
          );
      } else {
        const counties = response.data.message
          .flatMap((region) => region.counties)
          .filter((county) =>
            county.coordinators.some((coord) => coord.userId === userId)
          );
        subCounties = counties.flatMap((county) =>
          county.subCounties.map((subCounty) => ({
            ...subCounty,
            countyName: county.title,
          }))
        );
      }

      setSubCounties(subCounties);
    } catch (error) {
      console.error("Failed to fetch subcounties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">County Extension Agents</div>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by subcounty, coordinator or county"
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-saveButton focus:ring-1 focus:ring-gray-100 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-createButton hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Assign SubC Coordinator</span>
          </button>
          <button className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* table */}
      <SubcountiesTable
        subCounties={subCounties}
        isLoading={isLoading}
        fetchsubCounties={fetchsubCounties}
        searchTerm={searchTerm}
      />
      
      {isAssignModalOpen && (
        <AssignSubCountyCoordinatorModal
          handleCloseModal={handleCloseModal}
          onCloseModal={fetchsubCounties}
        />
      )}
    </div>
  );
};

export default Subcounties;