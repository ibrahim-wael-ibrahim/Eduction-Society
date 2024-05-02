"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button, Spinner } from '@nextui-org/react'
import CustomInput from '@/components/UI/CustomInput'
import ChangeImage from '@/components/UI/ChangeImage'
import FormikChangePassword from '@/utils/formik/auth/FormikChangePassword'
import FormikSettingUser from '@/utils/formik/setting/FormikSettingUser'
import { useSession } from 'next-auth/react'
const page = () => {
    const { data: session } = useSession()
    const { formik: formikUser, loading } = FormikSettingUser()
    const { formik: formikPassword, loading: loadingChangePass } = FormikChangePassword()
    const [isClient, setIsClient] = useState(true);

    useEffect(() => {
        setIsClient(false);
    }, []);

    return isClient ? <Spinner color='success' size='lg' /> : (
        <div className=' relative FLEX-CENTER gap-4 mt-5'>
            <ChangeImage className=" absolute" />

            <Card className='w-[600px] h-full FLEX-CENTER' isBlurred>
                <CardHeader className='h-20 FLEX-CENTER'>
                    <span className=' first-letter:text-green-500 text-3xl'>Setting</span>
                </CardHeader>
                <CardBody className='FLEX-CENTER gap-4'>
                    <CustomInput
                        formik={formikUser}
                        name='email'
                        type='email'
                        fieldName={'email'}
                        label={'email'}
                        disable
                    />
                    <CustomInput
                        formik={formikUser}
                        name='institution'
                        fieldName={'institution'}
                        label={'institution name'}
                        disable
                    />
                    <CustomInput
                        formik={formikUser}
                        label={'type'}
                        name='type'
                        fieldName={'type'}
                        disable
                    />
                    {
                        session?.user?.type === 'ADMIN_INSTITUTION' ? null :
                            <CustomInput
                                formik={formikUser}
                                label={'gender'}
                                name='gender'
                                fieldName={'gender'}
                                disable
                            />
                    }
                    <CustomInput
                        formik={formikUser}
                        label={"name"}
                        name='name'
                        fieldName={'name'}
                    />
                    {
                        session?.user?.type === 'ADMIN_INSTITUTION' ? null :
                            <CustomInput
                                formik={formikUser}
                                label={'address'}
                                name='address'
                                fieldName={'address'}
                            />
                    }
                    {
                        session?.user?.type === 'ADMIN_INSTITUTION' ? null :
                            <CustomInput
                                formik={formikUser}
                                label={'birth'}
                                name='birth'
                                type='date'
                                fieldName={'birth'}
                            />
                    }
                    {
                        session?.user?.type === 'ADMIN_INSTITUTION' ? null :
                            <CustomInput
                                formik={formikUser}
                                label={'phone'}
                                name='phone'
                                fieldName={'phone'}
                            />
                    }
                    <Button isLoading={loading}
                        onPress={formikUser.handleSubmit}
                        variant="shadow"
                        color="success">change information</Button>
                </CardBody>
                <CardFooter className='FLEX-CENTER gap-6'>
                    <CustomInput
                        formik={formikPassword}
                        name='password'
                        type='password'
                        fieldName={'password'}
                        placeholder='password' />
                    <CustomInput
                        formik={formikPassword}
                        name='passwordConfirm'
                        type='password'
                        fieldName={'passwordConfirm'}
                        placeholder='passwordConfirm' />
                    <Button isLoading={loadingChangePass}
                        onPress={formikPassword.handleSubmit}
                        variant="shadow"
                        color="success">change password</Button>

                </CardFooter>
            </Card>
        </div >
    )
}

export default page