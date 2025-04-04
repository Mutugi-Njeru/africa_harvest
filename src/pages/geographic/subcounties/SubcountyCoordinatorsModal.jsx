import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const SubcountyCoordinatorsModal = ({
  handleCloseModal,
  onCloseModal,
  subcounty,
}) => {
  const accountId = localStorage.getItem("accountId");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemovingCoordinator, setIsRemovingCoordinator] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [subCountyCoordinators, setSubCountyCoordinators] = useState([]);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const [selectedRemoveCoordinators, setSelectedRemoveCoordinators] = useState(
    []
  );

  useEffect(() => {
    fetchSubCountyCoordinators();
  }, [accountId]);

  // fetch all sub county coordinators within that account
  const fetchSubCountyCoordinators = async () => {
    try {
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      const coordinators = response.data.message.filter(
        (user) => user.roles.includes("SUBCOUNTY_CORDINATOR") // || user.isCountyCoordinator
      );
      setSubCountyCoordinators(coordinators);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  //assign subcounty coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL +
          `geographic/v1/subcounties/${subcounty.subCountyId}/coordinators`,
        { userIds }
      );
      setSelectedCoordinator([]);
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
      onCloseModal(); //refetch subcounties
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message.details)
        ) {
          error.response.data.message.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Adding coordinator failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsAdding(false);
    }
  };
  //remove subcounty coordinator
  const handleRemoveCoordinator = async (e) => {
    e.preventDefault();
    setIsRemovingCoordinator(true);
    try {
      const userIds = selectedRemoveCoordinators.map((user) => user.value);
      const response = await axios.delete(
        BASE_REST_API_URL +
          `/geographic/v1/subcounties/${subcounty.subCountyId}/coordinators`,
        { data: { userIds } }
      );
      setSelectedRemoveCoordinators([]);
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message.details)
        ) {
          error.response.data.message.details.forEach((detail) => {
            toast.error(detail);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("removing coordinator(s) failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsRemovingCoordinator(false);
    }
  };

  const subcountyCoordinatorOptions = subCountyCoordinators.map(
    (coordinator) => ({
      value: coordinator.userId,
      label: `${coordinator.firstName} ${coordinator.lastName}`,
    })
  );
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };

  const assignedCoordinatorsOptions =
    subcounty.coordinators?.length > 0
      ? subcounty.coordinators.map((coordinator) => ({
          value: coordinator.userId,
          label: `${coordinator.firstName} ${coordinator.lastName}`,
        }))
      : [];
  const handleRemovingCoordinatorsChange = (selectedOptions) => {
    setSelectedRemoveCoordinators(selectedOptions);
  };

  return (
    // done by county coordinator
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[800px] ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Manage subcounty coordinators
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Coordinator(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={subcountyCoordinatorOptions}
                value={selectedCoordinator}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleCoordinatorChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddCoordinator}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Coordinator(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={assignedCoordinatorsOptions}
                value={selectedRemoveCoordinators}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleRemovingCoordinatorsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemoveCoordinator}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                disabled={isRemovingCoordinator}
              >
                {isRemovingCoordinator ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              handleCloseModal();
              onCloseModal();
            }}
            className="w-1/2 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcountyCoordinatorsModal;
