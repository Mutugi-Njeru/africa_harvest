import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";
import { Check, X } from "lucide-react";

const AssignSubCountyCoordinatorModal = ({
  handleCloseModal,
  onCloseModal,
}) => {
  const accountId = localStorage.getItem("accountId");
  const [subcounties, setSubcounties] = useState([]);
  const [subCountyCoordinators, setSubCountyCoordinators] = useState([]);
  const [selectedSubcounty, setSelectedSubcounty] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchCountiesAndSubcounties();
    fetchSubCountyCoordinators();
  }, [accountId, userId]);

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

  //fetch all subcounties by county coordinator or admin
  const fetchCountiesAndSubcounties = async () => {
    try {
      const hierarchyResponse = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      let counties;
      if (isAdmin) {
        counties = hierarchyResponse.data.message
          .flatMap((region) => region.counties)
          .map((county) => county.countyId);
      } else {
        counties = hierarchyResponse.data.message
          .flatMap((region) => region.counties)
          .filter((county) =>
            county.coordinators.some((coord) => coord.userId === userId)
          )
          .map((county) => county.countyId);
      }
      const subcountiesData = await Promise.all(
        counties.map(async (countyId) => {
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

      const validData = subcountiesData.filter((data) => data !== null);
      const allSubcounties = validData.flatMap((county) => county.subcounties);
      setSubcounties(allSubcounties);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  //assign subcounty coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL +
          `geographic/v1/subcounties/${selectedSubcounty}/coordinators`,
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

  const subCountyOptions = subcounties.map((subcounty) => ({
    value: subcounty.subcountyId,
    label: subcounty.title,
  }));
  const subcountyCoordinatorOptions = subCountyCoordinators.map(
    (coordinator) => ({
      value: coordinator.userId,
      label: `${coordinator.firstName} ${coordinator.lastName}`,
    })
  );
  const handlesubCountyChange = (selectedOption) => {
    setSelectedSubcounty(selectedOption ? selectedOption.value : null);
  };
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-1/3 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Assign SubCounty Coordinators
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Subcounty
            </label>
            <div className="flex gap-2">
              <Select
                name="counties"
                options={subCountyOptions}
                value={subCountyOptions.find(
                  (option) => option.value === selectedSubcounty
                )}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                isClearable
                onChange={handlesubCountyChange}
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
                options={subcountyCoordinatorOptions}
                value={selectedCoordinator}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleCoordinatorChange}
                styles={CustomFiltersStyles}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
              type="button"
               onClick={() => {
              handleCloseModal();
            }}
              className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-saveButton rounded-md bg-cancelButton text-saveButton hover:bg-gray-50 min-w-[100px]"
            >
              <X size={20} />
              Cancel
            </button>

          <button
            onClick={(e) => {
              handleAddCoordinator(e);
            }}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white min-w-[100px] bg-saveButton hover:bg-yellowOrange"
            disabled={isLoading}
          >
             <Check size={20} />
            {isLoading.submitting ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSubCountyCoordinatorModal;
