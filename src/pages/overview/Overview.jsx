import React from "react";
import TopCards from "../../components/TopCards";
import Filters from "../../components/Filters";

const Overview = () => {
  return (
    <div>
      <div className="flex justify-end items-center">
        <div>one</div>
        <div>two</div>
      </div>

      <Filters />
      <TopCards />
    </div>
  );
};

export default Overview;
