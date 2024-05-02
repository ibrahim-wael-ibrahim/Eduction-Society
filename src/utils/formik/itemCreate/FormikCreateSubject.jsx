import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import  { useSWRConfig } from 'swr'

const createSubjectSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code : Yup.string().required("Gender is required"),
});

const FormikCreateSubject = () => {
  const { mutate } = useSWRConfig()
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        name :  "",
        code : "",
      },
      validationSchema: createSubjectSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/subject`, [values]);
            toast.success("Successfully Created Subject");
            mutate(`api/v1/count/${session.user.institution}/subject`)
            formik.resetForm()
            setReloadKey(reloadKey + 1);

        
          } catch (error) {
          toast.error("Error Creating Subject");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey};
}
export default FormikCreateSubject