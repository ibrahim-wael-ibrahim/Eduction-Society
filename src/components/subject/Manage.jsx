import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
import CreateLecture from "./CreateLecture";
import CreateAssignment from "./CreateAssignment";
import ModalContainer from "../UI/ModalContainer";
import { MdOutlinePlayLesson, MdOutlineAssignment } from "react-icons/md";

const Manage = ({ take }) => {
  const { data: takeData, isLoading } = useSWR(
    `/api/v2/takeSubject/${take}`,
    fetcher
  );
  const { ModalUI: CreateLectureModel, handleOpen: openCreateLecture } =
    ModalContainer("CreateLecture");
  const { ModalUI: CreateAssignmentModel, handleOpen: openCreateAssignment } =
    ModalContainer("CreateAssignment");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <CreateLectureModel title={"Create Lecture"}>
        <CreateLecture take={take} />
      </CreateLectureModel>

      <CreateAssignmentModel title={"Create Assignment"}>
        <CreateAssignment take={take} />
      </CreateAssignmentModel>
      <Card fullWidth isBlurred className=" h-screen">
        <CardHeader>
          {isLoading && (
            <div className="flex justify-center items-center w-full gap-4">
              Loading...
            </div>
          )}
          {takeData && (
            <div className="flex flex-wrap justify-center items-center w-full gap-4">
              <Card className="w-[250px] p-4 " isPressable>
                <h1 className="  first-letter:text-green-500">{`Department : ${takeData.department.name}`}</h1>
              </Card>
              <Card className="w-[250px] p-4 " isPressable>
                <h1 className="  first-letter:text-green-500">{`Subject : ${takeData.subject.name}`}</h1>
              </Card>
              <Card className="w-[250px] p-4 " isPressable>
                <h1 className="  first-letter:text-green-500">{`Year : ${takeData.year.name}`}</h1>
              </Card>
            </div>
          )}
        </CardHeader>
        <CardBody className="flex flex-row flex-wrap  justify-center items-start gap-8 p-8">
        <Card
            className="h-[300px] w-[300px] aspect-square"
            isBlurred
            isPressable
            onPress={openCreateLecture}
          >            {loading ? (
              <Spinner color="success" size="lg" label="Loading..." />
            ) : (
              <CardBody className="w-full aspect-square FLEX-CENTER gap-8">
                                 <MdOutlinePlayLesson size={100} />
                  <span className="capitalize first-letter:text-green-500 text-center">
                    create lecture
                  </span>
              </CardBody>
            )}
          </Card>

          <Card
            className="h-[300px] w-[300px] aspect-square"
            isBlurred
            isPressable
            onPress={openCreateAssignment}
          >
            {loading ? (
              <Spinner color="success" size="lg" label="Loading..." />
            ) : (
              <CardBody className="w-full aspect-square FLEX-CENTER gap-8">
                <MdOutlineAssignment size={100} />
                <span className="capitalize first-letter:text-green-500 text-center">
                  Create Assignment
                </span>
              </CardBody>
            )}
          </Card>
        </CardBody>
      </Card>
    </>
  );
};

export default Manage;
