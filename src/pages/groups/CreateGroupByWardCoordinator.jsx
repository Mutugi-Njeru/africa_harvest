import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const CreateGroupByWardCoordinator = ({ handleCloseModal, fetchGroups }) => {
  const userId = Number(localStorage.getItem("userId"));
  const accountId = localStorage.getItem("accountId");
  const [wards, setWards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  });

  useEffect(() => {
    fetchWards();
  }, [accountId, userId]);

  // fetch all wards by ward coordinator
  const fetchWards = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      const wards = response.data.message.flatMap((region) =>
        region.counties.flatMap((county) =>
          county.subCounties.flatMap((subCounty) =>
            subCounty.wards.filter((ward) =>
              ward.coordinators.some(
                (coordinator) => coordinator.userId === userId
              )
            )
          )
        )
      );
      setWards(wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Failed to fetch wards");
    }
  };

  //create group
  const createGroup = async (e) => {
    e.preventDefault();
    if (!selectedWard) {
      toast.error("Please select a ward");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        ...formData,
        wardId: selectedWard.value,
      };
      await axios.post(BASE_REST_API_URL + "groups/v1/create", payload);

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
        <h2 className="text-lg font-semibold mb-4">
          Create Group By Ward Coordinator
        </h2>
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
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            <div className="">
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
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              rows="3"
            />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupByWardCoordinator;
