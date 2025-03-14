import React, { useState } from "react";
import Select from "react-select";
import { FiCalendar } from "react-icons/fi";
import CustomStyles from "../styles/CustomStyles";

const Filters = ({ showFilters }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
      } overflow-hidden`}
    >
      <div className="bg-white shadow-md p-6 ml-5 mr-5 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Region
            </label>
            <Select
              placeholder="Select region"
              styles={CustomStyles}
              isClearable
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              County
            </label>
            <Select
              placeholder="Select county"
              styles={CustomStyles}
              isClearable
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Subcounty
            </label>
            <Select
              placeholder="Select subcounty"
              styles={CustomStyles}
              isClearable
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Ward
            </label>
            <Select
              placeholder="Select ward"
              styles={CustomStyles}
              isClearable
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              <div className="flex items-center gap-1">
                <FiCalendar className="text-yellowOrange" />
                <span>Start Date</span>
              </div>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              <div className="flex items-center gap-1">
                <FiCalendar className="text-yellowOrange" />
                <span>End Date</span>
              </div>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
