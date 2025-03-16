import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  // Data for the pie chart
  const data = {
    labels: ["Green", "Yellow"],
    datasets: [
      {
        data: [60, 40], // Example data values
        backgroundColor: ["#16a34a", "#fbb03b"], // Colors for the pie chart
        hoverBackgroundColor: ["#4CAF50", "#fbb03b"], // Hover colors
      },
    ],
  };

  // Options for the pie chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,

        text: "Pie Chart Example",
      },
    },
  };

  return (
    <div style={{ width: "350px", height: "350px" }}>
      <h2 className="text-xl font-semibold text-center">Gender Distribution</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
