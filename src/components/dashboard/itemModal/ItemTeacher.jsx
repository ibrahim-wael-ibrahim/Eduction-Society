'use client'
import React from "react";
import { Tabs, Tab, Button } from "@nextui-org/react";
import CustomInput from "@/components/UI/CustomInput";
import CustomSelect from "@/components/UI/CustomSelect";
import FormikCreateTeacher from "@/utils/formik/itemCreate/FormikCreateTeacher";
import ExcelUpload from "@/components/UI/ExcelUpload";
const ItemTeacher = () => {
  const { formik, loading , reloadKey} = FormikCreateTeacher();

  const formFields = [
    { label: "Name", fieldName: "name" },
    { label: "Birth", fieldName: "birth", type: "date" },
    { label: "Address", fieldName: "address" },
    { label: "Phone", fieldName: "phone" },
    { label: "Degree", fieldName: "degree" },
    { label: "Degree About", fieldName: "about" },
  ];

  const selectFields = [
    { label: "Gender", fieldName: "gender", options: [{ id: "MALE", name: "male" }, { id: "FEMALE", name: "female" }], placeholder: "Select a Gender" },
    { label: "Type", fieldName: "type", options: [{ id: "TEACHER", name: "Teacher" }, { id: "PROFESSOR", name: "Professor" }], placeholder: "Select a Type" },
  ];

  return (
    <React.Fragment key={reloadKey}>
      <Tabs fullWidth size="md" aria-label="Tabs form">
        <Tab key="one" title="One" className="flex flex-col justify-start items-center gap-4 w-full">
          {formFields.map(field => (
            <CustomInput
              key={field.fieldName}
              label={field.label}
              formik={formik}
              labelPlace="outside"
              fieldName={field.fieldName}
              type={field.type}
            />
          ))}
          {selectFields.map(field => (
            <CustomSelect
              key={field.fieldName}
              label={field.label}
              fieldName={field.fieldName}
              formik={formik}
              options={field.options}
              isLoading={field.isLoading}
              placeholder={field.placeholder}
              returnValue={field.returnValue}
            />
          ))}
          <Button color='success' variant='shadow' isLoading={loading} onPress={formik.handleSubmit} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
          </Button>
        </Tab>
        <Tab key="many" title="Many" className="flex flex-col justify-start items-center">
          <ExcelUpload testKeys={[
            "name",
            "birth",
            "gender",
            "address",
            "phone",
            "type",
            "degree",
            "about",
          ]} api={"/api/v2/teacher/excel"} />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default ItemTeacher;
