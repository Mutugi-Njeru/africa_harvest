import { ClipboardEditIcon, Search } from "lucide-react";
import React from "react";

const ActivitiesTable = () => {
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
        {/* {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellowOrange"></div>
          </div>
        ) : ( */}
        <div className="relative overflow-x-auto min-h-[400px]">
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-white border-b  ">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Ward</th>
                  <th className="px-6 py-4">Ward Coordinator</th>
                  <th className="px-6 py-4">Sub County</th>
                  <th className="px-6 py-4">County</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {wards.map((ward, index) => ( */}
                <tr
                  //   key={ward.wardId}
                  className="bg-white border-b  hover:bg-gray-50 "
                >
                  <th
                    scope="row"
                    className="px-6 py-3 font-medium text-green-600 whitespace-nowrap "
                  >
                    1
                  </th>
                  <td className="px-6 py-3 truncate max-w-[200px]">Title</td>
                  <td className="px-6 py-3">Hello</td>
                  <td className="px-6 py-3">2j4j4n4</td>

                  <td className="px-6 py-3 truncate max-w-[150px]">Hello</td>
                  <td className="flex items-center px-6 py-3 relative">
                    <div className="relative">
                      <a
                        // onClick={() => {
                        //   setSelectedWard(ward);
                        //   setIsCoordinatorsModalOpen(true);
                        // }}
                        className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center ml-3"
                      >
                        <ClipboardEditIcon className="h-4 w-4 mr-1" />
                        Assign
                      </a>
                    </div>
                  </td>
                </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default ActivitiesTable;
