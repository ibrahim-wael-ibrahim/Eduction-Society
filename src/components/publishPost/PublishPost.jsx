"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  User,
} from "@nextui-org/react";
import ModalContainer from "../UI/ModalContainer";
import PostInsert from "../Modal/postEdit/PostInsert";
import { useSession } from "next-auth/react";
const PublishPost = () => {
  const { ModalUI:PostInsertModal , handleOpen: handlePostEditOpen } = ModalContainer("insertPost");
  const { data: session } = useSession();
  return session && (session.user.type === "ADMIN_SOCIAL" ||session.user.type === "TEACHER" || session.user.type === "PROFESSOR") ? (
    <>

      <PostInsertModal>
        <PostInsert/>
      </PostInsertModal>
      <Card
        className="max-w-[400px] sm:max-w-[900px] w-full my-4"
        isPressable onPress={()=>{handlePostEditOpen()}}
      >
        <CardHeader className="flex flex-col justify-start items-start py-4 gap-2">
          <User
            name={
              session?.user?.name || "User"
            }
            description={
              session?.user?.email || "User@Email.com"
            }
            className="transition-transform"
            avatarProps={{
              src: `${session?.user?.image || ""}`,
            }}
          />
        </CardHeader>
        <CardBody className=" justify-center items-center">
          <Input
            placeholder="What's on your mind? can you share with us?"
            size="lg"
            color="success"
            variant="flat"
            className="text-2xl col-span-10 "
            isDisabled
          />
        </CardBody>
      </Card>
    </>
  ) : null;
};

export default PublishPost;
