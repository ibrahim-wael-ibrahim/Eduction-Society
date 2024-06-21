"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { PiStudent } from "react-icons/pi";

import ModalContainer from "../UI/ModalContainer";
import ItemStudent from "./itemModal/ItemStudent";
const StudentContainer = () => {
  const { ModalUI: CreateStudentModal, handleOpen: handleCreateStudent } =
    ModalContainer("CreateStudent");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <CreateStudentModal title={"Create Student"}>
        <ItemStudent />
      </CreateStudentModal>
      <Card className=" h-[300px] aspect-square FLEX-CENTER" isBlurred>
        {loading ? (
          <Spinner color="success" size="lg" label="Loading..." />
        ) : (
          <CardBody className="flex flex-row justify-evenly items-center gap-4 p-4">
            <Card
              className="w-full aspect-square FLEX-CENTER gap-8"
              isBlurred
              isPressable
              onPress={handleCreateStudent}
            >
              <PiStudent size={100} />
              <span className="capitalize first-letter:text-green-500 text-center">
                Add Student
              </span>
            </Card>
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default StudentContainer;
