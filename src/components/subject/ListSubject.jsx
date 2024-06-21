"use client";
import React from "react";
import SidebarItem from "../sidebar/Sidebar-item";
import { IoBookOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";

const ListSubject = () => {
  const pathname = usePathname();
  const { data: subject, isLoading } = useSWR(`/api/v2/takeSubject`, fetcher);
  return (
    <aside className=" w-[300px] h-full flex flex-col  justify-start  items-center gap-4 p-2">
      <h1 className=" first-letter:text-green-500 text-xl">Subject List</h1>
      {isLoading && <div>Loading...</div>}
      {subject &&
        subject.map((item) => (
          <SidebarItem
            key={item.takeId}
            icon={<IoBookOutline />}
            title={item.take.subject.name}
            href={`/subject/${item.takeId}`}
            isActive={pathname === `/subject/${item.takeId}`}
          />
        ))}
    </aside>
  );
};

export default ListSubject;
