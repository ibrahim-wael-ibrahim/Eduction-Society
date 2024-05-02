'use client';
import ContainerStep from "@/components/stepper/containerStep";
import FormikRegister from "../../../utils/formik/auth/FormikRegister";
import StepCreateAccount from "@/components/stepper/steps/StepCreateAccount";
import StepInstitutionData from "@/components/stepper/steps/StepInstitutionData";
import StepPayment from "@/components/stepper/steps/StepPayment";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const register = () => {
  const { formik, loading } = FormikRegister();
  const router = useRouter()
  const {data : session} =useSession()
  if(session) router.replace("/")
  return (
    <ContainerStep numberOfStep={3} formik={formik} loading={loading}>
      <StepCreateAccount formik={formik} />
      <StepInstitutionData formik={formik} />
      <StepPayment formik={formik} />
    </ContainerStep>
  );
};

export default register;
