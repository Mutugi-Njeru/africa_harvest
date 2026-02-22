import { ClipboardEditIcon, Edit, Search, Trash2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import UpdateActivity from "./UpdateActivity";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const ActivitiesTable = ({
  showActivities,
  setShowActivities,
  activities,
  isLoading,
  fetchActivities,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSubactivity, setSelectedSubactivity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSubActivityModal, setShowDeleteSubActivityModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const deleteActivity = async (activityId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/activities/v1/${activityId}`
      );
      toast.success(response.data.message);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error(error.response?.data?.message || "Cannot delete activity");
    }
  };
  
  const deleteSubActivity = async (subAtivityId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/activities/v1/sub/${subAtivityId}`
      );
      toast.success(response.data.message);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting subactivity:", error);
      toast.error(error.response?.data?.message || "Cannot delete subactivity");
    }
  };

  // Filter activities based on search term
  const filteredActivities = useMemo(() => {
    if (!searchTerm.trim()) return activities;
    
    return activities.filter(activity => 
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

  // Create all subactivities with parent activity info
  const allSubactivities = useMemo(() => {
    return activities.flatMap((activity) =>
      (activity.subActivities || []).map((sub) => ({
        ...sub,
        parentActivity: activity.activity,
      }))
    );
  }, [activities]);

  // Filter subactivities based on search term
  const filteredSubactivities = useMemo(() => {
    if (!searchTerm.trim()) return allSubactivities;
    
    return allSubactivities.filter(subactivity => 
      subactivity.subActivity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subactivity.parentActivity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSubactivities, searchTerm]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedActivity(null);
  };
  
  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
    setIsUpdateModalOpen(true);
  };
  
  const handleConfirmDeletion = () => {
    if (selectedActivity) {
      deleteActivity(selectedActivity.activityId);
      setShowDeleteModal(false);
      setSelectedActivity(null);
    }
  };
  
  const handleConfirmSubactivityDeletion = () => {
    if (selectedSubactivity) {
      deleteSubActivity(selectedSubactivity.subActivityId);
      setShowDeleteSubActivityModal(false);
      setSelectedSubactivity(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="border border-gray-200 flex items-center justify-between p-1 rounded-lg bg-gray-50">
            <button
              onClick={() => setShowActivities(true)}
              className={`mr-2 text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 shadow-sm ${
                showActivities ? "text-white bg-green-800" : "bg-transparent"
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setShowActivities(false)}
              className={`text-base font-bold rounded-md px-5 py-2 text-gray-700 hover:bg-gray-100 focus:text-white focus:bg-green-800 transition-colors shadow-sm ${
                !showActivities ? "text-white bg-green-800" : "bg-transparent"
              }`}
            >
              Subactivities
            </button>
          </div>
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={showActivities ? "Search by activity..." : "Search by subactivity or activity..."}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-72 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent"
            />
          </div>
        </div>

        <div className="relative overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
            </div>
          ) : showActivities ? (
            <div>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm ? "No activities match your search" : "No activities available"}
                </div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Activity</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4">Updated At</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity, index) => (
                      <tr
                        key={activity.activityId}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {activity.activity}
                        </td>
                        <td className="px-6 py-3">{activity.description}</td>
                        <td className="px-6 py-3">{activity.createdAt}</td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {activity.updatedAt}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <a
                            onClick={() => handleEditClick(activity)}
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedActivity(activity);
                                setShowDeleteModal(true);
                              }}
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              {filteredSubactivities.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm ? "No subactivities match your search" : "No subactivities available"}
                </div>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Subactivity</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Activity</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4">Updated At</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubactivities.map((subactivity, index) => (
                      <tr
                        key={subactivity.subActivityId}
                        className="bg-white border-b  hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-3 truncate max-w-[200px]">
                          {subactivity.subActivity}
                        </td>
                        <td className="px-6 py-3">-</td>
                        <td className="px-6 py-3">
                          {subactivity.parentActivity}
                        </td>
                        <td className="px-6 py-3">{subactivity.createdAt}</td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {subactivity.updatedAt}
                        </td>
                        <td className="flex items-center px-6 py-3 relative">
                          <a className="font-medium text-green-600 cursor-pointer hover:underline flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedSubactivity(subactivity);
                                setShowDeleteSubActivityModal(true);
                              }}
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this activity?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletion}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteSubActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this subActivity?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteSubActivityModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubactivityDeletion}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isUpdateModalOpen && (
        <UpdateActivity
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          activity={selectedActivity}
          fetchActivities={fetchActivities}
        />
      )}
    </div>
  );
};

export default ActivitiesTable;