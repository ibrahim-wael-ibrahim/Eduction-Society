'use client'
import React from "react";
import PostShow from "@/components/post/PostShow";
import PublishPost from "@/components/publishPost/PublishPost";
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {session ? <PublishPost /> : null}
      <PostShow />
    </>
  );
}
