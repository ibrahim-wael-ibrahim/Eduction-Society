"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import { FaChalkboardTeacher } from "react-icons/fa";


import ModalContainer from '../UI/ModalContainer';
import ItemTeacher from './itemModal/ItemTeacher';
const TeacherContainer = () => {
  const { ModalUI: CreateTeacherModal, handleOpen: handleCreateTeacher } = ModalContainer("CreateStudent");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <CreateTeacherModal title={"Create Teacher"}>
        <ItemTeacher />
      </CreateTeacherModal>
      <Card className=' h-[300px] aspect-square FLEX-CENTER' isBlurred>
        {loading ? <Spinner color='success' size='lg' label='Loading...' /> : <CardBody className='flex flex-row justify-evenly items-center gap-4 p-4'>
          <Card className='w-full aspect-square FLEX-CENTER gap-8' isBlurred isPressable onPress={handleCreateTeacher}>
            <FaChalkboardTeacher size={100} />
            <span className='capitalize first-letter:text-green-500 text-center'>
              create Teacher
            </span>
          </Card>
        </CardBody>}
      </Card>
    </>
  )
}

export default TeacherContainer