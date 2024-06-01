'use client'
import React from 'react'
import CustomInput from '@/components/UI/CustomInput'
import FormikCreateSemester from '@/utils/formik/itemCreate/FormikCreateSemester'
import { Button} from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'
import CustomSelect from '@/components/UI/CustomSelect'
const ItemSemester = () => {
  const { formik  , loading , reloadKey} = FormikCreateSemester()
  const {data : session} = useSession();
  const fetcher = url => axios.get(url).then(res => res.data)
  const {data , error , isLoading} = useSWR(`/api/v1/institution/${session.user.institution}/year` , fetcher)
  return (
    <React.Fragment key={reloadKey}>
    <CustomSelect
  label="Year"
  fieldName="year"
  formik={formik}
  options={data} // Assuming you have fetched the year data elsewhere
  isLoading={isLoading}
  placeholder="Select a Year"
/>
        <CustomInput
    labelPlace='outside'
    label='name'
    formik={formik}
    fieldName={"name"}
    />
        <Button color='success' variant='shadow'  isLoading={loading} onPress={()=>formik.handleSubmit()} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
        </Button>
    </React.Fragment>
  )
}

export default ItemSemester