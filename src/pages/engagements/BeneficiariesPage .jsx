// BeneficiariesPage.jsx
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_REST_API_URL } from "../../service/AuthService";
import axios from "axios";

const BeneficiariesPage = () => {
  const [beneficiaries, setBeneficiaries] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { engagementId } = useParams();

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get(
          BASE_REST_API_URL + `/engagements/v1/beneficiaries/${engagementId}`
        );
        const beneficiariesData = {
          category: response.data.message.category,
          resource: response.data.message.resource,
          members: response.data.message.beneficiaries.map((beneficiary) => ({
            ...beneficiary.member,
            engagementBeneficiaryId: beneficiary.engagementBeneficiaryId,
            groupName: beneficiary.member.groupName,
            subActivities: beneficiary.member.subActivities,
            isPwd: beneficiary.member.isPwd,
            dateOfBirth: beneficiary.member.dob,
            idNumber: beneficiary.member.idNumber,
            firstName: beneficiary.member.firstName,
            lastName: beneficiary.member.lastName,
            gender: beneficiary.member.gender,
          })),
        };
        setBeneficiaries(beneficiariesData);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        toast.error("Failed to fetch beneficiaries");
        navigate(-1); // Go back if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeneficiaries();
  }, [engagementId, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-xl p-4 m-4">
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold">
          Beneficiaries for {beneficiaries.category} - {beneficiaries.resource}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <X className="h-6 w-6 text-green-700" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-2 py-3">ID</th>
              <th className="px-2 py-3">Fullname</th>
              <th className="px-2 py-3">Gender</th>
              <th className="px-2 py-3">ID Number</th>
              <th className="px-2 py-3">DOB</th>
              <th className="px-2 py-3">Group Name</th>
              <th className="px-2 py-3">Subactivities</th>
              <th className="px-2 py-3">Disabled?</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.members && beneficiaries.members.length > 0 ? (
              beneficiaries.members.map((beneficiary, index) => (
                <tr
                  key={beneficiary.engagementBeneficiaryId || index}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-2 py-4 font-medium text-green-600">
                    {index + 1}
                  </td>
                  <td className="px-2 py-4 max-w-[150px]">
                    <div
                      className="truncate"
                      title={`${beneficiary.firstName} ${beneficiary.lastName}`}
                    >
                      {beneficiary.firstName} {beneficiary.lastName}
                    </div>
                  </td>
                  <td className="px-2 py-4 capitalize">
                    {beneficiary.gender || "N/A"}
                  </td>
                  <td className="px-2 py-4">{beneficiary.idNumber || "N/A"}</td>
                  <td className="px-2 py-4">
                    {beneficiary.dateOfBirth
                      ? new Date(beneficiary.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-2 py-4 max-w-[120px]">
                    <div
                      className="truncate"
                      title={beneficiary.groupName || "N/A"}
                    >
                      {beneficiary.groupName || "N/A"}
                    </div>
                  </td>
                  <td className="px-2 py-4 max-w-[190px]">
                    {beneficiary.subActivities &&
                    beneficiary.subActivities.length > 0 ? (
                      <div
                        className="truncate"
                        title={beneficiary.subActivities
                          .map((sa) => sa.subActivity)
                          .join(", ")}
                      >
                        {beneficiary.subActivities.map((subActivity, i) => (
                          <span key={i}>
                            {subActivity.subActivity}
                            {i !== beneficiary.subActivities.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-2 py-4">
                    {beneficiary.isPwd ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  No beneficiaries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeneficiariesPage;
