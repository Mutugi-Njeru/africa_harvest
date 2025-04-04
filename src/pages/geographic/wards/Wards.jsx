import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import WardsTable from "./WardsTable";
import AssignWardCoordinatorModal from "./AssignWardCoordinatorModal";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";

const Wards = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const userId = Number(localStorage.getItem("userId"));
  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
  };

  useEffect(() => {
    fetchWards();
  }, [accountId]);

  //fetch wards for sub county coordinator
  const fetchWards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      const subCounties = response.data.message
        .flatMap((region) => region.counties)
        .flatMap((county) => county.subCounties)
        .filter((subCounty) =>
          subCounty.coordinators.some((coord) => coord.userId === 6)
        );
      const wards = subCounties.flatMap((subCounty) =>
        subCounty.wards.map((ward) => ({
          ...ward,
          subCountyName: subCounty.title,
          countyName: subCounty.county.title,
        }))
      );
      setWards(wards);
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
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Wards</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Assign Ward Coordinator</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <WardsTable wards={wards} />
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
