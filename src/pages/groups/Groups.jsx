import { Download, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import GroupsTable from "./GroupsTable";
import { hasRolePermission } from "../../utils/Utils";
import CreateGroupByAdmin from "./CreateGroupByAdmin";
import CreateGroupByWardCoordinator from "./CreateGroupByWardCoordinator";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Download CSV function
  const downloadCSV = () => {
    try {
      if (!groups || groups.length === 0) {
        toast.warning("No data available to download");
        return;
      }

      // Define CSV headers
      const headers = [
        "Group Name",
        "Group Manager",
        "Descirption",
        "Ward",
        "Total Members",
        "Created Date",
        "Updated Date"
      ];

      // Map group data to CSV rows
      const csvData = groups.map(group => [
        group.groupName || '',
        group.groupManager || 'N/A',
        group.description || 'N/A',
        group.wardTitle || 'N/A',
        group.totalMembers || 0, //to implement
        group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A',
        group.updatedAt ? new Date(group.updatedAt).toLocaleDateString() : 'N/A'
      ]);

      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => 
          // Handle cells that might contain commas by wrapping in quotes
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `groups_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      {/* Header - Groups title only */}
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Groups</div>
      </div>

      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input - moved up and made rounded */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by group name, manager, ward..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end">
          <button
            onClick={openCreateGroupModal}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Group</span>
          </button>
          <button 
            onClick={downloadCSV}
            className="flex items-center cursor-pointer pl-3 pr-3 p-2 text-black hover:bg-gray-100"
            title="Download CSV"
            disabled={!groups || groups.length === 0}
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* table */}
      <GroupsTable
        groups={groups}
        isLoading={isLoading}
        fetchGroups={fetchGroups}
        searchTerm={searchTerm}
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