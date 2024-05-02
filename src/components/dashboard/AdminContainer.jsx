"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import { IoPersonAddOutline } from "react-icons/io5";
import ModalContainer from '../UI/ModalContainer';
import CreateAdminModel from './itemModal/CreateAdminModel';
const AdminContainer = () => {
  const { ModalUI: CreateAdminModal, handleOpen: handleCreateAdmin } = ModalContainer("CreateAdmin");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <CreateAdminModal title={"Create Admin"}>
        <CreateAdminModel />
      </CreateAdminModal>
      <Card className=' h-[300px] aspect-square FLEX-CENTER' isBlurred>
        {loading ? <Spinner color='success' size='lg' label='Loading...' /> : <CardBody className='flex flex-row justify-evenly items-center gap-4 p-4'>
          <Card className='w-full aspect-square FLEX-CENTER gap-8' isBlurred isPressable onPress={handleCreateAdmin}>
            <IoPersonAddOutline size={100} />
            <span className='capitalize first-letter:text-green-500 text-center'>
              create admin
            </span>
          </Card>
        </CardBody>}
      </Card>
    </>
  )
}

export default AdminContainer