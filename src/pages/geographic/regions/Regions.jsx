import { Download, Plus } from "lucide-react";
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

  useEffect(() => {
    fetchRegions();
  }, [accountId]);

  const fetchRegions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/geographic/v1/account-regions/${accountId}`
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

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Regions</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => setShowCreateRegionModal(true)}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Region</span>
          </button>
          <button
            onClick={downloadRegions}
            className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black hover:bg-gray-100"
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
