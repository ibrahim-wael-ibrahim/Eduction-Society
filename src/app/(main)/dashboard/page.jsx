"use client"
import React from 'react'
import CountCardContainer from '@/components/dashboard/CountCardContainer'
import AddInfoContainer from '@/components/dashboard/AddInfoContainer'
import AdminContainer from '@/components/dashboard/AdminContainer'
import CardTable from '@/components/dashboard/CardTable'
import StudentContainer from '@/components/dashboard/StudentContainer'
import TeacherContainer from '@/components/dashboard/TeacherContainer'
import { useSession } from 'next-auth/react'
const page = () => {
  const { data: session } = useSession()
  if(!session) return <div>loading...</div>
  return (
    <div className='FLEX-CENTER gap-10 relative  container'>
      <CountCardContainer/>
      <div className='flex justify-center items-center flex-wrap gap-10 w-full'>
{
  (session.user.type === "ADMIN_INSTITUTION")?(<>
    <AdminContainer/>
    <AddInfoContainer/></>
  ): (session.user.type === "ADMIN_REGISTER")?(
    <>
      <TeacherContainer/>
      <StudentContainer/>
    </>
  ): null
}
      </div>
      <CardTable/>
 </div>
  )
}

export default page
