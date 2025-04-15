import React from "react";
import CustomFiltersStyles from "../../styles/CustomFiltersStyles";

const CreateEngagementModal = ({ handleCloseModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Create Engagement</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                // value={formData.groupName}
                // onChange={handleInputChange}
                placeholder="Group Name"
                className=" block w-full px-3 py-1.5 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                required
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Ward
              </label>
              <Select
                name="wardId"
                // options={wardOptions}
                // onChange={handleWardChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Group Manager
              </label>
              <Select
                name="wardId"
                // options={wardCoordinatorOptions}
                // onChange={handleCoordinatorChange}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={CustomFiltersStyles}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              //   value={formData.description}
              //   onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              rows="3"
            />
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-1/2 px-4 py-2.5 bg-red-400 hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700"
              //   disabled={isCreating}
            >
              {/* {isCreating ? "Creating" : "Create"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEngagementModal;
