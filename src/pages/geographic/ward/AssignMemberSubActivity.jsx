import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { toast } from "react-toastify";

const AssignMemberSubActivity = ({
  handleCloseModal,
  onCloseModal,
  member,
}) => {
  const [subActivities, setSubactivities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSubActivity, setSelectedSubActivity] = useState([]);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchSubActivities();
  }, [accountId]);

  //get subactivities
  const fetchSubActivities = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/activities/v1/all/${accountId}`
      );
      if (response.data.isSuccess && response.data.message) {
        const allSubActivities = response.data.message.flatMap(
          (activity) => activity.subActivities || []
        );
        setSubactivities(allSubActivities);
      }
    } catch (error) {
      console.error("Failed to fetch subactivities:", error);
      throw error;
    }
  };

  //assign subactivity
  const handleAssignSubActivity = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const subActivityIds = selectedSubActivity.map(
        (subActivity) => subActivity.value
      );
      const response = await axios.post(
        BASE_REST_API_URL + "/activities/v1/assign-batch-subactivities",
        {
          memberId: member.memberId,
          subActivityIds,
        }
      );
      setSelectedSubActivity([]);
      toast.success("Subactivity assigned successfully");
      handleCloseModal();
      onCloseModal();
    } catch (error) {
      console.log(error);
      toast.error("Adding subactivity failed");
    } finally {
      setIsAdding(false);
    }
  };

  const subActivityOptions = subActivities.map((subActivity) => ({
    value: subActivity.subActivityId,
    label: subActivity.subActivity,
  }));
  const handleSubActivityChange = (selectedOption) => {
    setSelectedSubActivity(selectedOption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-1/3 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Assign Member SubActivity(s)
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select SubActivity(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="subActivities"
                options={subActivityOptions}
                value={selectedSubActivity}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                onChange={handleSubActivityChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              handleCloseModal();
            }}
            className="w-1/2 bg-red-400 text-white p-3 hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              handleAssignSubActivity(e);
            }}
            className="w-1/2 bg-green-500 text-white p-3 hover:bg-green-600"
            disabled={isAdding}
          >
            {isAdding ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMemberSubActivity;
