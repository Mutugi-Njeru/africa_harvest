import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import CountiesTable from "./CountiesTable";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import axios from "axios";
import AssignCoordinatorModal from "./AssignCoordinatorModal";

const Counties = () => {
  const accountId = localStorage.getItem("accountId");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [counties, setCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = Number(localStorage.getItem("userId"));

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
  };

  useEffect(() => {
    fetchCounties();
  }, [accountId]);

  //fetch assigned counties by regional coordinator
  const fetchCounties = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      const regions = response.data.message.filter((region) =>
        region.coordinators.some((coord) => coord.userId === userId)
      );
      const countiesWithRegions = regions.flatMap((region) =>
        region.counties.map((county) => ({
          ...county,
          regionName: region.region,
          updatedAt: region.updatedAt,
          description: region.description,
        }))
      );
      setCounties(countiesWithRegions);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Counties</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Assign County Coordinator</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <CountiesTable
        counties={counties}
        isLoading={isLoading}
        fetchCounties={fetchCounties}
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
