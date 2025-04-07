import { Download, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import MembersTable from "./MembersTable";
import CreateMember from "./CreateMember";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import axios from "axios";

const Ward = () => {
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchWardsMembers();
  }, [accountId]); //add userId

  const fetchWardsMembers = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      const wards = response.data.message.flatMap((region) =>
        region.counties.flatMap((county) =>
          county.subCounties.flatMap((subCounty) =>
            subCounty.wards.filter((ward) =>
              ward.coordinators.some(
                (coordinator) => coordinator.userId === 8 //change to userId
              )
            )
          )
        )
      );
      const wardIdsString = wards.map((ward) => ward.wardId).join(",");
      let url = BASE_REST_API_URL + `/members/v1/all?wardIds=${wardIdsString}`;
      const membersResponse = await axios.get(url);
      console.log(membersResponse.data.message);
      setMembers(membersResponse.data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateMemberModalOpen(false);
  };

  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Members</div>
        <div className="flex justify-end items-center">
          <button
            onClick={() => {
              setIsCreateMemberModalOpen(true);
            }}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Member</span>
          </button>
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <MembersTable members={members} />
      {isCreateMemberModalOpen && (
        <CreateMember
          handleCloseModal={handleCloseModal}
          // onCloseModal={fetchWards}
        />
      )}
    </div>
  );
};

export default Ward;
