import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import ActivitiesTable from "./ActivitiesTable";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import CreateActivity from "./CreateActivity";
import CreateSubactivity from "./CreateSubactivity";
import { toast } from "react-toastify";

const Activities = () => {
  const [showActivities, setShowActivities] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showCreateSubactivityModal, setShowCreateSubactivityModal] = useState(false);
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
      toast.error("Failed to fetch activities");
    } finally {
      setIsLoading(false);
    }
  };

  // Download CSV function - implemented like Groups component
  const downloadCSV = () => {
    try {
      if (!activities || activities.length === 0) {
        toast.warning("No data available to download");
        return;
      }

      if (showActivities) {
        // Download Activities CSV
        const headers = [
          "Activity Name",
          "Description",
          "Created Date",
          "Updated Date"
        ];

        const csvData = activities.map(activity => [
          activity.activity || '',
          activity.description || 'N/A',
          activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A',
          activity.updatedAt ? new Date(activity.updatedAt).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.map(cell => 
            typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
          ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `activities_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Activities CSV downloaded successfully");
      } else {
        // Download Subactivities CSV
        // Flatten subactivities with parent info
        const allSubactivities = activities.flatMap(activity =>
          (activity.subActivities || []).map(sub => ({
            ...sub,
            parentActivity: activity.activity
          }))
        );

        if (allSubactivities.length === 0) {
          toast.warning("No subactivities available to download");
          return;
        }

        const headers = [
          "Subactivity Name",
          "Description",
          "Parent Activity",
          "Created Date",
          "Updated Date"
        ];

        const csvData = allSubactivities.map(sub => [
          sub.subActivity || '',
          sub.description || 'N/A',
          sub.parentActivity || 'N/A',
          sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A',
          sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.map(cell => 
            typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
          ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `subactivities_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Subactivities CSV downloaded successfully");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV");
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* Header */}
      <div className="mt-3 mb-4">
        {showActivities ? (
          <div className="text-xl font-bold text-gray-600">Activities</div>
        ) : (
          <div className="text-xl font-bold text-gray-600">SubActivities</div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Empty div to maintain flex layout (since search is in ActivitiesTable) */}
        <div></div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end">
          {showActivities ? (
            <button
              onClick={() => setShowCreateActivityModal(true)}
              className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white rounded-md"
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2 mr-2">Create Activity</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCreateSubactivityModal(true)}
              className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white rounded-md"
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2 mr-2">Create Subactivity</span>
            </button>
          )}

          <button 
            onClick={downloadCSV}
            className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100"
            title={`Download ${showActivities ? 'activities' : 'subactivities'} as CSV`}
            disabled={!activities || activities.length === 0}
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Table */}
      <ActivitiesTable
        showActivities={showActivities}
        activities={activities}
        setShowActivities={setShowActivities}
        isLoading={isLoading}
        fetchActivities={fetchActivities}
      />
      
      {/* Modals */}
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