'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Image, Button, Spinner } from '@nextui-org/react'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import { toast } from 'sonner';
import axios from 'axios'

const ChangeImage = () => {
    const { data: session, status, update } = useSession()
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(false)
    }, [loading])
    useEffect(() => {
        const uploadImage = async () => {
            setLoading(true)
            try {
                const formData = new FormData()
                formData.append('file', image)
                const { data } = await axios.patch(`/api/v1/institution/${session.user.institution}/user/${session?.user?.id}/image`, formData)
                await update({
                    user :{
                        ...session.user,
                        image: data.path,
                    }
                  })
                toast.success('Image uploaded successfully')
            } catch (err) {
                console.log(err)
                toast.error('you can only upload images')
            } finally {
                setLoading(false)
            }
        }

        if (image) {
            uploadImage()
        }
    }, [image])

    const handleImage = async (e) => {
        setImage(e.target.files[0])
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await axios.delete(`/api/v1/institution/${session.user.institution}/user/${session?.user?.id}/image`)
            await update({
                user :{
                    ...session.user,
                    image: null,
                }
            })
            toast.success('Image deleted successfully')
        } catch (err) {
            toast.error('An error occurred while deleting the image')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='relative'>
            {session?.user.image && 
                <Button color='danger' onClick={handleDelete} variant='flat' className="absolute -top-1 !z-[1000] right-0 rounded-full p-0 FLEX-CENTER" isIconOnly>
                    <IoIosCloseCircleOutline />
                </Button> 
            }
            <div className="min-w-[150px] min-h-[150px] max-w-[150px] max-h-[150px] relative aspect-square rounded-full FLEX-CENTER overflow-hidden">
                <input type='file' onChange={handleImage} className='hidden' name='files' id='files' />
                {loading ? 
                    <Spinner color='success' size='lg' /> :
                    session?.user.image ?
                        <Image src={session?.user.image} alt='image' className='w-full h-full  aspect-square object-cover object-center' /> :
                        <Button htmlFor='files' as='label' color='success' variant='flat' className="w-full h-full rounded-full p-0 FLEX-CENTER" isIconOnly>
                            <FaUpload />
                        </Button>
                }
            </div>
        </div>
    )
}

export default ChangeImage
