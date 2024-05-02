'use client'
import React from 'react'
import CustomInput from '@/components/UI/CustomInput'
import FormikCreateSubject from '@/utils/formik/itemCreate/FormikCreateSubject'
import { Button } from '@nextui-org/react'
const ItemSubject = () => {
  const { formik  , loading ,reloadKey} = FormikCreateSubject()
  return (
    <React.Fragment key={reloadKey}>
        <CustomInput
    labelPlace='outside'
    label='Name'
    formik={formik}
    fieldName={"name"}
    />
        <CustomInput
    labelPlace='outside'
    label='Code'
    formik={formik}
    fieldName={"code"}
    />
        <Button color='success' variant='shadow'  isLoading={loading} onPress={()=>formik.handleSubmit()} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
        </Button>
    </React.Fragment>
  )
}

export default ItemSubject