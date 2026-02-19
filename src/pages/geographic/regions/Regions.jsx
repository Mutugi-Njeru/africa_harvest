import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import RegionsTable from "./RegionsTable";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import CreateRegion from "./CreateRegion";
import { exportRegionsToCSV } from "../../../utils/Utils";

const Regions = () => {
  const accountId = localStorage.getItem("accountId");
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [showCreateRegionModal, setShowCreateRegionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRegions();
  }, [accountId]);

  const fetchRegions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/geographic/v1/account-regions/${accountId}`,
      );
      setRegions(response.data.message);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRegions = () => {
    exportRegionsToCSV(regions);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* Header - Regions title only */}
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Regions</div>
      </div>

      {/* Search and Buttons Row */}
      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by region name, coordinator..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end">
          <button
            onClick={() => setShowCreateRegionModal(true)}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Region</span>
          </button>
          <button
            onClick={downloadRegions}
            className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black hover:bg-gray-100 rounded-md"
          >
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>

      {/* table */}
      <RegionsTable
        regions={regions}
        isLoading={isLoading}
        fetchRegions={fetchRegions}
        searchTerm={searchTerm}
      />

      <CreateRegion
        isOpen={showCreateRegionModal}
        onClose={() => setShowCreateRegionModal(false)}
        onRegionCreated={fetchRegions}
      />
    </div>
  );
};

export default Regions;
