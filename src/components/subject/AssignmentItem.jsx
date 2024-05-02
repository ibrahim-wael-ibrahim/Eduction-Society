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
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import axios from "axios";
import SubmitAssignment from "./SubmitAssignment";
import { IoSendOutline } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

const AssignmentItem = ({ assignment, mutate }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      files: "",
    },
    onSubmit: async ({ files }) => {
      const formData = new FormData();
      files.length > 0 &&
        files.forEach((file) => {
          formData.append("file", file);
        });
      setLoading(true);
      try {
        await axios.post(
          `/api/v2/assignment/${assignment.id}/submtionAssignment`,
          formData
        );
        await mutate();
        toast.success("Successfully Created submtion Assignment");
        formik.resetForm();
      } catch (error) {
        console.log(error);
        toast.error("Error Creating submtion Assignment");
      } finally {
        setLoading(false);
      }
    },
  });

  const FileUploadComponent = () => {
    return (
      <>
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
                <div
                  key={index}
                  className="relative p-4 flex  justify-evenly items-center"
                >
                  <span className="font-bold truncate ... w-3/6">
                    {file.name}
                  </span>
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
        {session &&
          session.user.type === "STUDENT" &&
          formik.values.files.length > 0 && (
            <Button
              color="success"
              variant="shadow"
              onPress={formik.handleSubmit}
              disabled={loading}
              className="flex gap-2 w-full"
            >
              <IoSendOutline />
              Submit
            </Button>
          )}
      </>
    );
  };

  return (
    <>
      <Card fullWidth isBlurred className="p-4">
        <CardHeader className="flex flex-col justify-start items-start gap-4">
          {assignment.description && (
            <>
              <div className="flex gap-4 items-center">
                <span className=" first-letter:text-green-500 text-xl">
                  Description :
                </span>
                <p>{assignment.description}</p>
              </div>
              <Divider />
            </>
          )}
          {assignment.link && (
            <div>
              This Link is for the lecture
              <Link
                className="px-4"
                showAnchorIcon
                color="success"
                href={assignment.link}
              >
                {`Go To  ${assignment.link.split("/")[2]}`}
              </Link>
            </div>
          )}
          {assignment.file && (
            <div>
              {" "}
              This Files is for the lecture
              {assignment.file.map((file, index) => {
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
              Submit Assignment : {assignment.submit.length}
            </span>
          </div>
          <Divider />
          {session &&
            (session.user.type === "PROFESSOR" ||
              session.user.type === "TEACHER") &&
            assignment.submit.length > 0 &&
            assignment.submit.map((submit, index) => {
              return (
                <SubmitAssignment
                  key={index}
                  submit={submit}
                  mutate={mutate}
                  assignment={assignment.id}
                />
              );
            })}
        </CardBody>
        <CardFooter className="flex flex-col justify-center items-center gap-4">
          {session &&
            session.user.type === "STUDENT" &&
            
            assignment.submit.filter (
              (submit) => submit.student.id === session.user.student
            ).length === 0 ? (
              <FileUploadComponent />
            ) : (
              <>
              {
                assignment.submit.map((submit, index) => {
                  if (submit.student.id === session.user.student) {
                    return (
                      <SubmitAssignment
                        key={index}
                        submit={submit}
                        mutate={mutate}
                        assignment={assignment.id}
                        access={true}
                      />
                    );
                  }
                })
              }
              </>
            )

          }
        </CardFooter>
      </Card>
    </>
  );
};

export default AssignmentItem;
