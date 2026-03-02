// Wards.js
import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import WardsTable from "./WardsTable";
import AssignWardCoordinatorModal from "./AssignWardCoordinatorModal";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const Wards = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    fetchWards();
  }, [accountId, userId]);

  //fetch wards for sub county coordinator
  const fetchWards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      if (isAdmin) {
        const wards = response.data.message
          .flatMap((region) => region.counties)
          .flatMap((county) => county.subCounties)
          .flatMap((subCounty) =>
            subCounty.wards.map((ward) => ({
              ...ward,
              subCountyName: subCounty.title,
              countyName: subCounty.county.title,
            }))
          );
        setWards(wards);
      } else {
        const subCounties = response.data.message
          .flatMap((region) => region.counties)
          .flatMap((county) => county.subCounties)
          .filter((subCounty) =>
            subCounty.coordinators.some((coord) => coord.userId === userId)
          );
        const wards = subCounties.flatMap((subCounty) =>
          subCounty.wards.map((ward) => ({
            ...ward,
            subCountyName: subCounty.title,
            countyName: subCounty.county.title,
          }))
        );
        setWards(wards);
      }
    } catch (error) {
      console.error("Failed to fetch wards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    //done by subcounty coordinator
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Subcounty Extension agent</div>
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
            placeholder="Search by ward, coordinator or subcounty"
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
            <span className="ml-2 mr-2">Assign TOT/VBS</span>
          </button>
          <button className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* table */}
      <WardsTable 
        wards={wards} 
        isLoading={isLoading} 
        fetchWards={fetchWards}
        searchTerm={searchTerm}
      />
      
      {isAssignModalOpen && (
        <AssignWardCoordinatorModal
          handleCloseModal={handleCloseModal}
          onCloseModal={fetchWards}
        />
      )}
    </div>
  );
};

export default Wards;