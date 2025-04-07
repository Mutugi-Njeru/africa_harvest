import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios, { all } from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const AssignWardCoordinatorModal = ({ handleCloseModal, onCloseModal }) => {
  const accountId = localStorage.getItem("accountId");
  const [wards, setWards] = useState([]);
  const [wardCoordinators, setWardCoordinators] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchWardsBySubcountyCoordinator();
    fetchWardCoordinators();
  }, [accountId, userId]);

  // fetch all ward coordinators within that account
  const fetchWardCoordinators = async () => {
    try {
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      const coordinators = response.data.message.filter(
        (user) => user.roles.includes("WARD_CORDINATOR") // || user.isCountyCoordinator
      );
      setWardCoordinators(coordinators);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // //fetch all wards by subcounty coordinator or admin
  const fetchWardsBySubcountyCoordinator = async () => {
    try {
      const hierarchyResponse = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );

      const result = hierarchyResponse.data.message
        .flatMap((region) => region.counties)
        .flatMap((county) => {
          // If user is admin, get all subcounties without filtering by userId
          const matchingSubCounties = isAdmin
            ? county.subCounties
            : county.subCounties.filter((subCounty) =>
                subCounty.coordinators.some((coord) => coord.userId === userId)
              );

          if (matchingSubCounties.length > 0) {
            return {
              countyId: county.countyId,
              subCountyIds: matchingSubCounties.map((sc) => sc.subCountyId),
            };
          }
          return [];
        });

      const countyIds = result.map((item) => item.countyId);
      const subCountyIds = result.flatMap((item) => item.subCountyIds);

      const wardsData = await Promise.all(
        countyIds.map(async (countyId) => {
          try {
            const response = await axios.get(
              BASE_REST_API_URL + `/geographic/v1/counties/simple/${countyId}`
            );
            return response.data.message;
          } catch (error) {
            console.error(
              `Failed to fetch data for county ${countyId}:`,
              error
            );
            return null;
          }
        })
      );

      const wards = wardsData
        .filter((data) => data !== null)
        .flatMap((county) =>
          county.subcounties
            .filter((sub) => subCountyIds.includes(sub.subcountyId))
            .flatMap((sub) => sub.wards)
        );

      setWards(wards);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    }
  };
  // //assign ward coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL + `geographic/v1/wards/${selectedWard}/coordinators`,
        { userIds }
      );
      setSelectedCoordinator([]);
      if (response.data.message && response.data.message.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      }
      handleCloseModal();
      onCloseModal();
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

  const wardOptions = wards.map((ward) => ({
    value: ward.wardId,
    label: ward.title,
  }));
  const wardCoordinatorOptions = wardCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption ? selectedOption.value : null);
  };
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-1/3 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assign Ward Coordinators</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Ward
            </label>
            <div className="flex gap-2">
              <Select
                name="counties"
                options={wardOptions}
                value={wardOptions.find(
                  (option) => option.value === selectedWard
                )}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                isClearable
                onChange={handleWardChange}
                styles={CustomFiltersStyles}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Coordinator(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={wardCoordinatorOptions}
                value={selectedCoordinator}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleCoordinatorChange}
                styles={CustomFiltersStyles}
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
              handleAddCoordinator(e);
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

export default AssignWardCoordinatorModal;
