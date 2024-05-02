'use client'
import {useEffect} from 'react'
import { useSession } from 'next-auth/react'
import StudentContainer from '@/components/dashboard/StudentContainer'
import TeacherContainer from '@/components/dashboard/TeacherContainer'
const page = () => {
  const { data: session } = useSession()
  useEffect(() => {
    console.log(session)
  }, [session])

  return (

    <div className='w-full h-full   flex-wrap  gap-6  p-10'>
      <StudentContainer/>
      <TeacherContainer/>
    </div>
  )
}

export default page