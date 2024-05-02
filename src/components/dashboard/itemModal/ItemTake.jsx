"use client";
import React, { useEffect, useState } from "react";
import CustomSelect from "@/components/UI/CustomSelect";
import CustomInput from "@/components/UI/CustomInput";
import FormikCreateTake from "@/utils/formik/itemCreate/FormikCreateTake";
import { Button, Switch } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";

const ItemTake = () => {
  const { formik, loading, reloadKey } = FormikCreateTake();
  const { data: session } = useSession();
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data: department, isLoading: isLoadingDepartment } = useSWR(
    `/api/v1/institution/${session.user.institution}/department`,
    fetcher
  );
  const { data: subject, isLoading: isLoadingSubject } = useSWR(
    `/api/v1/institution/${session.user.institution}/subject`,
    fetcher
  );
  const { data: year, isLoading: isLoadingYear } = useSWR(
    `/api/v1/institution/${session.user.institution}/year`,
    fetcher
  );
  const { data: semester, isLoading: isLoadingSemester } = useSWR(
    () =>
      formik.values.year
        ? `/api/v1/institution/${session.user.institution}/semester?year=${formik.values.year}`
        : null,
    fetcher
  );
  const { data: hour, isLoading: isLoadingHour } = useSWR(
    () =>
      formik.values.year && formik.values.department && formik.values.semester
        ? `/api/v1/institution/${session.user.institution}/hour?year=${formik.values.year}&department=${formik.values.department}&semester=${formik.values.semester}`
        : null,
    fetcher
  );
  return (
    <React.Fragment key={reloadKey}>
      <CustomSelect
        label="Department"
        fieldName="department"
        formik={formik}
        options={department} // Assuming you have fetched the department data elsewhere
        isLoading={isLoadingDepartment}
        placeholder="Select a Department"
      />
      <CustomSelect
        label="Subject"
        fieldName="subject"
        formik={formik}
        options={subject} // Assuming you have fetched the subject data elsewhere
        isLoading={isLoadingSubject}
        placeholder="Select a Subject"
      />
      <CustomSelect
        label="Year"
        fieldName="year"
        formik={formik}
        options={year} // Assuming you have fetched the year data elsewhere
        isLoading={isLoadingYear}
        placeholder="Select a Year"
      />
      <CustomSelect
        label="Semester"
        fieldName="semester"
        formik={formik}
        options={semester} // Assuming you have fetched the semester data elsewhere
        isLoading={isLoadingSemester}
        placeholder="Select a Semester"
      />
      <CustomSelect
        label="Hour"
        fieldName="hour"
        formik={formik}
        options={hour} // Assuming you have fetched the hour data elsewhere
        isLoading={isLoadingHour}
        placeholder="Select a Hour"
        show="price"
      />
      <CustomInput
        labelPlace="outside"
        label="Counter of Hour"
        formik={formik}
        fieldName={"hourCount"}
      />
      <Switch
        color="success"
        size="lg"
        isSelected={formik.values.optional}
        onValueChange={(e) => {
          formik.setFieldValue("optional", e);
        }}
      >
        optional Subject
      </Switch>
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

export default ItemTake;
