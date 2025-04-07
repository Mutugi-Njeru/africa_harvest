import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const AssignCoordinatorModal = ({ handleCloseModal, onCloseModal }) => {
  const accountId = localStorage.getItem("accountId");
  const [counties, setCounties] = useState([]);
  const [countyCoordinators, setCountyCoordinators] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchCounties();
    fetchCountyCoordinators();
  }, [accountId, userId]);

  // fetch all users county coordinators
  const fetchCountyCoordinators = async () => {
    try {
      let url = `${BASE_REST_API_URL}/users/v1/all`;
      if (superAdmin) {
        url += `?accountId=${accountId}`;
      }
      const response = await axios.get(url);
      const coordinators = response.data.message.filter(
        (user) => user.roles.includes("COUNTY_CORDINATOR") // || user.isCountyCoordinator
      );
      setCountyCoordinators(coordinators);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  //fetch all counties by regional coordinator or admin
  const fetchCounties = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/geographic/v1/account-regions/${accountId}`
      );
      let counties;
      if (isAdmin) {
        counties = response.data.message.flatMap(
          (region) => region.counties || []
        );
      } else {
        const regions = response.data.message.filter((region) =>
          region.coordinators.some((coord) => coord.userId === userId)
        );
        counties = regions.flatMap((region) => region.counties || []);
      }

      setCounties(counties);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    }
  };

  //assign county coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL +
          `geographic/v1/counties/${selectedCounty}/coordinators`,
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
      setIsLoading(false);
    }
  };

  const countyOptions = counties.map((county) => ({
    value: county.countyId,
    label: county.title,
  }));
  const countyCoordinatorOptions = countyCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  const handleCountyChange = (selectedOption) => {
    setSelectedCounty(selectedOption ? selectedOption.value : null);
  };
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-1/3 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assign County Coordinators</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select County
            </label>
            <div className="flex gap-2">
              <Select
                name="counties"
                options={countyOptions}
                value={countyOptions.find(
                  (option) => option.value === selectedCounty
                )}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                isClearable
                onChange={handleCountyChange}
                styles={CustomFiltersStyles}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Coordinator(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={countyCoordinatorOptions}
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
            disabled={isLoading}
          >
            {isLoading.submitting ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignCoordinatorModal;
