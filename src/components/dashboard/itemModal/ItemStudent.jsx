'use client'
import React from "react";
import { Tabs, Tab, Button } from "@nextui-org/react";
import CustomInput from "@/components/UI/CustomInput";
import CustomSelect from "@/components/UI/CustomSelect";
import FormikCreateStudent from "@/utils/formik/itemCreate/FormikCreateStudent";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
import ExcelUpload from "@/components/UI/ExcelUpload";
const ItemStudent = () => {
  const { formik, loading , reloadKey} = FormikCreateStudent();
  const { data: session } = useSession();

  const department = useSWR(session? `/api/v1/institution/${session.user.institution}/department` : null, fetcher);
  const year = useSWR(session? `/api/v1/institution/${session.user.institution}/year` : null, fetcher);
  const semester = useSWR(() => formik.values.year ? `/api/v1/institution/${session.user.institution}/semester?year=${formik.values.year}` : null, fetcher);

  if (!session) return <div>Loading...</div>;

  const formFields = [
    { label: "Name", fieldName: "name" },
    { label: "Birth", fieldName: "birth", type: "date" },
    { label: "Address", fieldName: "address" },
    { label: "Phone", fieldName: "phone" },
    { label: "Code", fieldName: "code" },
    { label: "Start Year", fieldName: "startYear", type: "date" },
    { label: "Grade", fieldName: "grade" },
  ];

  const selectFields = [
    { label: "Gender", fieldName: "gender", options: [{ id: "MALE", name: "male" }, { id: "FEMALE", name: "female" }], placeholder: "Select a Gender" },
    { label: "Department", fieldName: "department", options: department.data, isLoading: department.isLoading, placeholder: "Select a Department" },
    { label: "Year", fieldName: "year", options: year.data, isLoading: year.isLoading, placeholder: "Select a Year" },
    { label: "Semester", fieldName: "semester", options: semester.data, isLoading: semester.isLoading, placeholder: "Select a Semester" },
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
    "department",
    "year",
    "semester",
    "name",
    "birth",
    "gender",
    "address",
    "phone",
    "code",
    "startYear",
    "grade",
  ]} api={"/api/v2/student/excel"}/>
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

export default ItemStudent;
