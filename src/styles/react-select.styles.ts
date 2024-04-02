export const ReactSelectStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    textAlign: "left",
  }),
  control: (provided: any) => ({
    ...provided,
    minHeight: "45px",
    borderRadius: 10,
    borderColor: "black",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    justifyContent: "left", // Ensures content within the value container is left-aligned
  }),
};
