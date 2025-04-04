import { Download, Plus } from "lucide-react";
import React from "react";
import WardsTable from "./WardTable";

const Ward = () => {
  return (
    <div className="pr-4 pl-3 relative">
      {/* header */}
      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="text-xl font-bold text-gray-600">Wards</div>
        <div className=" justify-end items-center">
          <button className="flex items-center cursor-pointer border border-black pl-3 pr-3 p-2 text-black">
            <Download className="w-4 h-4" />
            <span className="mr-2">Export CSV</span>
          </button>
        </div>
      </div>
      {/* table */}
      <WardsTable />
    </div>
  );
};

export default Ward;
