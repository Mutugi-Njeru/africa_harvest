import React, { useState } from "react";
import Select from "react-select";
import { FiCalendar } from "react-icons/fi";
import CustomStyles from "../styles/CustomStyles";

const Filters = ({ showFilters }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dummy data
  const regions = [
    { value: "region1", label: "Region 1" },
    { value: "region2", label: "Region 2" },
    { value: "region3", label: "Region 3" },
  ];

  const counties = [
    { value: "county1", label: "County 1" },
    { value: "county2", label: "County 2" },
    { value: "county3", label: "County 3" },
  ];

  const subcounties = [
    { value: "subcounty1", label: "Subcounty 1" },
    { value: "subcounty2", label: "Subcounty 2" },
    { value: "subcounty3", label: "Subcounty 3" },
  ];

  const wards = [
    { value: "ward1", label: "Ward 1" },
    { value: "ward2", label: "Ward 2" },
    { value: "ward3", label: "Ward 3" },
  ];
  const userId = 1;

  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
      } `}
    >
      <div className="bg-white shadow-md p-6 ml-5 mr-5 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Region
            </label>
            <Select
              isMulti
              placeholder="Select region"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={regions}
              isDisabled={userId === 1}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              County
            </label>
            <Select
              isMulti
              placeholder="Select county"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={counties}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Subcounty
            </label>
            <Select
              isMulti
              placeholder="Select subcounty"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={subcounties}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1 p-1">
              Ward
            </label>
            <Select
              isMulti
              placeholder="Select ward"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={wards}
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
