"use client";
import { useState , useEffect,useContext} from "react";
import CompanyItem from "./Company-item";
import SidebarMenu from "./Sidebar-menu";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Context } from "@/provider/Context";
const Sidebar = () => {
  const {collops ,setCollops} = useContext(Context)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollops(true);
    }
  }, []);

  return (
    <>
      <div className=" absolute  z-[100000]">
        <Card
        isBlurred
          className={`${
            collops ? "w-0" : "w-72"
          }  flex flex-col justify-start items-center  border-none h-screen   transition-all  duration-1000 ease-in-out `}
        >
          <CardHeader>
            <CompanyItem />
          </CardHeader>
          <CardBody>
            <SidebarMenu />
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
        <Button
          isIconOnly
          color="default"
          variant="light"
          aria-label="collops sidebar"
          className={`absolute  top-2/4  rounded-full ${
            collops ? "-right-10" : "-right-5"
          }`}
          onClick={() => setCollops(!collops)}
        >
          {collops ? (
            <IoIosArrowForward size={30} />
          ) : (
            <IoIosArrowBack size={30} />
          )}
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
