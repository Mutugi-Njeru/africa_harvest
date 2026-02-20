import React from 'react'

const TrainingsTable = () => {
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="relative overflow-x-auto min-h-[400px]">
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                <tr>
                  <th className="px-3 py-4">ID</th>
                  <th className="px-2 py-4">Region</th>
                  <th className="px-1 py-4">Description</th>
                  <th className="px-2 py-4">Coordinator</th>
                  <th className="px-6 py-4">Counties</th>
                  <th className="px-6 py-4">Updated At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-3 py-3 font-medium text-green-600 whitespace-nowrap">
                    1
                  </th>
                  <td className="px-1 py-3 truncate max-w-[200px]">Sample Region</td>
                  <td className="px-1 py-3 truncate max-w-[200px]">Sample Description</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                      John Doe, Jane Smith
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                      County 1, County 2, County 3
                    </div>
                  </td>
                  <td className="px-6 py-3">2024-01-15</td>
                  <td className="px-6 py-3">
                    <span className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Assign
                    </span>
                  </td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-3 py-3 font-medium text-green-600 whitespace-nowrap">
                    2
                  </th>
                  <td className="px-1 py-3 truncate max-w-[200px]">Another Region</td>
                  <td className="px-1 py-3 truncate max-w-[200px]">Another Description</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                      No coordinator assigned
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                      No county assigned
                    </div>
                  </td>
                  <td className="px-6 py-3">2024-01-20</td>
                  <td className="px-6 py-3">
                    <span className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Assign
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingsTable