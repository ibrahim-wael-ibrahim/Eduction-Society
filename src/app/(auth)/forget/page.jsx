'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { Card , CardBody ,CardFooter ,CardHeader , Button ,Link} from '@nextui-org/react'
import CustomInput from '@/components/UI/CustomInput'
import FormikForget from '@/utils/formik/auth/FormikForget'
const page = () => {
  const { data: session } = useSession()
  const { formik, loading } = FormikForget()
  return (
    <Card className='w-2/6 min-w-[300px] h-[500px] FLEX-CENTER'>
        <CardHeader className='FLEX-CENTER'>Forget Password</CardHeader>
        <CardBody className='FLEX-CENTER  gap-4'>
            <CustomInput
                formik={formik}
                name='email'
                type='email'
                fieldName={'email'}
                placeholder='Email'/>
        </CardBody>
        <CardFooter className='FLEX-CENTER !items-start gap-1'>
        <Link href="/login" showAnchorIcon color="success">
  login
</Link>
            <Button isLoading={loading}
              onPress={formik.handleSubmit}
              className="w-full"
              variant="shadow"
              color="success">Send Email</Button>
            
        </CardFooter>
    </Card>
  )
}

export default page