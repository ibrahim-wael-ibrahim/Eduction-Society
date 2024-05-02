'use client';
import CustomInput from "@/components/UI/CustomInput"

const StepPayment = ({formik}) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-6  ">
        <span>Enter Data To Payment</span>
        <CustomInput
          label={"Card Number"}
          formik={formik}
          required
          fieldName={"cardNumber"}
          labelPlace="outside"/>
        <CustomInput
            label={"Card CVV"}
            formik={formik}
            required
            fieldName={"cardCvv"}
            labelPlace="outside"/>
        <CustomInput
            label={"Expiration Date"}
            formik={formik}
            required
            fieldName={"cardExpiration"}
            labelPlace="outside"/>
    </div>
  )
}

export default StepPayment