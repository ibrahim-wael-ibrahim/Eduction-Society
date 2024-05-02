import { Input } from "@nextui-org/react";
const CustomInput = ({ label, description,placeholder,className="",disable, fieldName,required = false, type = "text", endContent , formik  ,labelPlace="inside"}) => {
    return (
      <Input
        type={type}
        label={label}
        size="lg"
        variant="solid"
        labelPlacement={labelPlace}
        isRequired={required}
        placeholder={placeholder}
        description={description}
        isClearable
        isDisabled={disable}
        isInvalid={formik.errors[fieldName] && formik.touched[fieldName]}
        color={"success"}
        errorMessage={(formik.errors[fieldName] && formik.touched[fieldName]) ? formik.errors[fieldName] : null}
        onValueChange={(value) => {
          if(type === "email"){
            formik.setFieldTouched(fieldName, true);
            formik.handleChange(fieldName)(value.toLowerCase());
          }
          else{
            formik.setFieldTouched(fieldName, true);
            formik.handleChange(fieldName)(value);
          }

        }}
        onBlur={() => formik.handleBlur(fieldName)}
        value={formik.values[fieldName] ||""}
        className={className}
        endContent={endContent}
      />
    );
  };
  export default CustomInput;
