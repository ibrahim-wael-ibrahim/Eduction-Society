'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import useSWR  from 'swr'
import { fetcher } from '@/utils/function/fetcher'
import { Spinner, Card, CardHeader, CardBody, Accordion, AccordionItem, Avatar, Divider, Button, Tab } from '@nextui-org/react'
import Post from '@/components/post/Post'
import axios from "axios";
import { toast } from "sonner";
import { FiUserCheck, FiUserMinus } from "react-icons/fi";
import { useRouter } from 'next/navigation'
const ProfileCard = ({ user , mutate , session}) => { 
  const handleFollower = async ()=>{
    try {
      const res = await axios.post(`/api/v2/follower?id=${user.data.id}`);
      if (res.status === 201) {
        toast.success("Follower created");
      }
      mutate()
    } catch (error) {
      toast.error("Error occurred while creating follower");
    }
  }
  const handleUnFollower = async ()=>{
    try {
      const res = await axios.delete(`/api/v2/follower?id=${user.data.id}`);
      if (res.status === 200) {
        toast.success("Follower deleted");
      }
      mutate()

    } catch (error) {
      toast.error("Error occurred while deleting follower");
    }
  }
  return(
  <Card className='w-0 sm:w-[400px]   max-h-[91hv] flex flex-col justify-start items-start p-4'>
    <CardHeader className='flex  flex-col  justify-start items-center w-full    '>
      <span className='text-2xl capitalize first-letter:text-green-500 mb-2'>Profile</span>
      <Avatar src={user?.data.image} radius='lg' className="w-full  h-[300px] text-large mb-2" />
      <span className='text-xl capitalize first-letter:text-green-500'>{user?.data.name}</span>
      <div>
        <span className=' lowercase'>{user?.data.gender}, </span>
        <span className=' lowercase'>{Math.floor((new Date() - new Date(user?.data.birth)) / (1000 * 60 * 60 * 24 * 365.25))} Years old</span>
      </div>
      <Divider className='w-full my-4' />
      <div className='flex  justify-center items-center gap-4'>
        <span className=' first-letter:text-green-500'>Following {user?.data.following.length}</span>
        <span className=' first-letter:text-green-500'>FollowBy {user?.data.followedBy.length}</span>
      </div>
      <Divider className='w-full my-4' />
      {
  (user?.data.type === 'PROFESSOR' || user?.data.type === 'TEACHER') && (session && user.data.id != session.user.id) && (
    session && user.data.followedBy.map(f => f.id).includes(session.user.id)
      ? (
        <Button color="danger" variant="shadow" onPress={handleUnFollower}>
          UnFollow
          <FiUserMinus />
        </Button>
      ) : (
        <Button color="success" variant="shadow" onPress={handleFollower}>
          Follow
          <FiUserCheck />
        </Button>
      )
  )
}

    </CardHeader>
    <CardBody className=''>
      <Accordion className=''>
        <AccordionItem title='Personal Information'  >
          <div className='w-full h-full'>
            <div className='flex flex-row justify-between items-center w-full h-10'>
              <span className='text-lg'>Name</span>
              <span className='text-lg'>{user?.data.name}</span>
            </div>

            <div className='flex flex-row justify-between items-center w-full h-10'>
              <span className='text-lg'>Phone</span>
              <span className='text-lg'>{user?.data.phone}</span>
            </div>
            <div className='flex flex-row justify-between items-center w-full h-10'>
              <span className='text-lg'>Address</span>
              <span className='text-lg'>{user?.data.address}</span>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem title='Institution Information' >
          <div className='w-full h-full'>
            <div className='flex flex-row justify-between items-center w-full h-10'>
              <span className='text-lg'>Institution</span>
              <span className='text-lg'>{user?.data.institution?.name}</span>
            </div>
            <div className='flex flex-row justify-between items-center w-full h-10'>
              <span className='text-lg'>Type</span>
              <span className='text-lg'>{user?.data.type}</span>
            </div>
          </div>
        </AccordionItem>

      </Accordion>

    </CardBody>
  </Card>
)}

const Page = ({params}) => {
  const { id } = params;
  const { data: session } = useSession();
  const { data: user, error, isLoading: isLoadingUser , mutate} = useSWR(`/api/v2/user/${id}`, fetcher)
  const router = useRouter()
  if (session && user.data.id === session.user.id)  router.push(`/profile`)
  if (isLoadingUser) return <Spinner color='success' size='lg' />
  if (error) return <div>Error loading data</div>
  if (!user) return <div>No data</div>
  return  (
    <>
      <Card isBlurred className='flex flex-row justify-start items-start w-full min-h-[91vh] gap-4'>
        <ProfileCard user={user}  mutate={mutate} session={session} />
        <Card isBlurred className='w-full flex flex-col justify-start items-center'>

          {
            (user?.data?.type == 'STUDENT' || user?.data?.type == 'ADMIN_REGISTER') ?
             <div className='w-full  flex flex-col justify-start items-center gap-6'>
              <span className=' text-2xl first-letter:text-green-500'>Profile</span>

             </div>
              :
              <div className='w-full  flex flex-col justify-start items-center gap-6'>
                {
                user?.data?.teacher.post?.map((post, index) => (
                    <Post key={index} post={post} mutateApi={`/api/v2/user/${session?.user?.id}`} />
                  ))}
              </div>}
        </Card>
      </Card>
    </>
  )
}

export default Page;
