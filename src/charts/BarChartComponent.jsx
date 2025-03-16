import { Download } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const BarChartComponent = () => {
  return (
    <div style={{ width: "100%", height: "400px", padding: 0, margin: 0 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Farmers Distribution</h2>
        <button className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800">
          <Download className="w-5 h-5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 10,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="pv" fill="#16a34a" name="PV" />
          <Bar dataKey="uv" fill="#fbb03b" name="UV" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
