import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Finger Millet", value: 23396 },
  { name: "Sorghum", value: 110928 },
  { name: "Ground Nut", value: 39135 },
  { name: "Pigeon Pea", value: 25421 },
  { name: "Pearl Millet", value: 26428 },
  { name: "Green Gram", value: 86314 },
  { name: "Mechanization", value: 3452 },
  { name: "Poultry", value: 29548 },
  { name: "Aquaculture", value: 97563 },
  { name: "Value Addition", value: 26743 },
  { name: "Cowpea", value: 14409 },
  { name: "Other", value: 24578 },
];

const COLORS = [
  "#fbb03b",
  "#16a34a",
  "#fbb03b",
  "#16a34a",
  "#fbb03b",
  "#16a34a",
  "#fbb03b",
  "#16a34a",
  "#fbb03b",
  "#16a34a",
  "#fbb03b",
  "#16a34a",
];

const HorizontalBarChart = () => {
  return (
    <div className="w-full h-96">
      <h2 className="text-xl font-semibold">Farmers Subactivities</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }} // Adjust the left margin to create more space
        >
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12, fontFamily: "Arial", fill: "#333" }} // Adjust font size and other styles here
          />
          <Tooltip />
          <Bar dataKey="value" barSize={25} radius={[0, 5, 5, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
