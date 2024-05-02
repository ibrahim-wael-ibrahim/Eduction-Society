'use client'
import React from 'react'
import { User, Chip } from '@nextui-org/react';

import { IoIosFemale, IoIosMale } from "react-icons/io";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { IoIosCode } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { BsCalendar2Month } from "react-icons/bs";
import { IoHourglassOutline } from "react-icons/io5";
import { PiClockCounterClockwise } from "react-icons/pi";
import { RxComponentBoolean } from "react-icons/rx";

const RenderCellComponent = () => {
  const RenderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    let color;

    switch (columnKey) {
      case "image":
        return (

          <User
            name={item.name}
            description={item.email}
            avatarProps={{
              src: item.image,
            }}
          />
        );
      case "type":
        switch (item.type) {
          case "STUDENT":
            color = "primary"; // change to desired color for STUDENT
            break;
          case "TEACHER":
            color = "warning"; // change to desired color for TEACHER
            break;
          case "PROFESSOR":
            color = "success"; // change to desired color for PROFESSOR
            break;
          case "ADMIN_REGISTER":
            color = "warning"; // change to desired color for ADMIN_REGISTER
            break;
          case "ADMIN_SOCIAL":
            color = "secondary"; // change to desired color for ADMIN_SOCIAL
            break;
          default:
            color = "default"; // default color if type doesn't match any case
        }
        return <Chip color={color}>{item.type}</Chip>;

      case "gender":
        switch (item.gender) {
          case "FEMALE":
            color = "secondary"; // change to desired color for ADMIN_REGISTER
            break;
          case "MALE":
            color = "primary"; // change to desired color for ADMIN_SOCIAL
            break;
        }
        return <Chip color={color}>{item.gender == 'MALE' ? <IoIosMale /> : <IoIosFemale />}</Chip>;
      case "code":
        return <Chip startContent={<IoIosCode />} className='px-3' color={"success"}>{item.code}</Chip>;
      case "year.name":
        if (item["year"] && item["year"]["name"]) {
          return <Chip color={"success"} startContent={<CiCalendar />} className='px-3'>{item["year"]["name"]}</Chip>;
        } else {
          return <Chip color={"default"}>N/A</Chip>; // default case when name is not available
        }
      case "department.name":
        if (item["department"] && item["department"]["name"]) {
          return <Chip color={"warning"} startContent={<MdOutlineLocalFireDepartment />} className='px-3'>{item["department"]["name"]}</Chip>;
        } else {
          return <Chip color={"default"}>N/A</Chip>; // default case when name is not available
        }

      case "semester.name":
        if (item["semester"] && item["semester"]["name"]) {
          return <Chip color={"success"} startContent={<BsCalendar2Month />} className='px-3'>{item["semester"]["name"]}</Chip>;
        } else {
          return <Chip color={"default"}>N/A</Chip>; // default case when name is not available
        }

      case "subject.name":
        if (item["subject"] && item["subject"]["name"]) {
          return <Chip color={"primary"} startContent={<IoIosCode />} className='px-3'>{item["subject"]["name"]}</Chip>;
        } else {
          return <Chip color={"default"}>N/A</Chip>; // default case when name is not available
        }

      case "hour.price":
        if (item["hour"] && item["hour"]["price"]) {
          return <Chip color={"success"} startContent={<FaMoneyBill1Wave />} className='px-3'>{item["hour"]["price"]}</Chip>;
        } else {
          return <Chip color={"default"}>N/A</Chip>; // default case when price is not available
        }
      case "hourCount":
          return <Chip color="secondary" startContent={<PiClockCounterClockwise />} className='px-4 w-full'>{item["hourCount"]}</Chip>;
        

      case "optional":
        return <Chip className='px-3' startContent={<RxComponentBoolean  />} color={item.optional ? "success" : "danger"}></Chip>;
      
        case "price":
        return <Chip className='px-3' startContent={<FaMoneyBill1Wave />} color={"success"}>{item.price}</Chip>;

      case "hours":
        return <Chip className='px-3' startContent={<IoHourglassOutline />} color={"warning"}>{item.hours}</Chip>;

      default:
        return cellValue;
    }
  }, []);
  return {
    RenderCell
  }
}

export default RenderCellComponent