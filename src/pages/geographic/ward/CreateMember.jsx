import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { hasRolePermission } from "../../../utils/Utils";

const CreateMember = ({ handleCloseModal, refreshMembers }) => {
  const [wards, setWards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isPwd, setIsPwd] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pwdDescription, setPwdDescription] = useState(null);
  const userRoles = JSON.parse(localStorage.getItem("roles")) || [];
  const isAdmin = hasRolePermission(userRoles, "ADMIN");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    msisdn: "",
    email: "",
    gender: "",
    dob: "",
    idNumber: "",
  });
  const userId = Number(localStorage.getItem("userId"));
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    fetchWards();
    fetchGroups();
  }, [accountId]);

  //get all wards for ward coordinator or admin
  const fetchWards = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `/coordinatorsx/v1/hierarchy/${accountId}`
      );
      const wards = response.data.message.flatMap((region) =>
        region.counties.flatMap((county) =>
          county.subCounties.flatMap((subCounty) =>
            isAdmin
              ? subCounty.wards // Return all wards if admin
              : subCounty.wards.filter((ward) =>
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
      throw error;
    }
  };

  //fetch groups
  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        BASE_REST_API_URL + `groups/v1/all/${accountId}`
      );
      const groups = response.data.message;
      setGroups(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  };

  const wardOptions = wards.map((ward) => ({
    value: ward.wardId,
    label: ward.title,
  }));

  const groupOptions = groups.map((group) => ({
    value: group.groupId,
    label: group.groupName,
  }));

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
  };

  const handleGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption);
  };

  const handleGenderChange = (selectedOption) => {
    setFormData({ ...formData, gender: selectedOption.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    if (!selectedWard || !selectedGroup) {
      toast.error("Please select both ward and group");
      return;
    }
    try {
      const payload = {
        ...formData,
        groupId: selectedGroup.value,
        wardId: selectedWard.value,
        isPwd: isPwd,
        pwdDescription: isPwd ? pwdDescription : null,
      };
      const response = await axios.post(
        BASE_REST_API_URL + "members/v1/create",
        payload
      );

      toast.success("Member created successfully!");
      refreshMembers();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating member:", error);
      toast.error(error.response?.data?.message || "Failed to create member");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="msisdn"
                value={formData.msisdn}
                onChange={handleInputChange}
                placeholder="254712345678"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="ID Number"
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Group
              </label>
              <Select
                name="groupId"
                options={groupOptions}
                onChange={handleGroupChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Ward
              </label>
              <Select
                name="wardId"
                options={wardOptions}
                onChange={handleWardChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <Select
                name="gender"
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "MALE" },
                  { value: "female", label: "FEMALE" },
                  { value: "other", label: "OTHER" },
                ]}
                onChange={handleGenderChange}
                styles={CustomFiltersStyles}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Disabled?
              </label>
              <Select
                name="isPwd"
                options={[
                  { value: false, label: "NO" },
                  { value: true, label: "YES" },
                ]}
                onChange={(selectedOption) => setIsPwd(selectedOption.value)}
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>

          {isPwd && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Person With Disability Description
              </label>
              <textarea
                name="pwdDescription"
                value={pwdDescription || ""}
                onChange={(e) => setPwdDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                rows="3"
                required={isPwd}
              />
            </div>
          )}

          <div className="flex">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isCreating}
            >
              {isCreating ? "Creating" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMember;
