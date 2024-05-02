"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Link,
  Button,
  Divider,
} from "@nextui-org/react";
import { RxDownload } from "react-icons/rx";
import CustomInput from "../UI/CustomInput";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import Question from "./Question";
import { IoSendOutline } from "react-icons/io5";

const createLectureSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const LectureItem = ({ lecture }) => {
  const { data: questionData, isLoading  , mutate} = useSWR(`/api/v2/lecture/${lecture.id}/question`, fetcher);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: createLectureSchema,
    onSubmit: async ({ content }) => {
      setLoading(true);
      try {
        await axios.post(`/api/v2/lecture/${lecture.id}/question`, { content });

        toast.success("Successfully Created question");
        mutate()
        formik.resetForm();
      } catch (error) {
        toast.error("Error Creating Lecture");
      } finally {
        setLoading(false);
      }
    },
  });
  console.log(questionData);
 if (isLoading) return <div>Loading</div>;
  return (
    <>
      <Card fullWidth isBlurred className="p-4">
        <CardHeader className="flex flex-col justify-start items-start gap-4">
          <div className="flex gap-4 items-center">
            <span className=" first-letter:text-green-500 text-xl">
              Description :
            </span>
            <p>{lecture.description}</p>
          </div>
          <Divider />
          {lecture.link && (
            <div>
              This Link is for the lecture
              <Link
                className="px-4"
                showAnchorIcon
                color="success"
                href={lecture.link}
              >
                {`Go To  ${lecture.link.split("/")[2]}`}
              </Link>
            </div>
          )}
          {lecture.file && (
            <div>
              {" "}
              This Files is for the lecture
              {lecture.file.map((file, index) => {
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
                  <div
                    key={index}
                    className="relative p-4 flex  justify-evenly items-center"
                  >
                    <span className="font-bold truncate ... w-3/6">
                      {file.name}
                    </span>
                    <span className="text-gray-500">{fileType}</span>
                    <Button
                      as={Link}
                      download
                      href={file.path}
                      color="success"
                      isIconOnly
                      className=" rounded-full"
                    >
                      <RxDownload />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <Divider />
        </CardHeader>
        <CardBody className="flex flex-col justify-start items-start gap-4">
          <div className="flex gap-4 items-center">
            <span className=" first-letter:text-green-500 text-xl">
              Question :
            </span>
            <p>{questionData.length}</p>
          </div>
          <Divider />
          {questionData.map((question, index) => (
            <Question key={index} question={question} mutate={mutate}/>
          ))}
        </CardBody>
          <CardFooter >
        {session && session.user.type === "STUDENT" && (

<div className="flex justify-center items-center gap-5 w-full">
<CustomInput label="Question" formik={formik} fieldName="content" />
            <Button
              isIconOnly
              isLoading={loading}
              variant="flat"
              color="success"
              className="  flex justify-center items-center   px-10 py-4"
              size="lg"
              onPress={formik.handleSubmit}
            >
              Send
            </Button>
</div>
        )}

          </CardFooter>
      </Card>
    </>
  );
};

export default LectureItem;
