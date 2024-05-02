"use client";
import React from "react";
import CustomInput from "@/components/UI/CustomInput";
import FormikCreateYear from "@/utils/formik/itemCreate/FormikCreateYear";
import { Button } from "@nextui-org/react";
const ItemYear = () => {
  const { formik, loading, reloadKey } = FormikCreateYear();
  return (
    <React.Fragment key={reloadKey}>
      <CustomInput
        labelPlace="outside"
        label="name"
        formik={formik}
        fieldName={"name"}
      />
      <Button
        color="success"
        variant="shadow"
        isLoading={loading}
        onPress={() => formik.handleSubmit()}
        className="w-full mt-8"
      >
        {loading ? "Loading..." : "Create"}
      </Button>
    </React.Fragment>
  );
};

export default ItemYear;
