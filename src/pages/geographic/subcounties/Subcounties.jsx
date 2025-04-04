import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import AssignSubCountyCoordinatorModal from "./AssignSubCountyCoordinatorModal";
import SubcountiesTable from "./SubcountiesTable";

const Subcounties = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subCounties, setSubCounties] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const userId = Number(localStorage.getItem("userId"));

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
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
      const counties = response.data.message
        .flatMap((region) => region.counties)
        .filter((county) =>
          county.coordinators.some((coord) => coord.userId === userId)
        );
      const subCounties = counties.flatMap((county) =>
        county.subCounties.map((subCounty) => ({
          ...subCounty,
          countyName: county.title,
        }))
      );
      setSubCounties(subCounties);
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
        <div className="text-xl font-bold text-gray-600">Subcounties</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Assign SubC Coordinator</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <SubcountiesTable
        subCounties={subCounties}
        isLoading={isLoading}
        fetchsubCounties={fetchsubCounties}
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
