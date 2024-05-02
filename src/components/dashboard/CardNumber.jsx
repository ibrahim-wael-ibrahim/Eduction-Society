'use client'
import React, { useEffect , useState } from 'react'
import { Card , CardBody , Divider , Spinner} from '@nextui-org/react'
import axios from 'axios'
import useSWR from 'swr'
const CardNumber = ({api , title , Icon}) => {
  const fetcher = url => axios.get(url).then(res => res.data)
  const {data , error , isLoading} = useSWR(api , fetcher)
  return   (
    <>
      <Card className='w-[200px] h-[100px]' isBlurred isPressable>
        <CardBody className=' flex justify-center items-center'>
          <div className="flex h-20 w-full justify-evenly items-center space-x-4 text-small">
            <div className='FLEX-CENTER gap-2'>
              <span>
                <Icon size={40} />
              </span>
              <span className=' first-letter:text-green-400 capitalize'>
                {title}
              </span>
            </div>
            <Divider orientation="vertical" className='h-full' />
            <div className='FLEX-CENTER gap-2 font-bold text-green-400 text-xl '>
               <span>{
                  isLoading ? <Spinner size='sm' color='success' /> : data
                }</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  ) 
}

export default CardNumber
