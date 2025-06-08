import { Clipboard, Edit, Eye, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AssignBeneficiaryModal from "./AssignBeneficiaryModal";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EngagementsTable = ({ engagements, isLoading, fetchEngagements }) => {
  const [isBeneficiariesModalOpen, setIsBeneficiariesModalOpen] =
    useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsBeneficiariesModalOpen(false);
    setSelectedEngagement(null);
  };
  const deleteEngagement = async (engagementId) => {
    try {
      const response = await axios.delete(
        BASE_REST_API_URL + `/engagements/v1/${engagementId}`
      );
      toast.success(response.data.message);
      fetchEngagements();
    } catch (error) {
      console.error("Error deleting engagement:", error);
      toast.error(error.response?.data?.message || "Cannot delete engagement");
    }
  };

  const handleShowBeneficiaries = async (engagementId) => {
    try {
      navigate(`/engagements/${engagementId}/beneficiaries`);
    } catch (error) {
      console.error("Error navigating to beneficiaries:", error);
      toast.error("Failed to view beneficiaries");
    }
  };

  const handleConfirmDeletion = () => {
    if (selectedEngagement) {
      deleteEngagement(selectedEngagement.engagementId);
      setShowDeleteModal(false);
      setSelectedEngagement(null);
    }
  };
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
              placeholder="Search by name, phone, email or roles"
              className="w-96 px-4 py-2 pl-10 focus:outline-none border-0 border-b-2 border-gray-300 focus:border-green-500 bg-transparent"
            />
          </div>
        </div>

        <div className="relative overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
            </div>
          ) : (
            <div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Manager</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {engagements.map((engagement, index) => (
                    <tr
                      key={engagement.engagementId}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-6 py-3 font-medium text-green-600 whitespace-nowrap"
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-3 truncate max-w-[200px]">
                        {engagement.category}
                      </td>
                      <td className="px-6 py-3">{engagement.resource}</td>
                      <td className="px-6 py-3">{engagement.quantity}</td>
                      <td className="px-6 py-3">{engagement.description}</td>
                      <td className="px-6 py-3 truncate max-w-[150px]">
                        {engagement.user.firstName} {engagement.user.lastName}
                      </td>
                      <td className="flex items-center px-6 py-3 relative">
                        <a
                          onClick={() =>
                            handleShowBeneficiaries(engagement.engagementId)
                          }
                          className="font-medium text-green-600 cursor-pointer hover:underline flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Beneficiaries
                        </a>
                        <a
                          onClick={() => {
                            setIsBeneficiariesModalOpen(true);
                            setSelectedEngagement(engagement);
                          }}
                          className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                        >
                          <Clipboard className="h-4 w-4 mr-1" />
                          Assign Beneficiaries
                        </a>
                        <div className="relative">
                          <a
                            onClick={() => {
                              setSelectedEngagement(engagement);
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this Engagement?</p>
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
      {isBeneficiariesModalOpen && (
        <AssignBeneficiaryModal
          handleCloseModal={handleCloseModal}
          engagement={selectedEngagement}
        />
      )}
    </div>
  );
};

export default EngagementsTable;
