import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import EngagementsTable from "./EngagementsTable";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import CreateEngagementModal from "./CreateEngagementModal";

const Engagements = () => {
  const [engagements, setEngagements] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchEngagements();
  }, [accountId]);

  const fetchEngagements = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `/engagements/v1/all/${accountId}`
      );
      setEngagements(response.data.message);
    } catch (error) {
      console.error("Failed to fetch engagements:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Engagements</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Engagement</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <EngagementsTable
        engagements={engagements}
        isLoading={isLoading}
        fetchEngagements={fetchEngagements}
      />
      {isCreateModalOpen && (
        <CreateEngagementModal
          handleCloseModal={handleCloseModal}
          fetchEngagements={fetchEngagements}
        />
      )}
    </div>
  );
};

export default Engagements;
