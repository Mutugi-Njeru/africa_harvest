import axios from "axios";
import { ClipboardEditIcon, Edit, Eye, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { useState } from "react";
import UpdateMember from "./UpdateMember";
import AssignMemberSubActivity from "./AssignMemberSubActivity";
import EngagementsModal from "./EngagementsModal";

const MembersTable = ({ members, isLoading, fetchMembers }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEngagementsModalOpen, setIsEngagementsModalOpen] = useState(false);
  const [engagements, setEngagements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMemberStatus = async (memberId, currentStatus) => {
    try {
      const endpoint = currentStatus ? "deactivate" : "activate";
      const response = await axios.put(
        BASE_REST_API_URL + `/members/v1/${memberId}/${endpoint}`
      );
      toast.success(response.data.message);
      fetchMembers();
    } catch (error) {
      console.error("Error toggling member status:", error);
      toast.error(`Cannot ${currentStatus ? "deactivate" : "activate"} member`);
    }
  };

  const deleteUser = async (memberId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/members/v1/${memberId}`
      );
      toast.success(response.data.message);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Cannot delete member");
    }
  };

  const handleViewEngagements = async (memberId) => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/engagements/v1/member/${memberId}`
      );
      const engagements = response.data.message.engagements.map(
        (engagement) => ({
          ...engagement,
          firstName: response.data.message.firstName,
          lastName: response.data.message.lastName,
        })
      );

      setEngagements(engagements);
      setIsEngagementsModalOpen(true);
    } catch (error) {
      console.error("Error fetching engagements:", error);
      toast.error("Failed to fetch engagements");
    }
  };

  const handleConfirmDeletion = () => {
    if (selectedMember) {
      deleteUser(selectedMember.memberId);
      setShowDeleteModal(false);
      setSelectedMember(null);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedMember(null);
  };

  const handleAssignCloseModal = () => {
    setIsAssignModalOpen(false);
    setSelectedMember(null);
  };

  const filterMembers = () => {
    if (!searchTerm) return members;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return members.filter((member) => {
      // Check name
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      if (fullName.includes(lowerCaseSearchTerm)) {
        return true;
      }

      // Check ID number
      if (
        member.idNumber &&
        member.idNumber.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }

      // Check phone number
      if (
        member.msisdn &&
        member.msisdn.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }

      // Check group name
      if (
        member.groupName &&
        member.groupName.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }

      // Check ward title
      if (
        member.wardTitle &&
        member.wardTitle.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }

      return false;
    });
  };

  const filteredMembers = filterMembers();

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, id Number or phone"
              className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto min-h-[400px]">
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                  <tr>
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">IdNumber</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-2 py-3">Gender</th>
                    <th className="px-3 py-4">Group</th>
                    <th className="px-3 py-3">Ward</th>
                    <th className="px-3 py-3">Sub Activity</th>
                    <th className="px-3 py-3">Engagements</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, index) => (
                      <tr
                        key={member.memberId}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-green-600 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-3 py-3 truncate max-w-[200px]">
                          {member.firstName} {member.lastName}
                        </td>
                        <td className="px-3 py-3">{member.idNumber}</td>
                        <td className="px-3 py-3">{member.msisdn}</td>
                        <td className="px-2 py-3">{member.gender}</td>
                        <td className="px-3 py-3">{member.groupName}</td>
                        <td className="px-3 py-3">{member.wardTitle}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center max-w-[400px] overflow-hidden">
                            {member.subActivities &&
                            member.subActivities.length > 0 ? (
                              <span
                                className="truncate"
                                title={member.subActivities
                                  .map((sa) => sa.subActivity)
                                  .join(", ")}
                              >
                                {member.subActivities.map(
                                  (subActivity, idx) => (
                                    <span key={subActivity.subActivityId}>
                                      {subActivity.subActivity}
                                      {idx < member.subActivities.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  )
                                )}
                              </span>
                            ) : (
                              "No subActivity assigned"
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 ">
                          <a
                            onClick={() =>
                              handleViewEngagements(member.memberId)
                            }
                            className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() =>
                              toggleMemberStatus(
                                member.memberId,
                                member.isActive
                              )
                            }
                            className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                              member.isActive
                                ? "bg-green-500"
                                : "bg-yellowOrange"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                member.isActive
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </button>
                        </td>
                        <td className="flex items-center px-3 py-3 relative">
                          <a
                            onClick={() => handleEditClick(member)}
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </a>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedMember(member);
                                setIsAssignModalOpen(true);
                              }}
                              className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <ClipboardEditIcon className="h-4 w-4 mr-1" />
                              Assign
                            </a>
                          </div>
                          <div className="relative">
                            <a
                              onClick={() => {
                                setSelectedMember(member);
                                setShowDeleteModal(true);
                              }}
                              className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td colSpan="11" className="px-6 py-4 text-center">
                        No members found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this member?</p>
            <div className="mt-6 flex">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 px-4 py-2 bg-red-400 hover:bg-red-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletion}
                className="w-1/2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <UpdateMember
          isOpen={isUpdateModalOpen}
          onClose={handleCloseModal}
          memberData={selectedMember}
          onMemberUpdated={fetchMembers}
        />
      )}
      {isAssignModalOpen && (
        <AssignMemberSubActivity
          handleCloseModal={handleAssignCloseModal}
          member={selectedMember}
          onCloseModal={fetchMembers}
        />
      )}
      {isEngagementsModalOpen && (
        <EngagementsModal
          isOpen={isEngagementsModalOpen}
          onClose={() => setIsEngagementsModalOpen(false)}
          engagements={engagements}
        />
      )}
    </div>
  );
};

export default MembersTable;
