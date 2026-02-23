import { ClipboardEditIcon, Eye } from 'lucide-react'
import React from 'react'

const TrainingsTable = ({ trainings = [] }) => {
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md mt-3">
        <div className="relative overflow-x-auto min-h-[400px]">
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-white border-b">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Code</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Start Time</th>
                  <th className="px-4 py-4">End Time</th>
                  <th className="px-4 py-4">Trainer</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainings.length > 0 ? (
                  trainings.map((training, index) => (
                    <tr key={training.trainingId || index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-green-600 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.title || '-'}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.trainingCode || '-'}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.location || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {training.startTime ? 
                          new Date(`2000-01-01T${training.startTime}`).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) 
                          : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {training.endTime ? 
                          new Date(`2000-01-01T${training.endTime}`).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) 
                          : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 truncate max-w-[200px]">
                          {training.trainer?.name || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[200px]">
                        {training.description || '-'}
                      </td>
                      <td className="px-4 py-3 flex">
                        <a
                           
                            className="font-medium text-green-600 cursor-pointer hover:underline flex items-center mr-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Resources
                          </a>
                        <a
                           
                            className="font-medium text-yellowOrange cursor-pointer hover:underline flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Attendance
                          </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No trainings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingsTable