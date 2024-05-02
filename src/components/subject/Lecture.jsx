"use client";
import React from "react";
import { Card, CardBody, Accordion, AccordionItem } from "@nextui-org/react";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
import LectureItem from "./LectureItem";
import { MdOutlinePlayLesson } from "react-icons/md";

const Lecture = ({ take }) => {
  const { data: lectureData, isLoading } = useSWR(
    `/api/v2/takeSubject/${take}/lecture`,
    fetcher
  );
  return (
    <Card fullWidth isBlurred className=" h-full">
      <CardBody>
        {isLoading ? (
          <div>Loading</div>
        ) : (
          <Accordion selectionMode="multiple" variant="splitted">
            {lectureData &&
              lectureData.map((lecture) => (
                <AccordionItem startContent={
                  <MdOutlinePlayLesson  size={40}/>
                } title={lecture.name} key={lecture.id} subtitle={
                  lecture.date.split("T")[0]
                
                }
                aria-label={lecture.name}
                >
                  <LectureItem lecture={lecture} />
                </AccordionItem>
              ))}
          </Accordion>
        )}
      </CardBody>
    </Card>
  );
};

export default Lecture;
