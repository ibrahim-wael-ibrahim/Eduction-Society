import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import  { useSWRConfig } from 'swr'

const createAdminSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  gender : Yup.string().required("Gender is required"),
  birthDay : Yup.date().required("Birth Date is required"),
  type : Yup.string().required("Type is required"),
});

const FormikCreateAdmin = () => {
  const { mutate } = useSWRConfig()
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        name :  "",
        gender : "",
        birthDay : "",
        type : "",
      },
      validationSchema: createAdminSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/user`, [values]);
            toast.success("Successfully Created Admin");
            mutate(`api/v1/count/${session.user.institution}/admin`);
            mutate(`/api/v1/institution/${session.user.institution}/user`);
            formik.resetForm()
            setReloadKey(reloadKey + 1);

          } catch (error) {
          toast.error("Error Creating Admin");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateAdmin