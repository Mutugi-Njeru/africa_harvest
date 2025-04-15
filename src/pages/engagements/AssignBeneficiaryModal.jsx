import React, { useEffect, useState } from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";
import Select from "react-select";
import { hasRolePermission } from "../../utils/Utils";
import axios from "axios";
import { BASE_REST_API_URL } from "../../service/AuthService";
import { toast } from "react-toastify";

const AssignBeneficiaryModal = ({ handleCloseModal, engagement }) => {
  const [members, setMembers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const accountId = localStorage.getItem("accountId");
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isAdmin = hasRolePermission(userRoles, "ADMIN");

  useEffect(() => {
    fetchMembers();
    getEngagementBeneficiaries();
  }, [accountId, engagement.engagementId]);

  const fetchMembers = async () => {
    try {
      if (isAdmin) {
        const membersResponse = await axios.get(
          `${BASE_REST_API_URL}/members/v1/all`
        );
        setMembers(membersResponse.data.message);
      } else {
        const response = await axios.get(
          `${BASE_REST_API_URL}/coordinatorsx/v1/hierarchy/${accountId}`
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
        if (wards.length === 0) {
          setMembers([]);
          return;
        }
        const wardIdsString = wards.map((ward) => ward.wardId).join(",");
        const url = `${BASE_REST_API_URL}/members/v1/all?wardIds=${wardIdsString}`;
        const membersResponse = await axios.get(url);
        setMembers(membersResponse.data.message);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const getEngagementBeneficiaries = async () => {
    try {
      const response = await axios.get(
        `${BASE_REST_API_URL}/engagements/v1/beneficiaries/${engagement.engagementId}`
      );

      setBeneficiaries(response.data.message.beneficiaries);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  //assign engagement beneficiaries/members
  const handleAddBeneficiaries = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const memberIds = selectedMember.map((member) => member.value);
      const payload = {
        engagementId: engagement.engagementId,
        memberIds: memberIds,
      };

      const response = await axios.post(
        `${BASE_REST_API_URL}/engagements/v1/assign-batch-beneficiaries`,
        payload
      );
      getEngagementBeneficiaries();
      setSelectedMember([]);
      if (response.data?.message?.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      } else if (response.data?.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message?.details) {
        error.response.data.message.details.forEach((detail) => {
          toast.error(detail);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Adding beneficiary failed. Please try again.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  //remove engagement beneficiaries/members
  const removeBeneficiary = async (e) => {
    e.preventDefault();
    setIsRemoving(true);
    try {
      const response = await axios.delete(
        `${BASE_REST_API_URL}/engagements/v1/beneficiary/${selectedBeneficiary.value}`
      );
      getEngagementBeneficiaries();
      setSelectedBeneficiary([]);
      if (response.data?.message?.details) {
        response.data.message.details.forEach((detail) => {
          toast.success(detail);
        });
      } else if (response.data?.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message?.details) {
        error.response.data.message.details.forEach((detail) => {
          toast.error(detail);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Removing beneficiary failed. Please try again.");
      }
    } finally {
      setIsRemoving(false);
    }
  };
  const membersOptions = members.map((member) => ({
    value: member.memberId,
    label: `${member.firstName} ${member.lastName}`,
  }));
  const beneficiariesOptions = beneficiaries.map((beneficiary) => ({
    value: beneficiary.engagementBeneficiaryId,
    label: `${beneficiary.member.firstName} ${beneficiary.member.lastName}`,
  }));
  const handleMemberChange = (selectedOption) => {
    setSelectedMember(selectedOption);
  };
  const handleBeneficiaryChange = (selectedOption) => {
    setSelectedBeneficiary(selectedOption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 w-[800px] ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Assign Engagement Beneficiaries
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Beneficiary (s)
            </label>
            <div className="flex gap-2">
              <Select
                isMulti
                name="coordinators"
                options={membersOptions}
                value={selectedMember}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleMemberChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={handleAddBeneficiaries}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={isAdding}
              >
                {isAdding ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remove Beneficiary (s)
            </label>
            <div className="flex gap-2">
              <Select
                name="coordinators"
                options={beneficiariesOptions}
                value={selectedBeneficiary}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                onChange={handleBeneficiaryChange}
                styles={CustomFiltersStyles}
              />
              <button
                onClick={removeBeneficiary}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              handleCloseModal();
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

export default AssignBeneficiaryModal;
