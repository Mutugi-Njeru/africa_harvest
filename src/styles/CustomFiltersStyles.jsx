const CustomFiltersStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f9fafb",
    borderColor: state.isFocused ? "#14503c" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #14503c" : "none",
    "&:hover": {
      borderColor: "#14503c",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#E8F4EF" : "white", // Selected option background
    color: state.isSelected ? "white" : "#000000", // Selected option text color
    "&:hover": {
      backgroundColor: "#E8F4EF", // Hover background
      color: "#000000", // Hover text color
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e8f4ef", // Background color for selected items
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
