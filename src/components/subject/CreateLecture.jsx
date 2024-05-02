"use client";
import React from "react";
import CustomInput from "../UI/CustomInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSWRConfig } from "swr";
import { Button, Card } from "@nextui-org/react";
import { FaUpload } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

const createLectureSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  link: Yup.string(),
});

const CreateLecture = ({ take }) => {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      link: "",
      files: "",
    },
    validationSchema: createLectureSchema,
    onSubmit: async ({ name, description, link, files }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        files.length > 0 &&
          files.forEach((file) => {
            formData.append("file", file);
          });
        formData.append("name", name);
        formData.append("description", description);
        formData.append("link", link);

        await axios.post(`/api/v2/takeSubject/${take}/lecture`, formData);
        toast.success("Successfully Created Lecture");
        mutate(`/api/v2/takeSubject/${take}/lecture`);
        formik.resetForm();
      } catch (error) {
        toast.error("Error Creating Lecture");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <CustomInput
  labelPlace='outside'
  label='Name'
  formik={formik}
  fieldName={"name"}
      />
      <CustomInput
  labelPlace='outside'
  label='Description'
  formik={formik}
  fieldName={"description"}
      />
      <CustomInput
  labelPlace='outside'
  label='Link'
  formik={formik}
  fieldName={"link"}
      />
      <input
        type="file"
        multiple
        onChange={(e) => {
          formik.setFieldValue("files", [
            ...formik.values.files,
            ...e.target.files,
          ]);
        }}
        className="hidden" 
        name="files"
        id="files"
      />
      {formik.values.files.length > 0 ? (
        <>
          {formik.values.files.map((file, index) => {
            const extension = file.name.split(".").pop().toLowerCase();
            let fileType;

            if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
              fileType = "Photo";
            } else if (["mp4", "avi", "mov"].includes(extension)) {
              fileType = "Video";
            } else {
              fileType = "Docs";
            }

            return (
              <div key={index} className="relative p-4 flex  justify-evenly items-center">
                <span className="font-bold truncate ... w-3/6">{file.name}</span>
                <span className="text-gray-500">{fileType}</span>
                <Button
                  variant="flat"
                  color="danger"
                  isIconOnly
                  className="rounded-full "
                  onPress={() => {
                    formik.setFieldValue(
                      "files",
                      formik.values.files.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <IoIosClose />
                </Button>
              </div>
            );
          })}
        </>
      ) : (
        <Card className="h-[300px] w-full">
          <Button
            htmlFor="files"
            as="label"
            color="success"
            variant="flat"
            className="w-full h-full p-0 FLEX-CENTER"
            isIconOnly
          >
            <FaUpload size={60} />
          </Button>
        </Card>
      )}

      <Button
        onPress={formik.handleSubmit}
        isLoading={loading}
        variant="shadow"
        color="success"
        className="w-full"
      >
        {loading ? "Loading..." : "Create Lecture"}
      </Button>
    </>
  );
};

export default CreateLecture;
