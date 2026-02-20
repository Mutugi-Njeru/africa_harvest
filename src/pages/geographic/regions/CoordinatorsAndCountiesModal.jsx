import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const CoordinatorsAndCountiesModal = ({
  handleCloseModal,
  region,
  onCloseModal,
}) => {
  const [counties, setCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedCoordinators, setSelectedCoordinators] = useState([]);
  const [selectedRemoveCounties, setSelectedRemoveCounties] = useState([]);
  const [selectedRemoveCoordinators, setSelectedRemoveCoordinators] = useState(
    []
  );
  const [regionCoordinators, setRegionCoordinators] = useState([]);
  const [isAddingCounties, setIsAddingCounties] = useState(false);
  const [isRemovingCounties, setIsRemovingCounties] = useState(false);
  const [isAddingCoordinator, setIsAddingCoordinator] = useState(false);
  const [isRemovingCoordinator, setIsRemovingCoordinator] = useState(false);
  const accountId = localStorage.getItem("accountId");

  //get roles
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");

  //counties and coordinators
  useEffect(() => {
    //get all counties
    const fetchAllCounties = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + "geographic/v1/counties/simple"
        );
        setCounties(response.data.message);
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    };
    //get account regional coordinators
    const fetchAllRegionalCoordinators = async () => {
      try {
        let url = `${BASE_REST_API_URL}/users/v1/all`;
        if (superAdmin) {
          url += `?accountId=${accountId}`;
        }
        const response = await axios.get(url);
        const regionalCoordinators = response.data.message.filter((user) =>
          user.roles.includes("REGIONAL_CORDINATOR")
        );
        setRegionCoordinators(regionalCoordinators);
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      }
    };
    fetchAllRegionalCoordinators();
    fetchAllCounties();
  }, [region.regionId]);

  //   //add counties to region
  const handleAddCounties = async (e) => {
    setIsAddingCounties(true);
    try {
      const countyIds = selectedCounties.map((county) => Number(county.value));
      const response = await axios.post(
        BASE_REST_API_URL +
          `/geographic/v1/regions/${region.regionId}/counties`,
        { countyIds }
      );
      setSelectedCounties([]);
      // fetchRegionCounties();
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
          toast.error("Adding counties failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsAddingCounties(false);
    }
  };
  //   //assign region coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsAddingCoordinator(true);
    try {
      const userIds = selectedCoordinators.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL +
          `/geographic/v1/regions/${region.regionId}/coordinators`,
        { userIds }
      );
      setSelectedCoordinators([]);
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
          toast.error("Adding coordinator failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsAddingCoordinator(false);
    }
  };

  //   //remove coordinator
  const handleRemoveCoordinator = async (e) => {
    e.preventDefault();
    setIsRemovingCoordinator(true);
    try {
      const userIds = selectedRemoveCoordinators.map((user) => user.value);
      const response = await axios.delete(
        BASE_REST_API_URL +
          `/geographic/v1/regions/${region.regionId}/coordinators`,
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
  //   //remove coordinator
  const handleRemoveCounty = async (e) => {
    e.preventDefault();
    setIsRemovingCounties(true);
    try {
      const countyIds = selectedRemoveCounties.map((county) => county.value);
      const response = await axios.delete(
        BASE_REST_API_URL +
          `/geographic/v1/regions/${region.regionId}/counties`,
        { data: { countyIds } }
      );
      setSelectedRemoveCounties([]);
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
          toast.error("removing county(s) failed");
        }
      } else {
        toast.error("Network error or server unavailable");
      }
    } finally {
      setIsRemovingCounties(false);
    }
  };

  const countiesOptions = counties.map((county) => ({
    value: county.countyId,
    label: county.title,
  }));
  const coordinatorsOptions = regionCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  const assignedCoordinatorsOptions =
    region.coordinators?.length > 0
      ? region.coordinators.map((coordinator) => ({
          value: coordinator.userId,
          label: `${coordinator.firstName} ${coordinator.lastName}`,
        }))
      : [];
  const assignedCountiesOptions =
    region.counties?.length > 0
      ? region.counties.map((county) => ({
          value: county.countyId,
          label: county.title,
        }))
      : [];

  const handleCountiesChange = (selectedOptions) => {
    setSelectedCounties(selectedOptions);
  };
  const handleCoordinatorsChange = (selectedOptions) => {
    setSelectedCoordinators(selectedOptions);
  };
  const handleRemovingCoordinatorsChange = (selectedOptions) => {
    setSelectedRemoveCoordinators(selectedOptions);
  };
  const handleRemovingCountiesChange = (selectedOptions) => {
    setSelectedRemoveCounties(selectedOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[800px] ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Manage Counties and coordinators for {region.region}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add County(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="counties"
                options={countiesOptions}
                value={selectedCounties}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleCountiesChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddCounties}
                className="bg-green-600 text-white px-7 py-1 rounded-md"
                disabled={isAddingCounties}
              >
                {isAddingCounties ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Coordinator(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={coordinatorsOptions}
                value={selectedCoordinators}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleCoordinatorsChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddCoordinator}
                className="bg-green-600 text-white px-7 py-1 rounded-md"
                disabled={isAddingCoordinator}
              >
                {isAddingCoordinator ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove County(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="region counties"
                options={assignedCountiesOptions}
                value={selectedRemoveCounties}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleRemovingCountiesChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleRemoveCounty}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                disabled={isRemovingCounties}
              >
                {isRemovingCounties ? "Removing..." : "Remove"}{" "}
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
                {isRemovingCoordinator ? "Removing..." : "Remove"}{" "}
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

export default CoordinatorsAndCountiesModal;
