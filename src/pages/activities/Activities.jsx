import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import ActivitiesTable from "./ActivitiesTable";
import { accountId, BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import CreateActivity from "./CreateActivity";
import CreateSubactivity from "./CreateSubactivity";

const Activities = () => {
  const [showActivities, setShowActivities] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showCreateSubactivityModal, setShowCreateSubactivityModal] =
    useState(false);
  const [activities, setActivities] = useState([]);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchActivities();
  }, [accountId]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BASE_REST_API_URL + `activities/v1/all/${accountId}`
      );
      setActivities(response.data.message);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        {showActivities ? (
          <div className="text-xl font-bold text-gray-600">Activities</div>
        ) : (
          <div className="text-xl font-bold text-gray-600">SubActivities</div>
        )}
        <div className="flex justify-end items-center">
          {showActivities ? (
            <button
              onClick={() => setShowCreateActivityModal(true)}
              className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2 mr-2">Create Activity</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCreateSubactivityModal(true)}
              className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2 mr-2">Create Subactivity</span>
            </button>
          )}

          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black hover:bg-gray-100">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>

      <ActivitiesTable
        showActivities={showActivities}
        activities={activities}
        setShowActivities={setShowActivities}
        isLoading={isLoading}
        fetchActivities={fetchActivities}
      />
      <CreateActivity
        isOpen={showCreateActivityModal}
        onClose={() => setShowCreateActivityModal(false)}
        onActivityCreated={fetchActivities}
      />
      <CreateSubactivity
        isOpen={showCreateSubactivityModal}
        onClose={() => setShowCreateSubactivityModal(false)}
        onSubactivityCreated={fetchActivities}
      />
    </div>
  );
};

export default Activities;
