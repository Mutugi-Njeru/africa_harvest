import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const CreateGroupByAdmin = ({ handleCloseModal, fetchGroups }) => {
  const [wards, setWards] = useState([]);
  const [wardCoordinators, setWardCoordinators] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  });

  useEffect(() => {
    if (accountId) {
      fetchWards();
      fetchWardCoordinators();
    }
  }, [accountId]);

  // fetch all wards
  const fetchWards = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`,
      );
      const wards = response.data.message.flatMap((region) =>
        region.counties.flatMap((county) =>
          county.subCounties.flatMap((subCounty) => subCounty.wards),
        ),
      );
      setWards(wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Failed to fetch wards");
    }
  };
  
  // fetch all ward coordinators within that account
  const fetchWardCoordinators = async () => {
    try {
      let url = BASE_REST_API_URL + "/users/v1/all";
      const response = await axios.get(url);
      const coordinators = response.data.message.filter((user) =>
        user.roles.includes("WARD_CORDINATOR"),
      );
      setWardCoordinators(coordinators);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch ward coordinators");
    }
  };
  
  //create group
  const createGroup = async (e) => {
    e.preventDefault();
    if (!selectedWard || !selectedCoordinator) {
      toast.error("Please select both ward and coordinator");
      return;
    }
    setIsCreating(true);
    try {
      const payload = {
        ...formData,
        wardId: selectedWard.value,
      };
      await axios.post(
        BASE_REST_API_URL +
          `groups/v1/create?userId=${selectedCoordinator.value}`,
        payload,
      );

      toast.success("Group created successfully!");
      handleCloseModal();
      fetchGroups();
      
      // Reset form
      setFormData({
        groupName: "",
        description: "",
      });
      setSelectedWard(null);
      setSelectedCoordinator(null);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const wardOptions = wards.map((ward) => ({
    value: ward.wardId,
    label: ward.title,
  }));
  
  const wardCoordinatorOptions = wardCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!handleCloseModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Create Group</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={createGroup} id="create-group-form">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  placeholder="Group Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward
                </label>
                <Select
                  name="wardId"
                  options={wardOptions}
                  onChange={handleWardChange}
                  value={selectedWard}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={CustomFiltersStyles}
                  placeholder="Select Ward..."
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Manager
              </label>
              <Select
                name="coordinatorId"
                options={wardCoordinatorOptions}
                onChange={handleCoordinatorChange}
                value={selectedCoordinator}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                placeholder="Select Group Manager..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                rows="3"
                placeholder="Enter group description..."
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={handleCloseModal}
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-white text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Cancel
          </button>
          
          <button
            type="submit"
            form="create-group-form"
            disabled={isCreating}
            className={`flex items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px] ${
              isCreating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-saveButton hover:bg-yellowOrange"
            } text-white`}
          >
            {isCreating ? (
              "Creating..."
            ) : (
              <>
                <Check size={20} />
                Create
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupByAdmin;