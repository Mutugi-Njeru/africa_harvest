import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";
import { Minus, Plus, X } from "lucide-react";

const WardCoordinatorsModal = ({ handleCloseModal, onCloseModal, ward }) => {
  const accountId = localStorage.getItem("accountId");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemovingCoordinator, setIsRemovingCoordinator] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const [wardCoordinators, setWardCoordinators] = useState([]);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const superAdmin = hasRolePermission(userRoles, "SUPER_ADMIN");
  const [selectedRemoveCoordinators, setSelectedRemoveCoordinators] = useState(
    []
  );

  useEffect(() => {
    fetchWardCoordinators();
  }, [accountId]);

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

  // //assign ward coordinator
  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const userIds = selectedCoordinator.map((user) => user.value);
      const response = await axios.post(
        BASE_REST_API_URL + `geographic/v1/wards/${ward.wardId}/coordinators`,
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
  //remove ward coordinator
  const handleRemoveCoordinator = async (e) => {
    e.preventDefault();
    setIsRemovingCoordinator(true);
    try {
      const userIds = selectedRemoveCoordinators.map((user) => user.value);
      const response = await axios.delete(
        BASE_REST_API_URL + `/geographic/v1/wards/${ward.wardId}/coordinators`,
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

  const wardCoordinatorOptions = wardCoordinators.map((coordinator) => ({
    value: coordinator.userId,
    label: `${coordinator.firstName} ${coordinator.lastName}`,
  }));
  const handleCoordinatorChange = (selectedOption) => {
    setSelectedCoordinator(selectedOption);
  };

  const assignedCoordinatorsOptions =
    ward.coordinators?.length > 0
      ? ward.coordinators.map((coordinator) => ({
          value: coordinator.userId,
          label: `${coordinator.firstName} ${coordinator.lastName}`,
        }))
      : [];
  const handleRemovingCoordinatorsChange = (selectedOptions) => {
    setSelectedRemoveCoordinators(selectedOptions);
  };

  return (
    // done by subCounty coordinator
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-[600px] max-h-[90vh] rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Manage TOT/VBS for {ward.title}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add TOT/VBS(s)
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
              <button
                onClick={handleAddCoordinator}
                className="flex bg-saveButton hover:bg-yellowOrange text-white items-center justify-center gap-2 border rounded-md px-6 py-2 min-w-[120px]"
                disabled={isAdding}
              >
                <Plus size={20} />
                {isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove TOT/VBS(s)
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
                className="flex bg-red-50 text-red-600 font-bold items-center justify-center gap-2 border border-red-300 rounded-md px-6 py-2 min-w-[120px] transition-all duration-200 hover:bg-red-100 hover:border-red-400 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                disabled={isRemovingCoordinator}
              >
                <Minus className="w-5 h-5" />
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
            className="flex items-center justify-center gap-2 border-2 border-saveButton rounded-md px-6 py-2 min-w-[120px] bg-cancelButton text-saveButton hover:bg-gray-50"
          >
            <X size={20} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardCoordinatorsModal;
