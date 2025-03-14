const CustomSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
    minHeight: "42px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#cbd5e1",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#94a3b8",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f59e0b"
      : state.isFocused
      ? "#fef3c7"
      : null,
    color: state.isSelected ? "white" : "#1e293b",
    "&:active": {
      backgroundColor: "#fef3c7",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
};
export default CustomSelectStyles;
