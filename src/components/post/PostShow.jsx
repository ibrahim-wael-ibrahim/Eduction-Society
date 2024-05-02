import React,{useEffect} from 'react'
import { fetcher } from '@/utils/function/fetcher'
import useSWR from 'swr'
import Post from './Post'
const PostShow = () => {
  const { data , error } = useSWR('/api/v1/post', fetcher)
  return (
    <section className="FLEX-CENTER gap-4">
      {data && data.data.map((post) => (
        <Post key={post.id} post={post} mutateApi={'/api/v1/post'}/>
      ))}
  </section>
  )
}

export default PostShow