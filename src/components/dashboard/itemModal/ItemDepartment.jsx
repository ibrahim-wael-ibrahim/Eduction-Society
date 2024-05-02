'use client'
import React from 'react'
import CustomInput from '@/components/UI/CustomInput'
import FormikCreateDepartment from '@/utils/formik/itemCreate/FormikCreateDepartment'
import { Button } from '@nextui-org/react'
const ItemDepartment = () => {
  const { formik  , loading ,reloadKey} = FormikCreateDepartment()
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
    label='Hours'
    formik={formik}
    fieldName={"hours"}
    />
        <Button color='success' variant='shadow'  isLoading={loading} onPress={formik.handleSubmit} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
        </Button>
    </React.Fragment>
  )
}

export default ItemDepartment