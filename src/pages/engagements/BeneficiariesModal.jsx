import { Eye, Trash2, X, Clipboard } from "lucide-react";
import { useEffect } from "react";

const BeneficiariesModal = ({ isOpen, onClose, beneficiaries = {} }) => {
  if (!isOpen) return null;

  useEffect(() => {
    console.log(beneficiaries);
  }, [beneficiaries]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            Beneficiaries for {beneficiaries.category} -{" "}
            {beneficiaries.resource}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fullname</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">ID Number</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Group Name</th>
                <th className="px-4 py-3">Subactivities</th>
                <th className="px-4 py-3">Disabled?</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.members && beneficiaries.members.length > 0 ? (
                beneficiaries.members.map((beneficiary, index) => (
                  <tr
                    key={beneficiary.engagementBeneficiaryId || index}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium text-green-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 max-w-[150px]">
                      <div
                        className="truncate"
                        title={`${beneficiary.firstName} ${beneficiary.lastName}`}
                      >
                        {beneficiary.firstName} {beneficiary.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize">
                      {beneficiary.gender || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      {beneficiary.idNumber || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      {beneficiary.dateOfBirth
                        ? new Date(beneficiary.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 max-w-[120px]">
                      <div
                        className="truncate"
                        title={beneficiary.groupName || "N/A"}
                      >
                        {beneficiary.groupName || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-[150px]">
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
                    <td className="px-4 py-4">
                      {beneficiary.isPwd ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No beneficiaries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BeneficiariesModal;
