import React, { useState, useEffect } from "react";
import Select from "react-select";
import CustomFiltersStyles from "../../../styles/CustomFiltersStyles";
import axios from "axios";
import { BASE_REST_API_URL } from "../../../service/AuthService";
import { toast } from "react-toastify";

const UpdateMember = ({ isOpen, onClose, memberData, onMemberUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPwdOptions = [
    { value: false, label: "NO" },
    { value: true, label: "YES" },
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    msisdn: "",
    email: "",
    idNumber: "",
    dob: "",
    gender: "",
    isPwd: false,
    pwdDescription: "",
  });
  useEffect(() => {
    if (memberData) {
      setFormData({
        firstName: memberData.firstName || "",
        lastName: memberData.lastName || "",
        msisdn: memberData.msisdn || "",
        email: memberData.email || "",
        idNumber: memberData.idNumber || "",
        dob: memberData.dob ? memberData.dob.split("T")[0] : "",
        gender: memberData.gender || "",
        isPwd: memberData.isPwd || false,
        pwdDescription: memberData.pwdDescription || "",
      });
    }
  }, [memberData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        msisdn: formData.msisdn,
        email: formData.email,
        idNumber: formData.idNumber,
        dob: formData.dob,
        gender: formData.gender,
        isPwd: formData.isPwd,
        pwdDescription: formData.isPwd ? formData.pwdDescription : null,
      };
      const response = axios.put(
        BASE_REST_API_URL + `members/v1/update/${memberData.memberId}`,
        payload
      );
      toast.success("Member Details Updated Successfully");
      onMemberUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("cannot update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Update Member Details</h2>
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <Select
                name="gender"
                value={{
                  value: formData.gender,
                  label: formData.gender
                    ? formData.gender.toUpperCase()
                    : "Select Gender",
                }}
                onChange={(option) => handleSelectChange("gender", option)}
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "MALE" },
                  { value: "female", label: "FEMALE" },
                  { value: "other", label: "OTHER" },
                ]}
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
                value={isPwdOptions.find(
                  (option) => option.value === formData.isPwd
                )}
                onChange={(option) => handleSelectChange("isPwd", option)}
                options={isPwdOptions}
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>

          {formData.isPwd && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Person With Disability Description
              </label>
              <textarea
                name="pwdDescription"
                value={formData.pwdDescription}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                rows="3"
                required={formData.isPwd}
              />
            </div>
          )}

          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMember;
