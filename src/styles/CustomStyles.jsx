const CustomStyles = {
  control: (base) => ({
    ...base,
    minHeight: "42px",
    background: "white",
    // borderRadius: "0.5rem",
    borderColor: "#e2e8f0",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#94a3b8",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#1e293b",
    "&:active": {
      backgroundColor: "#bfdbfe",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
  }),
};
export default CustomStyles;
