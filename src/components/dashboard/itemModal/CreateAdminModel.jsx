'use client'
import React from 'react'
import { Select , SelectItem ,Button } from '@nextui-org/react'
import CustomInput from '../../UI/CustomInput'
import FormikCreateAdmin from '@/utils/formik/itemCreate/FormikCreateAdmin'
const CreateAdminModel = () => {
    const { formik, loading , reloadKey } = FormikCreateAdmin();
  return (
    <React.Fragment key={reloadKey}>
    <CustomInput
    labelPlace='outside'
    label='Name'
    formik={formik}
    fieldName={"name"}
    />
    <CustomInput
    type='date'
    formik={formik}
    fieldName={"birthDay"}
    />
    <Select
        label="Type"
        variant="solid"
        labelPlacement="outside"
        isRequired
        placeholder="Select a Type"
        selectionMode="single"
        onChange={(e) => {
            formik.setFieldValue("type", e.target.value);
        }}
        value={formik.values.type}
        isInvalid={
          formik.errors["type"] && formik.touched["type"]
        }
        errorMessage={
          formik.errors["type"] && formik.touched["type"]
            ? formik.errors["type"]
            : null
        }
        onBlur={() => formik.handleBlur("type")}
      >
          <SelectItem value="male" key={"ADMIN_REGISTER"}>Admin Register</SelectItem>
          <SelectItem value="female" key={"ADMIN_SOCIAL"}>Admin Social</SelectItem>
      </Select>
    <Select
        label="Gender"
        variant="solid"
        labelPlacement="outside"
        isRequired
        placeholder="Select a Gender"
        selectionMode="single"
        onChange={(e) => {
            formik.setFieldValue("gender", e.target.value);
        }}
        value={formik.values.gender}
        isInvalid={
          formik.errors["gender"] && formik.touched["gender"]
        }
        errorMessage={
          formik.errors["gender"] && formik.touched["gender"]
            ? formik.errors["gender"]
            : null
        }
        onBlur={() => formik.handleBlur("gender")}
      >
          <SelectItem value="MALE" key={"MALE"}>male</SelectItem>
          <SelectItem value="FEMALE" key={"FEMALE"}>female</SelectItem>
      </Select>
      <Button onPress={formik.handleSubmit} isLoading={loading}>submit</Button>
    </React.Fragment>
  )
}

export default CreateAdminModel