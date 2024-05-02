'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BiErrorCircle } from "react-icons/bi";
import { CiCircleCheck } from "react-icons/ci";
import { TbUserSearch } from "react-icons/tb";
import { Card, CardBody, CardHeader, CardFooter, Spinner ,Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
const page = ({ params }) => {
  const router = useRouter()
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await axios.get(`/api/v1/virify/${params.id}`);
              setData(res.data);
              setTimeout(() => {
                router.push('/login');
            }, 5000);
          } catch (e) {
              setError(e.response?.data?.error || e.message);
              setTimeout(() => {
                  router.push('/');
              }, 5000);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  return (
<div className=' relative FLEX-CENTER'>
{(error && !data) && 
          <Button
          isIconOnly
            color="danger"
            variant="shadow"
            className='rounded-full absolute -top-5 z-10 FLEX-CENTER p-1 '
            >
  
            <BiErrorCircle  size={150}  />
          </Button>
          }
          {data &&
          <Button
          isIconOnly
            color="success"
            variant="shadow"
            className='rounded-full absolute -top-5 z-10 FLEX-CENTER p-1 '
            >
            <CiCircleCheck size={150}  />
          </Button>}
          {
            loading && 
            <Button
            isIconOnly
            color="success"
            variant="shadow"
            className='rounded-full absolute -top-5 z-10 FLEX-CENTER p-1 '
            >
              <TbUserSearch size={150} />
            </Button>
  
          }
      <Card className='w-[500px] h-[450px] flex f;ex-co; justify-center items-center '>
        <CardHeader className='FLEX-CENTER w-full '>
          
          </CardHeader>
        <CardBody className='w-full -h-full flex- flex-col justify-center items-center'>
          {loading && <Spinner label="Loading..." color="success" />}
  
          <p>
            {
              data ? 'Your account has been successfully verified' : error ? `${error}` : null
  
            }
          </p>
        </CardBody>
        <CardFooter className='w-full FLEX-CENTER '>
            {
              data &&         <Button
              variant="shadow"
              color="success"
              className='w-full '
              onPress={() => router.push('/login')}
            >
              Go to login
            </Button>
            }
          </CardFooter>
      </Card>
</div>
  )
}

export default page