import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import GroupsTable from "./GroupsTable";
import { hasRolePermission } from "../../utils/Utils";
import CreateGroupByAdmin from "./CreateGroupByAdmin";
import CreateGroupByWardCoordinator from "./CreateGroupByWardCoordinator";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";

const Groups = () => {
  const [isAadminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wards, setWards] = useState([]);
  const [groups, setGroups] = useState([]);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const userId = Number(localStorage.getItem("userId"));
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchWards();
    fetchGroups();
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
  //fetch groups by admin or coordinator
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      let url = "";
      if (isAdmin) {
        url = BASE_REST_API_URL + `groups/v1/all/${accountId}`;
      } else {
        const wardIdsQuery = wards.map((ward) => ward.wardId).join(",");
        url =
          BASE_REST_API_URL +
          `groups/v1/all/${accountId}?wardIds=${wardIdsQuery}`;
      }
      const response = await axios.get(url);
      setGroups(response.data.message);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsAdminModalOpen(false);
    setIsCoordinatorModalOpen(false);
  };
  const openCreateGroupModal = () => {
    if (isAdmin) {
      setIsAdminModalOpen(true);
    } else {
      setIsCoordinatorModalOpen(true);
    }
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Groups</div>
        <div className="flex justify-end items-center">
          <button
            onClick={openCreateGroupModal}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Group</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <GroupsTable
        groups={groups}
        isLoading={isLoading}
        fetchGroups={fetchGroups}
      />
      {isAadminModalOpen && (
        <CreateGroupByAdmin
          handleCloseModal={handleCloseModal}
          fetchGroups={fetchGroups}
        />
      )}
      {isCoordinatorModalOpen && (
        <CreateGroupByWardCoordinator
          handleCloseModal={handleCloseModal}
          fetchGroups={fetchGroups}
        />
      )}
    </div>
  );
};

export default Groups;
