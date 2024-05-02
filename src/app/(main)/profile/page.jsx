'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { fetcher } from '@/utils/function/fetcher'
import { Spinner, Card, CardHeader, CardBody, Accordion, AccordionItem, Avatar, Divider, Tabs, Tab } from '@nextui-org/react'
import PublishPost from '@/components/publishPost/PublishPost'
import Post from '@/components/post/Post'
import { UserCard } from '@/components/userCard/UserCard'
const ProfileCard = ({ user }) => (
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
)

const Page = () => {
  const { data: session } = useSession();
  const { data: user, error, isLoading: isLoadingUser } = useSWR(() => session?.user?.id ? `/api/v2/user/${session?.user?.id}` : null, fetcher)

  if (isLoadingUser) return <Spinner color='success' size='lg' />
  if (error) return <div>Error loading data</div>

  return (
    <>
      <div  className='flex flex-row justify-start items-start w-full min-h-[91vh] gap-4'>
        <ProfileCard user={user} />
        <div  className='w-full flex flex-col justify-start items-center gap-6'>

          {
            (user?.data?.type == 'STUDENT' || user?.data?.type == 'ADMIN_REGISTER' || user?.data?.type == 'ADMIN_SOCIAL') ?
             <div className='w-full  flex flex-col justify-start items-center gap-6'>
              <span className=' text-2xl first-letter:text-green-500'>Save Post</span>
                          {
                  user?.data?.postSave?.map((post, index) => (
                      <Post key={index} post={post.post} mutateApi={`/api/v2/user/${session?.user?.id}`} />
   
                  ))
                }
             </div>
              :
              <Tabs  aria-label="Options" color='success' variant='underlined' className='w-full  flex flex-col justify-start items-center'  >
            <Tab key="post" title="Post" className='flex flex-col justify-start items-center gap-6' >
                <PublishPost />
          {
                  user?.data?.teacher.post?.map((post, index) => (
                    <Post key={index} post={post} mutateApi={`/api/v2/user/${session?.user?.id}`} />
                  ))
                }
            </Tab>

            <Tab key="savePost" title="Save Post" className='flex flex-col justify-start items-center gap-6'>
            {
                  user?.data?.postSave?.map((post, index) => (
                      <Post key={index} post={post.post} mutateApi={`/api/v2/user/${session?.user?.id}`} />
   
                  ))
                }
            </Tab>
            <Tab key="follower" title="follower" className='flex flex-col justify-start items-center gap-6'>
                {
                  user?.data?.followedBy?.map((follower, index) => (
                    <UserCard key={index} user={follower} />
                  ))
                }
            </Tab>
            <Tab key="following" title="following" className='flex flex-col justify-start items-center gap-6'>
                {
                  user?.data?.following?.map((follower, index) => (
                    <UserCard key={index} user={follower} />
                  ))
                }
            </Tab>
          </Tabs>
          }
        </div>
      </div>
    </>
  )
}

export default Page;
