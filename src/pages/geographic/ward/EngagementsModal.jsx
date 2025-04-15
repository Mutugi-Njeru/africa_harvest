import { X } from "lucide-react";
import { useEffect } from "react";

const EngagementsModal = ({ isOpen, onClose, engagements }) => {
  useEffect(() => {
    console.log(engagements);
  }, [engagements]);
  if (!isOpen) return null;
  const firstName = engagements?.[0]?.firstName || "this member";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Engagements for {firstName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">assigned At</th>
              </tr>
            </thead>
            <tbody>
              {engagements && engagements.length > 0 ? (
                engagements.map((engagement, index) => (
                  <tr
                    key={engagement.engagementId}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{engagement.category}</td>
                    <td className="px-4 py-3">{engagement.description}</td>
                    <td className="px-4 py-3">{engagement.resource}</td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {engagement.assignedAt}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No engagements found for this member
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

export default EngagementsModal;
