"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
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
  Progress,
  Textarea,
  Divider,
  Snippet,
} from "@nextui-org/react";
import ModalContainer from "@/components/UI/ModalContainer";
import Content from "@/components/readMoreContent/Content";
import { UserCard } from "@/components/userCard/UserCard";
import { IoIosClose } from "react-icons/io";

import { CiHeart, CiBookmark, CiShare2 } from "react-icons/ci";
import { BsSend } from "react-icons/bs";

import { PiChatCircleThin } from "react-icons/pi";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
const page = ({ params }) => {
  const { ModalUI: ShareModal, handleOpen: handleShareOpen } =
    ModalContainer("SharePost");
  const { id } = params;
  const {
    data: post,
    error,
    isLoading,
    mutate,
  } = useSWR(id ? `/api/v1/post/${id}` : null, fetcher);

  const { data: session } = useSession();
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  // __________________________________________

  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const updateScrollSnapState = useCallback((emblaApi) => {
    setSnapCount(emblaApi.scrollSnapList().length);
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollSnapState(emblaApi);
    emblaApi.on("select", updateScrollSnapState);
    emblaApi.on("reInit", updateScrollSnapState);
  }, [emblaApi, updateScrollSnapState]);

  // ________________________________

  useEffect(() => {}, [post]);

  const [comment, setComment] = useState("");

  // For example, you can show a loading state while the data is being fetched:
  if (isLoading) return <div>Loading...</div>;

  // You can show an error message if there was an error fetching the data:
  if (error) return <div>An error occurred: {error.message}</div>;

  const handleReaction = async () => {
    try {
      if (session) {
        await axios.post(`/api/v1/post/${post.id}/react`);
        mutate();
      } else {
        toast.error("You must be logged in to react");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeleteReaction = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}/react`);
      mutate();
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleComment = async () => {
    try {
      if (session) {
        if (comment === "") throw new Error("");
        await axios.post(`/api/v1/post/${post.id}/comment`, {
          content: comment,
        });
        mutate();
        setComment("");
        toast.success("Comment");
      } else {
        toast.error("You must be logged in to comment");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`/api/v1/post/${post.id}/comment/${id}`);
      mutate();
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleSavePost = async () => {
    try {
      if (session) {
        await axios.post(`/api/v1/post/${post.id}/save`);
        mutate();
      } else {
        toast.error("You must be logged in to save");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeleteSavePost = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}/save`);
      mutate();
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/v1/post/${post.id}`);

      mutate();
      router.push("/");
    } catch (error) {
      toast.error("Error");
    }
  };

  let dateObj;
  let date;
  let hour;

  dateObj = new Date(post.date);

  date = dateObj.toISOString().split("T")[0]; // Extracts the date
  hour = dateObj.getUTCHours(); // Extracts the hour

  return (
    <div className="w-full min-h-full  flex flex-col flex-wrap justify-center items-center gap-6  p-10 ">
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
      <Card className="  w-[400px]  sm:w-[600px]  FLEX-CENTER" isFooterBlurred>
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
                    follow={true}
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
        <CardBody className="w-full h-full flex justify-start  gap-6 ">
          <Content content={post.content} />
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {post.file.map((file, index) => (
                <div
                  key={index}
                  className="embla__slide relative flex flex-col justify-start items-center p-4"
                >
                  {file.type === "Photo" && (
                    <Image
                      src={file.path}
                      className="object-center rounded-large w-full h-full object-fill"
                    />
                  )}
                  {file.type === "Video" && (
                    <video
                      className="object-center rounded-large w-full h-full object-fill"
                      controls
                      preload="none"
                      poster="/video.svg"
                    >
                      <source src={file.path} type="video/mp4" />
                    </video>
                  )}
                  {file.type === "Docs" && (
                    <Card
                      isBlurred
                      className="object-center rounded-large w-full h-full object-fill FLEX-CENTER gap-10 my-10 py-10 bg-green-500/10"
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

          </div>
          {snapCount > 1 && (
              <div className="px-6">{`Count ${
                selectedSnap + 1
              } / ${snapCount}`}</div>
            )}
        </CardBody>
        <CardFooter className="flex  justify-between items-center bg-green-500/10   overflow-hidden py-2  rounded-large  w-[calc(100%_-_50px)] shadow-small h-[100px]  mx-auto my-2 bottom-4 right-0 left-0 z-10">
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
              )}{" "}
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
      <Card className="w-[400px]  sm:w-[600px]  FLEX-CENTER">
        <CardHeader className="FLEX-CENTER gap-6">
          <Textarea
            label="Comment"
            variant="underline"
            onValueChange={(value) => {
              if (value.length <= 191) {
                setComment(value);
              }
            }}
            value={comment}
          />
          <Progress
            aria-label="comment"
            size="sm"
            value={comment.length}
            maxValue={191}
            showValueLabel
            color={
              comment.length >= 191
                ? "danger"
                : comment.length > 100
                ? "warning"
                : "success"
            }
            className="w-full"
          />
          <Button
            color="success"
            variant="light"
            size="lg"
            onPress={() => {
              handleComment();
            }}
          >
            <BsSend size={26} />
            Send
          </Button>
          <Divider />
        </CardHeader>
        <CardBody className="flex flex-col justify-start items-start gap-4">
          {post.comment.map((comment, index) => (
            <Card key={index} className="w-full h-full FLEX-CENTER">
              <CardHeader className="flex justify-between items-center w-full">
                <User
                  name={comment.user.name}
                  description={comment.date}
                  avatarProps={{
                    src: comment.user.image,
                  }}
                />
                {session &&
                ((session.user.type === "ADMIN_SOCIAL" &&
                  post.institution &&
                  post.institution.id === session.user.institution) ||
                  (post.teacher && post.teacher.id === session.user.teacher) ||
                  comment.user.id === session.user.id) ? (
                  <Button
                    color="danger"
                    variant="light"
                    isIconOnly
                    className="rounded-full p-0 m-0"
                    onPress={() => {
                      handleDeleteComment(comment.id);
                    }}
                  >
                    <IoIosClose size={26} />
                  </Button>
                ) : null}
              </CardHeader>
              <CardBody className=" flex flex-row justify-start items-center">
                <div className="pl-6 w-full h-full">{comment.content}</div>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default page;
