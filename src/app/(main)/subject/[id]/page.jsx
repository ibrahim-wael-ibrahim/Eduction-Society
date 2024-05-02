'use client'
import React from 'react'
import ListSubject from '@/components/subject/ListSubject'
import {Tabs, Tab, } from "@nextui-org/react";
import Lecture from '@/components/subject/Lecture';
import Assignment from '@/components/subject/Assignment';
import Manage from '@/components/subject/Manage';
import { useSession } from 'next-auth/react';
const page = ({params :{id}}) => {
    const { data: session } = useSession();
  return (
    <section className='flex  justify-start items-start  container gap-4'>
    <ListSubject />
    <div className=' w-full flex flex-col justify-start items-center '>
    <Tabs  aria-label="Options" color='success'  className='w-full  flex flex-col justify-start items-center'>
        
{
    session && session.user.type === "PROFESSOR"   ? (
        <Tab key="Manage" title="Manage" className='w-full'>
            <Manage take={id}/>
        </Tab>
    ) : null
}
        <Tab key="lecture" title="Lecture" className='w-full'>
            <Lecture take={id} />
        </Tab>
        <Tab key="assignment" title="Assignment" className='w-full'>
            <Assignment take={id} />
        </Tab>
      </Tabs>
    </div>
  </section>
  )
}

export default page