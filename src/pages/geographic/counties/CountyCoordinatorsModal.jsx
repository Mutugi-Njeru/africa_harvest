import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const CountyCoordinatorsModal = ({
  handleCloseModal,
  onCloseModal,
  county,
}) => {
  const accountId = localStorage.getItem("accountId");
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const userId = Number(localStorage.getItem("userId"));
  const [countyCoordinators, setCountyCoordinators] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [isAddingCoordinator, setIsAddingCoordinator] = useState(false);
  const [isRemovingCoordinator, setIsRemovingCoordinator] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [selectedRemoveCoordinators, setSelectedRemoveCoordinators] = useState(
    []
  );

  useEffect(() => {
    fetchCountyCoordinators();
    fetchCoordinatorSubcounties();
  }, [accountId, county.countyId]);

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
  //get All subcounties within regional coordinator
  const fetchCoordinatorSubcounties = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + "/geographic/v1/regions"
      );
      const currentCountyId = county.countyId;
      const targetSubcounties = response.data.message
        .flatMap((region) =>
          region.counties.filter((c) => c.countyId === currentCountyId)
        )
        .flatMap((county) => county.subcounties);
      setSubCounties(targetSubcounties);
    } catch (error) {
      console.error("Failed to fetch subcounties:", error);
      toast.error("Failed to fetch subcounties");
    }
  };

  //assign county coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsAddingCoordinator(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL +
          `geographic/v1/counties/${county.countyId}/coordinators`,
        { userIds }
      );
      setSelectedCoordinator([]);
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
          `/geographic/v1/counties/${county.countyId}/coordinators`,
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

  const countyCoordinatorOptions = countyCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  // const subcountyOptions = subCounties.map((subCounty) => ({
  //   value: subCounty.subcountyId,
  //   label: subCounty.title,
  // }));

  const assignedCoordinatorsOptions =
    county.coordinators?.length > 0
      ? county.coordinators.map((coordinator) => ({
          value: coordinator.userId,
          label: `${coordinator.firstName} ${coordinator.lastName}`,
        }))
      : [];
  // const assignedSubCountiesOptions =
  //   county.subCounties?.length > 0
  //     ? county.subCounties.map((subcounty) => ({
  //         value: subcounty.subcountyId,
  //         label: subcounty.title,
  //       }))
  //     : [];
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };
  const handleRemovingCoordinatorsChange = (selectedOptions) => {
    setSelectedRemoveCoordinators(selectedOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[800px] ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage County coordinators</h3>
        </div>

        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Subcounty(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="counties"
                options={subcountyOptions}
                // value={selectedCounties}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                // onChange={handleCountiesChange}
                styles={CustomFiltersStyles}
              />
              <button
                // onClick={handleAddCounties}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                // disabled={isAddingCounties}
              >
                {isAddingCounties ? "Adding..." : "Add"}
              </button>
            </div>
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add County Coordinator(s)
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
              <button
                onClick={handleAddCoordinator}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={isAddingCoordinator}
              >
                {isAddingCoordinator ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Subcounty(s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="region counties"
                options={assignedSubCountiesOptions}
                // value={selectedUserPermissions}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                // onChange={handleUserPermissionsChange}
                styles={CustomFiltersStyles}
              />
              <button
                // onClick={handleRemovePermissions}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                // disabled={isRemovingPermission}
              >
                {isRemovingPermission ? "Removing..." : "Remove"}{" "}
              </button>
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove County Coordinator(s)
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

export default CountyCoordinatorsModal;
