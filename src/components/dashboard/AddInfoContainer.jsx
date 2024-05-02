'use client'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardBody, Spinner} from '@nextui-org/react'
import AddInfoItem from './AddInfoItem';
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { MdOutlineSubject } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { IoCalendarClearOutline } from "react-icons/io5";
import { BsCalendar2Month } from "react-icons/bs";
import { PiNewspaperThin } from "react-icons/pi";

import ItemDepartment from './itemModal/ItemDepartment';
import ItemSubject from './itemModal/ItemSubject';
import ItemYear from './itemModal/ItemYear';
import ItemSemester from './itemModal/ItemSemester';
import ItemHour from './itemModal/ItemHour';
import ItemTake from './itemModal/ItemTake';
import ItemTeacherWithSubject from './itemModal/ItemTeacherWithSubject';
import Logo from '../icons/logo';
const AddInfoContainer = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const Item = [
    {
      title: 'Department',
      Icon: MdOutlineLocalFireDepartment,
      id: 'Department',
      Wrap: ItemDepartment ,
    },
    {
      title: 'Subject',
      Icon: MdOutlineSubject,
      id: 'Subject',
      Wrap: ItemSubject,
    },
    {
      title: 'Year',
      Icon: IoCalendarClearOutline,
      id: 'Year',
      Wrap: ItemYear,
    },
    {
      title: 'Semester',
      Icon: BsCalendar2Month,
      id: 'Semester',
      Wrap: ItemSemester,
    },
    {
      title: 'Hours',
      Icon: CiTimer,
      id: 'Hours',
      Wrap: ItemHour,
    },
    {
      title: 'Take',
      Icon: PiNewspaperThin,
      id: 'Take',
      Wrap: ItemTake,
    },
    {
      title: 'Teacher Take',
      Icon: FaChalkboardTeacher,
      id: 'TeacherWithSubject',
      Wrap: ItemTeacherWithSubject,
    },
  ];
  return (
    <>
      <Card className='h-[300px]  w-[400px] FLEX-CENTER ' isBlurred>
       {loading ? <Spinner color='success' size='lg'  label='Loading...'/> : <CardBody className='grid grid-cols-8  grid-rows-3  justify-center items-center gap-4 w-full h-full'>
          <div className='col-span-3 w-full h-full'>
            <AddInfoItem {...Item[0]} />
          </div>
          <div className='col-span-2 w-full h-full'>
            <AddInfoItem {...Item[1]} />
          </div>
          <div className='col-span-3 w-full h-full'>
            <AddInfoItem {...Item[2]} />
          </div>
          <div className='col-span-5 w-full h-full'>
            <AddInfoItem {...Item[3]} />
          </div>
          <div className='col-span-3 w-full h-full'>
            <AddInfoItem {...Item[4]} />
          </div>
          <div className='col-span-3 w-full h-full'>
            <AddInfoItem {...Item[5]} />
          </div>
          <div className='col-span-5 w-full h-full'>
            {/* <Card className='w-full h-full  FLEX-CENTER' isBlurred isPressable>
                <Logo size={32}/>
            </Card> */}
            <AddInfoItem {...Item[6]} />

          </div>
        </CardBody>}
      </Card>
    </>
  )
}

export default AddInfoContainer