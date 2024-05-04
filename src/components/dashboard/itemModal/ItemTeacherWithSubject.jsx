'use client'
import React,{useEffect , useState} from 'react'
import CustomSelect from '@/components/UI/CustomSelect'
import { Button } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import useSWR from 'swr'
import FormikCreateTakeAndTeacher from '@/utils/formik/itemCreate/FormikCreateTakeAndTeacher'
const ItemTeacherWithSubject = () => {
  const { formik  , loading , reloadKey} = FormikCreateTakeAndTeacher()
  const {data : session} = useSession();
  const fetcher = url => axios.get(url).then(res => res.data)
  const {data : department ,  isLoading : isLoadingDepartment} = useSWR(`/api/v1/institution/${session.user.institution}/department` , fetcher)
  const {data : subject ,  isLoading : isLoadingSubject} = useSWR(`/api/v1/institution/${session.user.institution}/subject` , fetcher)
  const {data : teacher ,  isLoading : isLoadingTeacher} = useSWR(`/api/v2/teacher` , fetcher)
  const {data : year ,  isLoading : isLoadingYear} = useSWR(`/api/v1/institution/${session.user.institution}/year` , fetcher)
  const {data : semester ,  isLoading : isLoadingSemester} = useSWR(()=> formik.values.year ? `/api/v1/institution/${session.user.institution}/semester?year=${formik.values.year}`: null , fetcher)
  const {data : take ,  isLoading : isLoadingTake} = useSWR(()=> (formik.values.year && formik.values.department && formik.values.semester && formik.values.subject) ? `/api/v1/institution/${session.user.institution}/take?year=${formik.values.year}&department=${formik.values.department}&semester=${formik.values.semester}&subject=${formik.values.subject}`: null , fetcher)
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
  label="Subject"
  fieldName="subject"
  formik={formik}
  options={subject} // Assuming you have fetched the subject data elsewhere
  isLoading={isLoadingSubject}
  placeholder="Select a Subject"
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
<CustomSelect
  label="Take"
  fieldName="take"
  formik={formik}
  options={take} // Assuming you have fetched the hour data elsewhere
  isLoading={isLoadingTake}
  placeholder="Select a take"
  show='subject.name'
/>
<CustomSelect
    label="Teacher"
    fieldName="teacher"
    formik={formik}
    options={teacher} // Assuming you have fetched the teacher data elsewhere
    isLoading={isLoadingTeacher}
    placeholder="Select a Teacher"
    returnValue='teacher.id'
    />
        <Button color='success' variant='shadow'  isLoading={loading} onPress={()=>formik.handleSubmit()} className='w-full mt-8'>
            {loading ? 'Loading...' : 'Create'}
        </Button>
    </React.Fragment>
  )
}

export default ItemTeacherWithSubject