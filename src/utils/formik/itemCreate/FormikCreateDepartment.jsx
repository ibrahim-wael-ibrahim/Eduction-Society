import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import  { useSWRConfig } from 'swr'
const createDepartmentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  hours : Yup.number().required("Gender is required"),
});

const FormikCreateDepartment = () => {
  const { mutate } = useSWRConfig()
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        name :  "",
        hours : "",
      },
      validationSchema: createDepartmentSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/department`, [values]);
            toast.success("Successfully Created Department");
            mutate(`api/v1/count/${session.user.institution}/department`)
            mutate(`/api/v1/institution/${session?.user?.institution}/department`)
            formik.resetForm()
            setReloadKey(reloadKey + 1);


          } catch (error) {
          toast.error("Error Creating Department");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateDepartment