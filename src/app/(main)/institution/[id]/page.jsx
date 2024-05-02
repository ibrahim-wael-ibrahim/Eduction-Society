"use client"
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/function/fetcher'
import { Spinner, Avatar} from '@nextui-org/react'
import Post from '@/components/post/Post'

const page = ({params}) => {
    const {id} = params
    const { data: institution , isLoading } = useSWR(`/api/v2/institution?id=${id}`, fetcher)    

    return isLoading?  <Spinner label='Loading...' size='lg' color='success'/>: (
    <div className='w-full h-full flex flex-col justify-start items-center gap-4'>
        <div className=' relative flex flex-wrap justify-start items-center p-4 w-full min-h-[150px]'>

            <div  className=' absolute -bottom-28  right-0 left-0 m-auto FLEX-CENTER gap-4 z-10'>
                <Avatar src={institution?.image}  className="w-40 h-40 text-large mb-2" />
                <span className='text-2xl first-letter:text-green-500 capitalize'>
                    {institution?.name}
                </span>
            </div>
        </div>
        <div className='w-full h-full flex justify-start relative top-40'>
        <div className='flex flex-col justify-start  gap-6  h-full'>
                <span className='text-2xl first-letter:text-green-500   capitalize'> {`country ${institution?.country}`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`state ${institution?.state}`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`city ${institution?.city}`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`department ${institution?.department.length }`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`Doctor ${
                    institution?.user.filter((user)=> user.type === 'PROFESSOR').length
                }`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`Teacher ${
                    institution?.user.filter((user)=> user.type === 'TEACHER').length
                }`}</span>
                <span className='text-2xl first-letter:text-green-500 capitalize'> {`Student ${
                    institution?.user.filter((user)=> user.type === 'STUDENT').length
                }`}</span>
            </div>
            <div className='w-full h-full  flex flex-col justify-start items-center gap-6'>
              <span className=' text-2xl first-letter:text-green-500'> Post</span>
                <div className='FLEX-CENTER gap-6'>
                {
                  institution.post?.map((post, index) => (
                      <Post key={index} post={post} mutateApi={'/api/v2/institution'} />
                  ))
                }
                </div>
             </div>
        </div>
    </div>
  )
}

export default page