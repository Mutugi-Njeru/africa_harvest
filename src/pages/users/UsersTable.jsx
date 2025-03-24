import axios from "axios";
import { Edit, Trash2 } from "lucide-react";

const UsersTable = ({ users }) => {
  return (
    <div className="relative overflow-x-auto shadow-md mt-3">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Full Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Roles</th>
            <th className="px-6 py-4">Permissions</th>
            <th className="px-6 py-4">Regional</th>
            <th className="px-6 py-4">County</th>
            <th className="px-6 py-4">Subcounty</th>
            <th className="px-6 py-4">Ward</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.userId}
              className="bg-white border-b  hover:bg-gray-50 "
            >
              <th
                scope="row"
                className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
              >
                {index + 1}
              </th>
              <td className="px-6 py-3 truncate max-w-[200px]">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-3">{user.email}</td>
              <td className="px-6 py-3">{user.msisdn}</td>

              <td className="px-6 py-3 truncate max-w-[150px]">
                {user.roles.join(", ")}
              </td>
              <td
                className="px-6 py-3 truncate max-w-[200px]"
                title={user.permissions.join(", ")}
              >
                {user.permissions.join(", ")}
              </td>
              <td className="px-6 py-3">
                {user.isRegionalCoordinator ? "Yes" : "No"}
              </td>
              <td className="px-6 py-3">
                {user.isCountyCoordinator ? "Yes" : "No"}
              </td>
              <td className="px-6 py-3">
                {user.isSubcountyCoordinator ? "Yes" : "No"}
              </td>
              <td className="px-6 py-3">
                {user.isWardCoordinator ? "Yes" : "No"}
              </td>
              <td className="px-6 py-3">
                <button
                  className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${
                    user.isActive ? "bg-green-500" : "bg-yellowOrange"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      user.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </td>
              <td className="flex items-center px-6 py-3">
                <a
                  href="#"
                  className="font-medium text-green-600  hover:underline flex items-center"
                >
                  <Edit className="h-5 w-5 mr-1" />
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600  hover:underline flex items-center ms-3"
                >
                  <Trash2 className="h-5 w-5 mr-1" />
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
