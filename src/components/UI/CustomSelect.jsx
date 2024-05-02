// CustomSelect.js

import { Select, SelectItem } from "@nextui-org/react";

const CustomSelect = ({
  label,
  fieldName,
  formik,
  options,
  isLoading,
  placeholder = "Select an option",
  show = "name",
    returnValue = "id",
}) => {
  return (
    <Select
      label={label}
      variant="solid"
      labelPlacement="outside"
      isRequired
      placeholder={placeholder}
      selectionMode="single"
      onChange={(e) => {
        formik.setFieldValue(fieldName, e.target.value);
      }}
      value={formik.values[fieldName]}
      isInvalid={formik.errors[fieldName] && formik.touched[fieldName]}
      errorMessage={
        formik.errors[fieldName] && formik.touched[fieldName]
          ? formik.errors[fieldName]
          : null
      }
      onBlur={() => formik.handleBlur(fieldName)}
    >
      {isLoading ? (
        <SelectItem value="Loading...">Loading...</SelectItem>
      ) : (
        options &&  options.map((option) => (
          <SelectItem key={
            (returnValue.includes('.'))? option[returnValue.split('.')[0]][returnValue.split('.')[1]] : option[returnValue]
          } value={option[returnValue]}>
            {
              (show.includes('.'))? option[show.split('.')[0]][show.split('.')[1]] : option[show]
            }
          </SelectItem>
        ))
      )}
    </Select>
  );
};

export default CustomSelect;
