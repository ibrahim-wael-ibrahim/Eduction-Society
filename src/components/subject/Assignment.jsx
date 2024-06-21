"use client";
import React from "react";
import { Card, CardBody, Accordion, AccordionItem } from "@nextui-org/react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/function/fetcher";
import { MdOutlineAssignment } from "react-icons/md";
import { useSession } from "next-auth/react";
import AssignmentItem from "./AssignmentItem";
const Assignment = ({ take }) => {
  const { data: session } = useSession();
  const {
    data: assignmentData,
    isLoading,
    mutate,
  } = useSWR(`/api/v2/takeSubject/${take}/assignment`, fetcher);
  const compareDates = (dateString) => {
    const dateObject = new Date(dateString);

    if (isNaN(dateObject)) {
      console.log("Invalid date:", dateString);
      return;
    }

    const currentDate = new Date();

    if (dateObject >= currentDate) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Card fullWidth isBlurred className=" h-full">
      <CardBody>
        {isLoading ? (
          <div>Loading</div>
        ) : assignmentData.length > 0 ? (
          <Accordion selectionMode="multiple" variant="splitted">
            {assignmentData &&
              assignmentData.map((assignment) => (
                <AccordionItem
                  isDisabled={
                    session && session.user.type === "STUDENT"
                      ? compareDates(assignment.lastDate)
                      : false
                  }
                  startContent={<MdOutlineAssignment size={40} />}
                  title={assignment.name}
                  key={assignment.id}
                  subtitle={`Start date : ${
                    assignment.date.split("T")[0]
                  } / End date : ${assignment.lastDate}`}
                  aria-label={assignment.name}
                >
                  <AssignmentItem assignment={assignment} mutate={mutate} />
                </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <div>Empty</div>
        )}
      </CardBody>
    </Card>
  );
};

export default Assignment;
