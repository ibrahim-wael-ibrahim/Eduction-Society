import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from "embla-carousel-react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  User,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Link,
  Snippet,
} from "@nextui-org/react";
import ModalContainer from "../UI/ModalContainer";
import { useSWRConfig } from "swr";

import axios from "axios";
import Content from "../readMoreContent/Content";
import { UserCard } from "../userCard/UserCard";
import { useSession } from "next-auth/react";

import { IoIosClose } from "react-icons/io";
import { CiHeart, CiBookmark, CiShare2 } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

import { PiChatCircleThin } from "react-icons/pi";
import { toast } from "sonner";
import { FaBookmark } from "react-icons/fa";

const Post = ({ post, mutateApi }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  // __________________________________________

  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const updateScrollSnapState = useCallback((emblaApi) => {
    setSnapCount(emblaApi.scrollSnapList().length)
    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    updateScrollSnapState(emblaApi)
    emblaApi.on('select', updateScrollSnapState)
    emblaApi.on('reInit', updateScrollSnapState)
  }, [emblaApi, updateScrollSnapState])


  const { ModalUI: ShareModal, handleOpen: handleShareOpen } =
    ModalContainer("SharePost");

  const { data: session } = useSession();

  const { mutate } = useSWRConfig();

  const handleReaction = async () => {
    try {
      if (session) {
        await axios.post(`/api/v1/post/${post.id}/react`);
        mutate(mutateApi);
      } else {
        toast.error("You need to be logged in to react");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeleteReaction = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}/react`);
      mutate(mutateApi);
    } catch (error) {
      toast.error("Error");
    }
  };
  const handleSavePost = async () => {
    try {
      if (session) {
        await axios.post(`/api/v1/post/${post.id}/save`);
        mutate(mutateApi);
      } else {
        toast.error("You need to be logged in to save");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeleteSavePost = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}/save`);
      mutate(mutateApi);
    } catch (error) {
      toast.error("Error");
    }
  };
  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}`);
      mutate(mutateApi);
    } catch (error) {
      toast.error("Error");
    }
  };

  let dateObj = new Date(post.date);

  let date = dateObj.toISOString().split("T")[0]; // Extracts the date
  let hour = dateObj.getUTCHours(); // Extracts the hour

  return (
    <>
      <ShareModal>
        <div className="min-h-[150px]  FLEX-CENTER gap-8">
          <span className="text-xl first-letter:text-green-500">
            Share Post
          </span>
          <Snippet
            color="success"
            variant="shadow"
            codeString={`http://localhost:3000/post/${post.id}`}
          >{`/post/${post.id}`}</Snippet>
        </div>
      </ShareModal>
      <Card
        className=" min-h-[150px] w-[400px]  sm:w-[600px]  FLEX-CENTER"
        isFooterBlurred
      >
        <CardHeader className="flex flex-row justify-between items-center">
          {post.institution ? (
            <>
              <User
                name={post.institution.name}
                description={`${date} - ${
                  hour + 2 > 12 ? hour + 2 - 12 : hour + 2
                }:00${hour + 2 > 12 ? " PM" : " AM"}`}
                avatarProps={{
                  src: post.institution.image,
                }}
              />

              {session &&
              ((session.user.type === "ADMIN_SOCIAL" &&
                post.institution &&
                post.institution.id === session.user.institution) ||
                (post.teacher && post.teacher.id === session.user.teacher)) ? (
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  className="rounded-full p-0 m-0"
                  onPress={handleDeletePost}
                >
                  <IoIosClose size={26} />
                </Button>
              ) : null}
            </>
          ) : (
            <>
              {" "}
              <Popover showArrow placement="bottom" backdrop="blur">
                <PopoverTrigger>
                  <User
                    name={post.teacher.user.name}
                    description={`${date} - ${
                      hour + 2 > 12 ? hour + 2 - 12 : hour + 2
                    }:00${hour + 2 > 12 ? " PM" : " AM"}`}
                    avatarProps={{
                      src: post.teacher.user.image,
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  <UserCard
                    user={post.teacher.user}
                    showFollow={
                      session && post.teacher.user.id === session.user.id
                        ? false
                        : true
                    }
                    follow={
                      session &&
                      post.teacher.user.followedBy
                        .map((f) => f.id)
                        .includes(session.user.id)
                        ? false
                        : true
                    }
                    api={mutateApi}
                  />
                </PopoverContent>
              </Popover>
              {session &&
              ((session.user.type === "ADMIN_SOCIAL" &&
                post.institution &&
                post.institution.id === session.user.institution) ||
                (post.teacher && post.teacher.id === session.user.teacher)) ? (
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  className="rounded-full p-0 m-0"
                  onPress={handleDeletePost}
                >
                  <IoIosClose size={26} />
                </Button>
              ) : null}
            </>
          )}
        </CardHeader>
        <CardBody className="w-full min-h-[50px] flex justify-start  gap-6 ">
          <Content content={post.content}/>
          <div className="embla  max-h-[450px]" ref={emblaRef}>
            <div className="embla__container">
              {post.file.map((file, index) => (
                <div
                  key={index}
                  className="embla__slide relative flex flex-col justify-start items-center p-4"
                >
                  {file.type === "Photo" && (
                    <Image
                      src={file.path}
                      className="object-center rounded-large   object-cover max-h-[300px]"
                    />
                  )}
                  {file.type === "Video" && (
                    <video
                      className="object-center rounded-large   object-cover max-h-[300px]"
                      controls
                      poster=""
                    >
                      <source src={file.path} type="video/mp4" />
                    </video>
                  )}
                  {file.type === "Docs" && (
                    <Card
                      isBlurred
                      className="object-center rounded-large w-full h-full object-fit FLEX-CENTER gap-10 my-10 py-10 bg-green-500/10"
                    >
                      <span className=" select-none">This Documents</span>
                      <Image src="/docs.svg" width={100} />
                      <Link href={file.path} download>
                        <Button color="success" variant="light">
                          {file.name} Download
                        </Button>
                      </Link>
                    </Card>
                  )}
                </div>
              ))}
            </div>
            {
              snapCount > 1 && (
          <div className='px-6'>{`Count ${selectedSnap+1} / ${snapCount}`}</div>

              )
            }
          </div>
        </CardBody>
        <CardFooter className=" flex  justify-between items-center bg-green-700/10  dark:bg-green-500/50  overflow-hidden py-2  rounded-large  w-[calc(100%_-_50px)] shadow-small  h-[60px] mx-auto my-2 mb-6 bottom-4 right-0 left-0 z-10">
          <div className="flex justify-center items-center gap-4">
            <Button
              color={
                session &&
                post.reaction.map((r) => r.userId).includes(session.user.id)
                  ? "danger"
                  : "default"
              }
              variant="light"
              className="rounded-full p-0 m-0"
              onPress={
                session &&
                post.reaction.map((r) => r.userId).includes(session.user.id)
                  ? handleDeleteReaction
                  : handleReaction
              }
            >
              {session &&
              post.reaction.map((r) => r.userId).includes(session.user.id) ? (
                <FaHeart size={26} />
              ) : (
                <CiHeart size={26} />
              )}
              {post.reaction.length}
            </Button>
            <Button
              color={
                session &&
                post.comment.map((r) => r.userId).includes(session.user.id)
                  ? "danger"
                  : "default"
              }
              variant="light"
              className="rounded-full p-0 m-0"
              as={Link}
              href={`/post/${post.id}`}
            >
              <PiChatCircleThin size={26} /> {post.comment.length}
            </Button>
            <Button
              color="default"
              variant="light"
              isIconOnly
              className="rounded-full p-0 m-0"
              onPress={handleShareOpen}
            >
              <CiShare2 size={26} />
            </Button>
          </div>
          <Button
            color={
              session &&
              post.userSave.map((r) => r.userId).includes(session.user.id)
                ? "danger"
                : "default"
            }
            variant="light"
            className="rounded-full p-0 m-0"
            onPress={
              session &&
              post.userSave.map((r) => r.userId).includes(session.user.id)
                ? handleDeleteSavePost
                : handleSavePost
            }
          >
            {session &&
            post.userSave.map((r) => r.userId).includes(session.user.id) ? (
              <FaBookmark size={26} />
            ) : (
              <CiBookmark size={26} />
            )}
            {post.userSave.length}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Post;
