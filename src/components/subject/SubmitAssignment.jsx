import React from "react";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  User,
  Link,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import { RxDownload } from "react-icons/rx";


const SubmitAssignment = ({ submit, mutate, assignment, access = false }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const StatusAction = async (status) => {
    setLoading(true);
      try {
        await axios.patch(`/api/v2/assignment/${assignment}/submtionAssignment/${submit.id}`, status);
        toast.success("Successfully Created submit");
        mutate();
      } catch (error) {
        toast.error("Error Creating submit");
      } finally {
        setLoading(false);
      }
  }
  const DeleteAction = async () => {
    setLoading(true);
      try {
        await axios.delete(`/api/v2/assignment/${assignment}/submtionAssignment/${submit.id}`);
        toast.success("Successfully Deleted submit");
        mutate();
      } catch (error) {
        toast.error("Error Deleting submit");
      } finally {
        setLoading(false);
      }
  }
  return (
    <Card fullWidth isBlurred className="p-4" >
      <CardHeader className="flex flex-row justify-between items-start gap-4 relative">
        <User
          name={submit.student.user.name}
          description={submit.date.split("T")[0]}
          avatarProps={{
            src: submit.student.user.image,
          }}
        />

        {session && (
          <div className="flex justify-center items-center gap-8">
            <span className={`text-white p-2 rounded-lg ${submit.status === "ACCEPTED" ? "bg-success" :submit.status === "REJECTED" ? "bg-danger" : "bg-warning"}`} 
            >
              {`Status : ${submit.status}`}
            </span>
            { access && submit.status === "PENDING" &&(
              <Button
              variant="flat"
              color="danger"
              onPress={() => {
                DeleteAction();
              }}
              className="rounded-full"
              isIconOnly
            >
              <IoIosClose size={24} />
            </Button>
            )

              
            }
          </div>
        )}
      </CardHeader>
      <cardBody>
        <Divider />
        {submit.file && (
            <div>
              {" "}
              {submit.file.map((file, index) => {
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
      </cardBody>

      <CardFooter>
        {session &&
        (session.user.type === "PROFESSOR" ||
          session.user.type === "TEACHER") ? (
          <div className="flex justify-center items-center gap-5 w-full">
            <Button
              isLoading={loading}
              variant="flat"
              color="danger"
              className="  flex justify-center items-center   px-10 py-4"
              size="lg"
              onPress={()=>{StatusAction({status:"REJECTED"})}}
            >
              REJECTED
            </Button>
            <Button
              isLoading={loading}
              variant="flat"
              color="success"
              className="  flex justify-center items-center   px-10 py-4"
              size="lg"
              onPress={()=>{StatusAction({status:"ACCEPTED"})}}
            >
              ACCEPTED
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubmitAssignment;
