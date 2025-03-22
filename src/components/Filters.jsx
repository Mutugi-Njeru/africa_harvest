import React, { useState } from "react";
import Select from "react-select";
import { FiCalendar } from "react-icons/fi";
import CustomStyles from "../styles/CustomStyles";
import { Tooltip } from "react-tooltip";

const Filters = ({ showFilters }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedSubcounties, setSelectedSubcounties] = useState([]);

  // Dummy data
  const regions = [
    {
      value: "region1",
      label: "Region 1",
      counties: [
        {
          value: "county1",
          label: "County 1",
          subcounties: [
            {
              value: "subcounty1",
              label: "Subcounty 1",
              wards: [
                { value: "ward1", label: "Ward 1" },
                { value: "ward2", label: "Ward 2" },
              ],
            },
            {
              value: "subcounty2",
              label: "Subcounty 2",
              wards: [
                { value: "ward3", label: "Ward 3" },
                { value: "ward4", label: "Ward 4" },
              ],
            },
          ],
        },
        {
          value: "county2",
          label: "County 2",
          subcounties: [
            {
              value: "subcounty3",
              label: "Subcounty 3",
              wards: [
                { value: "ward5", label: "Ward 5" },
                { value: "ward6", label: "Ward 6" },
              ],
            },
            {
              value: "subcounty4",
              label: "Subcounty 4",
              wards: [
                { value: "ward7", label: "Ward 7" },
                { value: "ward8", label: "Ward 8" },
              ],
            },
          ],
        },
      ],
    },
    {
      value: "region2",
      label: "Region 2",
      counties: [
        {
          value: "county3",
          label: "County 3",
          subcounties: [
            {
              value: "subcounty5",
              label: "Subcounty 5",
              wards: [
                { value: "ward9", label: "Ward 9" },
                { value: "ward10", label: "Ward 10" },
              ],
            },
            {
              value: "subcounty6",
              label: "Subcounty 6",
              wards: [
                { value: "ward11", label: "Ward 11" },
                { value: "ward12", label: "Ward 12" },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Get counties based on selected regions
  const getCounties = () => {
    if (!selectedRegions.length) return [];
    return selectedRegions.flatMap(
      (region) => regions.find((r) => r.value === region.value)?.counties || []
    );
  };

  // Get subcounties based on selected counties
  const getSubcounties = () => {
    if (!selectedCounties.length) return [];
    return selectedCounties.flatMap(
      (county) =>
        getCounties().find((c) => c.value === county.value)?.subcounties || []
    );
  };

  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
      }`}
    >
      <div className="bg-white shadow-md p-6 ml-5 mr-5 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Region Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Region
            </label>
            <Select
              isMulti
              placeholder="Select region"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={regions}
              onChange={(selected) => {
                setSelectedRegions(selected);
                setSelectedCounties([]); // Reset counties when regions change
                setSelectedSubcounties([]); // Reset subcounties when regions change
              }}
              value={selectedRegions}
              data-tooltip-id="region-tooltip"
            />

            <Tooltip
              id="region-tooltip"
              place="top"
              content="You do not have permission to select a region."
            />
          </div>

          {/* County Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              County
            </label>
            <Select
              isMulti
              placeholder="Select county"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={getCounties()}
              onChange={(selected) => {
                setSelectedCounties(selected);
                setSelectedSubcounties([]); // Reset subcounties when counties change
              }}
              value={selectedCounties}
              data-tooltip-id="county-tooltip"
            />
          </div>

          {/* Subcounty Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Subcounty
            </label>
            <Select
              isMulti
              placeholder="Select subcounty"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={getSubcounties()}
              onChange={(selected) => setSelectedSubcounties(selected)}
              value={selectedSubcounties}
              data-tooltip-id="subcounty-tooltip"
            />
          </div>

          {/* Ward Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Ward
            </label>
            <Select
              isMulti
              placeholder="Select ward"
              styles={CustomStyles}
              isClearable
              className="w-full"
              options={selectedSubcounties.flatMap(
                (subcounty) => subcounty.wards || []
              )}
            />
          </div>

          {/* Start Date Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <FiCalendar className="text-yellowOrange" />
                <span>Start Date</span>
              </div>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date Field */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <FiCalendar className="text-yellowOrange" />
                <span>End Date</span>
              </div>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
