'use client';
import CustomInput from '@/components/UI/CustomInput'

const StepCreateAccount = ({formik}) => {

   return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-6  ">
        <span>Enter your personal information to create an account</span>
        <CustomInput
          label={"Name"}
          formik={formik}
          required
          fieldName={"name"}
          labelPlace="outside"
        />
        <CustomInput
        type='email'
          label={"Email"}
          formik={formik}
          required
          fieldName={"email"}
          labelPlace="outside"
        />
        <CustomInput
        type='password'
          label={"Password"}
          formik={formik}
          required
          fieldName={"password"}
          labelPlace="outside"/>
        <CustomInput
        type='password'
          label={"Confirm Password"}
          formik={formik}
          required
          fieldName={"confirmPassword"}
          labelPlace="outside"/>

        
      </div>
  )
}

export default StepCreateAccount