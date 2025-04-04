const CustomFiltersStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f9fafb",
    borderColor: state.isFocused ? "#FDE047" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #FDE047" : "none",
    "&:hover": {
      borderColor: "#FDE047",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#fbb03b" : "white", // Selected option background
    color: state.isSelected ? "white" : "#1f2937", // Selected option text color
    "&:hover": {
      backgroundColor: "#fbb03b", // Hover background
      color: "#1f2937", // Hover text color
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e0e7ff", // Background color for selected items
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#4f46e5", // Text color for selected items
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#4f46e5", // Remove icon color
    "&:hover": {
      backgroundColor: "#4f46e5", // Hover background for remove icon
      color: "white", // Hover color for remove icon
    },
  }),
};
export default CustomFiltersStyles;
