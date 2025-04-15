import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import EngagementsTable from "./EngagementsTable";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";

const Engagements = () => {
  const [engagements, setEngagements] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
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

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Engagements</div>
        <div className="flex justify-end items-center">
          <button className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white">
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
      <EngagementsTable engagements={engagements} isLoading={isLoading} />
    </div>
  );
};

export default Engagements;
