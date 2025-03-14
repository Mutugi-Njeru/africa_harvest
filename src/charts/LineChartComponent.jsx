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
    <ResponsiveContainer width="100%" height={400}>
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
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => (
            <span style={{ color: "#555", fontWeight: "500" }}>{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="people"
          stroke="#fbb03b"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="People"
        />
        <Line
          type="monotone"
          dataKey="businesses"
          stroke="#82ca9d"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Businesses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
