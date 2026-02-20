import React from 'react'
import CustomFiltersStyles from '../../styles/CustomFiltersStyles';
import Select from "react-select";

const CreateTrainingModal = ({isOpen, onClose, trainers = [], chains = []}) => {
    if (!isOpen) return null;

    // Transform trainers data for react-select
    const trainerOptions = trainers.map(trainer => ({
        value: trainer.id,
        label: trainer.name
    }));

    // Transform chains data for react-select
    const chainOptions = chains.map(chain => ({
        value: chain.id,
        label: chain.name
    }));

    const statusOptions = [
        { value: 'SCHEDULED', label: 'Scheduled' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const trainingData = {
            title: formData.get('title'),
            description: formData.get('description'),
            trainerId: parseInt(formData.get('trainerId')),
            chainId: parseInt(formData.get('chainId')),
            trainingDate: formData.get('trainingDate'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            location: formData.get('location'),
            maxParticipants: parseInt(formData.get('maxParticipants')),
            status: formData.get('status'),
            notes: formData.get('notes')
        };
        console.log('Training data:', trainingData);
        // Add your API call here
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6 md:p-8 z-50">
            <div className="bg-white p-4 sm:p-6 shadow-lg w-full sm:w-[90%] md:w-[900px] max-w-[900px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Create Training</h2>
                <form onSubmit={handleSubmit}>
                    {/* First row: Title and Description */}
                    <div className="mb-4 sm:flex sm:gap-4">
                        <div className='mb-4 sm:mb-0 sm:flex-1'>
                            <label className="block text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g., Safety Training 2024"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <input
                                type="text"
                                name="description"
                                placeholder="e.g., Annual safety compliance training"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Second row: Trainer and Chain selects */}
                    <div className="mb-4 sm:flex sm:gap-4">
                        <div className='mb-4 sm:mb-0 sm:flex-1'>
                            <label className="block text-sm font-medium text-gray-700">
                                Trainer *
                            </label>
                            <Select
                                name="trainerId"
                                options={trainerOptions}
                                className="basic-multi-select"
                                styles={CustomFiltersStyles}
                                placeholder="Select trainer..."
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Chain *
                            </label>
                            <Select
                                name="chainId"
                                options={chainOptions}
                                className="basic-multi-select"
                                styles={CustomFiltersStyles}
                                placeholder="Select chain..."
                                required
                            />
                        </div>
                    </div>

                    {/* Third row: Date and Times */}
                    <div className="mb-4 sm:flex sm:gap-4">
                        <div className='mb-4 sm:mb-0 sm:flex-1'>
                            <label className="block text-sm font-medium text-gray-700">
                                Training Date *
                            </label>
                            <input
                                type="date"
                                name="trainingDate"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                End Time *
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Fourth row: Location and Max Participants */}
                    <div className="mb-4 sm:flex sm:gap-4">
                        <div className='mb-4 sm:mb-0 sm:flex-1'>
                            <label className="block text-sm font-medium text-gray-700">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g., Conference Room A"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Max Participants *
                            </label>
                            <input
                                type="number"
                                name="maxParticipants"
                                min="1"
                                placeholder="e.g., 50"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Fifth row: Status and Notes */}
                    <div className="mb-4 sm:flex sm:gap-4">
                        <div className='mb-4 sm:mb-0 sm:flex-1'>
                            <label className="block text-sm font-medium text-gray-700">
                                Status *
                            </label>
                            <Select
                                name="status"
                                options={statusOptions}
                                className="basic-multi-select"
                                styles={CustomFiltersStyles}
                                placeholder="Select status..."
                                defaultValue={{ value: 'SCHEDULED', label: 'Scheduled' }}
                                required
                            />
                        </div>
                        <div className="sm:flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                placeholder="e.g., Bring safety gear"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600 sm:mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700 sm:ml-2"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTrainingModal