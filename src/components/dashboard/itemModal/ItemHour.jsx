'use client'
import React from 'react'
import CustomInput from '@/components/UI/CustomInput'
import FormikCreateHour from '@/utils/formik/itemCreate/FormikCreateHour'
import { Button , Select ,SelectItem} from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'
import CustomSelect from '@/components/UI/CustomSelect'

const ItemHour = () => {
  const { formik  , loading , reloadKey} = FormikCreateHour()
  const {data : session} = useSession();
  const fetcher = url => axios.get(url).then(res => res.data)
  const {data : department ,  isLoading : isLoadingDepartment} = useSWR(`/api/v1/institution/${session.user.institution}/department` , fetcher)
  const {data : year ,  isLoading : isLoadingYear} = useSWR(`/api/v1/institution/${session.user.institution}/year` , fetcher)
  const {data : semester ,  isLoading : isLoadingSemester} = useSWR(()=> formik.values.year ? `/api/v1/institution/${session.user.institution}/semester?year=${formik.values.year}`: null , fetcher)
  return (
    <React.Fragment key={reloadKey}>
    <CustomSelect
  label="Department"
  fieldName="department"
  formik={formik}
  options={department} // Assuming you have fetched the department data elsewhere
  isLoading={isLoadingDepartment}
  placeholder="Select a Department"
/>
<CustomSelect
  label="Year"
  fieldName="year"
  formik={formik}
  options={year} // Assuming you have fetched the year data elsewhere
  isLoading={isLoadingYear}
  placeholder="Select a Year"
/>
<CustomSelect
  label="Semester"
  fieldName="semester"
  formik={formik}
  options={semester} // Assuming you have fetched the semester data elsewhere
  isLoading={isLoadingSemester}
  placeholder="Select a Semester"
/>
        <CustomInput
    labelPlace='outside'
    label='Price'
    formik={formik}
    fieldName={"price"}
    />
        <Button color='success' variant='shadow'  isLoading={loading} onPress={()=>formik.handleSubmit()} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
        </Button>
    </React.Fragment>
  )
}

export default ItemHour