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
  const [regionCoordinators, setRegionCoordinators] = useState([]);
  const [isAddingCounties, setIsAddingCounties] = useState(false);
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
  //   //add roles to user
  //   const handleAddRoles = async (e) => {
  //     e.preventDefault();
  //     setIsAddingRole(true);
  //     try {
  //       const roleIds = selectedRoles.map((role) => role.value);
  //       const response = await axios.post(
  //         BASE_REST_API_URL + `security/v1/users/${user.userId}/roles`,
  //         { roleIds }
  //       );
  //       setSelectedRoles([]);
  //       fetchUserRoles();
  //       if (response.data.message && response.data.message.details) {
  //         response.data.message.details.forEach((detail) => {
  //           toast.success(detail);
  //         });
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         if (
  //           error.response.data.message &&
  //           Array.isArray(error.response.data.message.details)
  //         ) {
  //           error.response.data.message.details.forEach((detail) => {
  //             toast.error(detail);
  //           });
  //         } else if (error.response.data.message) {
  //           toast.error(error.response.data.message);
  //         } else {
  //           toast.error("Adding role failed");
  //         }
  //       } else {
  //         toast.error("Network error or server unavailable");
  //       }
  //     } finally {
  //       setIsAddingRole(false);
  //     }
  //   };

  //   //remove permissions from user
  //   const handleRemovePermissions = async (e) => {
  //     e.preventDefault();
  //     setIsRemovingPermission(true);
  //     try {
  //       const permissionIds = selectedUserPermissions.map((perm) => perm.value);
  //       console.log(
  //         BASE_REST_API_URL +
  //           `/security/v1/users/${user.userId}/permissions/deactivate`,
  //         { permissionIds }
  //       );
  //       const response = await axios.put(
  //         BASE_REST_API_URL +
  //           `/security/v1/users/${user.userId}/permissions/deactivate`,
  //         { permissionIds }
  //       );
  //       setSelectedUserPermissions([]);
  //       fetchUserPermissions();
  //       if (response.data.message && response.data.message.details) {
  //         response.data.message.details.forEach((detail) => {
  //           toast.success(detail);
  //         });
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         if (
  //           error.response.data.message &&
  //           Array.isArray(error.response.data.message.details)
  //         ) {
  //           error.response.data.message.details.forEach((detail) => {
  //             toast.error(detail);
  //           });
  //         } else if (error.response.data.message) {
  //           toast.error(error.response.data.message);
  //         } else {
  //           toast.error("Removing permissions failed");
  //         }
  //       } else {
  //         toast.error("Network error or server unavailable");
  //       }
  //     } finally {
  //       setIsRemovingPermission(false);
  //     }
  //   };

  //remove roles from user
  //   const handleRemoveRole = async (e) => {
  //     e.preventDefault();
  //     setIsRemovingRole(true);
  //     try {
  //       const roleIds = selectedUserRoles.map((perm) => perm.value);
  //       const response = await axios.delete(
  //         BASE_REST_API_URL + `security/v1/users/${user.userId}/roles`,
  //         { data: { roleIds } }
  //       );
  //       toast.success(response.data.message.details[0]);
  //       setSelectedUserRoles([]);
  //       fetchUserRoles();
  //       if (response.data.message && response.data.message.details) {
  //         response.data.message.details.forEach((detail) => {
  //           toast.success(detail);
  //         });
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         if (
  //           error.response.data.message &&
  //           Array.isArray(error.response.data.message.details)
  //         ) {
  //           error.response.data.message.details.forEach((detail) => {
  //             toast.error(detail);
  //           });
  //         } else if (error.response.data.message) {
  //           toast.error(error.response.data.message);
  //         } else {
  //           toast.error("Removing role failed");
  //         }
  //       } else {
  //         toast.error("Network error or server unavailable");
  //       }
  //     } finally {
  //       setIsRemovingRole(false);
  //     }
  //   };

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
          value: county.titleId,
          label: county.title,
        }))
      : [];

  const handleCountiesChange = (selectedOptions) => {
    setSelectedCounties(selectedOptions);
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
                className="bg-green-600 text-white px-3 py-1 rounded-md"
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
                // value={selectedRoles}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                // onChange={handleRolesChange}
                styles={CustomFiltersStyles}
              />
              <button
                // onClick={handleAddRoles}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                // disabled={isAddingRole}
              >
                Add {/* {isAddingRole ? "Adding..." : "Add"} */}
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
                Remove{" "}
                {/* {isRemovingPermission ? "Removing..." : "Remove"}{" "} */}
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
                // value={selectedUserRoles}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                // onChange={handleUserRolesChange}
                // styles={CustomFiltersStyles}
              />
              <button
                // onClick={handleRemoveRole}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                // disabled={isRemovingRole}
              >
                Remove {/* {isRemovingRole ? "Removing..." : "Remove"}{" "} */}
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
