import React from 'react'
import UploadFile from '@/components/UI/UploadFile'
const StepImageUpload = ({formik}) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-6  ">
        <span>Chose Image to Upload</span>
        <UploadFile formik={formik}/>
    </div>
  )
}

export default StepImageUpload