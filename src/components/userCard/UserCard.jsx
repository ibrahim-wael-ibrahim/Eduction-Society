'use client'
import {useState} from "react";
import { User, Button, Card, CardBody, CardFooter, CardHeader ,Link } from "@nextui-org/react";
import { FiUserCheck, FiUserMinus } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
export const UserCard = ({user , follow ,showFollow , api }) => {
  const { mutate } = useSWRConfig()
  const handleFollower = async ()=>{
    try {
      const res = await axios.post(`/api/v2/follower?id=${user.id}`);
      if (res.status === 201) {
        toast.success("Follower created");
      }
      mutate(api)
    } catch (error) {
      toast.error("Error occurred while creating follower");
    }
  }
  const handleUnFollower = async ()=>{
    try {
      const res = await axios.delete(`/api/v2/follower?id=${user.id}`);
      if (res.status === 200) {
        toast.success("Follower deleted");
      }
      mutate(api)

    } catch (error) {
      toast.error("Error occurred while deleting follower");
    }
  }
  return (
    <Card className="max-w-[300px]  border-none" isBlurred>
      <CardHeader className="justify-between">
      <User
          name={user.name}
          description={user.institution ? user.institution.name : user.type}
          avatarProps={{
            src: user.image,
          }}
          as={Link}
          href={`/profile/${user.id}`}
          
        />
        {showFollow ? ( follow ? (
          <Button color="success" variant="shadow" onPress={handleFollower} >
            Follow
            <FiUserCheck />
          </Button>
        ) : (
          <Button color="danger" variant="shadow" onPress={handleUnFollower} >
            UnFollow
            <FiUserMinus />
          </Button>
        )): null}

      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          work {user.type}, in {user.institution && user.institution.name} lover {user.gender === "FEMALE" ? "she/her" : "he/him"}
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">{
           user.following && user.following.length // الانا بتابعهم
          }</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">{
           user.followedBy && user.followedBy.length // اللي بيتابعوني
          }</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};