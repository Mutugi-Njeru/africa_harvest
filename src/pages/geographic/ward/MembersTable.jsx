import {
  ChevronDown,
  ClipboardEditIcon,
  Edit,
  Edit2,
  Ellipsis,
  Lock,
  Search,
  Trash2,
} from "lucide-react";

const MembersTable = ({ members }) => {
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
                  <th className="px-2 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
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
                            {member.subActivities.map((subActivity, idx) => (
                              <span key={subActivity.subActivityId}>
                                {subActivity.subActivity}
                                {idx < member.subActivities.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </span>
                        ) : (
                          "No subActivity assigned"
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                          member.isActive ? "bg-green-500" : "bg-yellowOrange"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            member.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        ></div>
                      </button>
                    </td>
                    <td className="flex items-center px-3 py-3 relative">
                      <a className="font-medium text-green-600 cursor-pointer hover:underline flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </a>
                      <div className="relative">
                        <a className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center ml-3">
                          <ClipboardEditIcon className="h-4 w-4 mr-1" />
                          Assign
                        </a>
                      </div>
                      <div className="relative">
                        <a className="font-medium text-red-600 cursor-pointer hover:underline flex items-center ml-3">
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
        </div>
      </div>
    </div>
  );
};

export default MembersTable;
