import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react"; // Import the Download icon

// Sample data
const data = [
  { county: "County A", people: 4000, businesses: 2400 },
  { county: "County B", people: 3000, businesses: 1398 },
  { county: "County C", people: 2000, businesses: 9800 },
  { county: "County D", people: 2780, businesses: 3908 },
  { county: "County E", people: 1890, businesses: 4800 },
  { county: "County F", people: 2390, businesses: 3800 },
  { county: "County G", people: 3490, businesses: 4300 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{`County: ${label}`}</p>
        <p className="text-sm text-blue-500">{`People: ${payload[0].value}`}</p>
        <p className="text-sm text-green-500">{`Businesses: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

// LineChartComponent
const LineChartComponent = () => {
  return (
    <div style={{ width: "100%", height: "400px", padding: 0, margin: 0 }}>
      {/* Heading and Download Icon */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Farmers Activities</h2>
        <button className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="county"
            tick={{ fill: "#555" }}
            axisLine={{ stroke: "#ccc" }}
          />
          <YAxis tick={{ fill: "#555" }} axisLine={{ stroke: "#ccc" }} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="people"
            stroke="#008000"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="People"
          />
          <Line
            type="monotone"
            dataKey="businesses"
            stroke="#fbb03b"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Businesses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
