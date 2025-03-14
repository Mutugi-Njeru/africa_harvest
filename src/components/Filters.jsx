import React, { useState } from "react";
import Select from "react-select";
import { FiCalendar, FiFilter } from "react-icons/fi";

const Filters = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: "42px",
      background: "white",
      // borderRadius: "0.5rem",
      borderColor: "#e2e8f0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#eff6ff"
        : "white",
      color: state.isSelected ? "white" : "#1e293b",
      "&:active": {
        backgroundColor: "#bfdbfe",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ml-5 mr-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
            Region
          </label>
          <Select
            placeholder="Select region"
            styles={customStyles}
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
            styles={customStyles}
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
            styles={customStyles}
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
            styles={customStyles}
            isClearable
            className="w-full"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
            <div className="flex items-center gap-1">
              <FiCalendar className="text-blue-600" />
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
              <FiCalendar className="text-blue-600" />
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
  );
};

export default Filters;
