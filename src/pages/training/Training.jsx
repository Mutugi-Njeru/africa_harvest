import { Download, Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import CreateTrainerModal from './CreateTrainerModal';
import CreateTrainingModal from './CreateTrainingModal';
import TrainingsTable from './TrainingsTable';


const Training = () => {
  const [showCreateTrainerModal, setShowCreateTrainerModal] = useState(false);
  const [showCreateTrainingModal, setShowCreateTrainingModal] = useState(false);
  
  return (
    <div className="pr-4 pl-3 relative">
      <div className="mt-3 mb-4">
        <div className="text-xl font-bold text-gray-600">Trainings</div>
      </div>
      <div className="flex justify-between items-center gap-3 mb-3">
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by region name, coordinator..."
            className="w-96 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent"
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-end">
          <button
             onClick={() => setShowCreateTrainerModal(true)}
            className="flex items-center border pl-3 pr-3 p-2 bg-green-700 hover:bg-yellowOrange cursor-pointer text-white rounded-md"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2 mr-2">Create Trainer</span>
          </button>
          <button
            onClick={() => setShowCreateTrainingModal(true)}
            className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black hover:bg-gray-100 rounded-md"
          >
            <Download className="w-4 h-4" />
            <span className="mr-2">Create Training</span>
          </button>
        </div>
      </div>

      {/* table */}
      <TrainingsTable
      />

      <CreateTrainerModal
        isOpen={showCreateTrainerModal}
        onClose={() => setShowCreateTrainerModal(false)}
      />
       <CreateTrainingModal
        isOpen={showCreateTrainingModal}
        onClose={() => setShowCreateTrainingModal(false)}
      />
    </div>
  )
}

export default Training
