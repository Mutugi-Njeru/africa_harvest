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
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const accountId = localStorage.getItem("accountId");
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  });

  useEffect(() => {
    fetchWards();
    fetchWardCoordinators();
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
      throw error;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <form onSubmit={createGroup}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Group Name"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ward
              </label>
              <Select
                name="wardId"
                options={wardOptions}
                onChange={handleWardChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Group Manager
            </label>
            <Select
              name="wardId"
              options={wardCoordinatorOptions}
              onChange={handleCoordinatorChange}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={CustomFiltersStyles}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-saveButton focus:outline-none focus:ring-1 focus:ring-gray-100"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
            >
              <X size={20} />
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isCreating}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white min-w-[100px] ${
                isCreating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-saveButton hover:bg-yellowOrange"
              }`}
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
        </form>
      </div>
    </div>
  );
};

export default CreateGroupByAdmin;