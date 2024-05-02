'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { Card , CardBody ,CardFooter ,CardHeader , Button } from '@nextui-org/react'
import CustomInput from '@/components/UI/CustomInput'
import FormikChangePassword from '@/utils/formik/auth/FormikChangePassword'
const page = ({ params }) => {
  const { id } = params
  const { formik, loading } = FormikChangePassword(id)
  return (
    <Card className='w-2/6 min-w-[300px] h-[500px] FLEX-CENTER'>
        <CardHeader className='FLEX-CENTER'>Forget Password</CardHeader>
        <CardBody className='FLEX-CENTER  gap-4'>
            <CustomInput
                formik={formik}
                name='password'
                type='password'
                fieldName={'password'}
                placeholder='password'/>
            <CustomInput
                formik={formik}
                name='passwordConfirm'
                type='password'
                fieldName={'passwordConfirm'}
                placeholder='passwordConfirm'/>
        </CardBody>
        <CardFooter className='FLEX-CENTER '>
            <Button isLoading={loading}
              onPress={formik.handleSubmit}
              className="w-full"
              variant="shadow"
              color="success">change password</Button>
            
        </CardFooter>
    </Card>
  )
}

export default page