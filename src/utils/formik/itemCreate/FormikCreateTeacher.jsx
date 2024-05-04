import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import  { useSWRConfig } from 'swr'
import { useSession } from "next-auth/react";


const createTeacherSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  birth: Yup.string().required("birth is required"),
  gender: Yup.string(),
  address: Yup.string(),
  phone: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed for this field "),
  type: Yup.string().required("type is required"),
  degree: Yup.string(),
  about: Yup.string(),
});

const FormikCreateTeacher = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const {data : session} = useSession();
    
    const { mutate } = useSWRConfig()

    const formik = useFormik({
      initialValues: {
        name :  "",
        birth : "0000-00-00",
        gender : "",
        address : "",
        phone : "",
        type : "TEACHER",
        degree : "",
        about : "",

      },
      validationSchema: createTeacherSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v2/teacher`, [values]);
            toast.success("Successfully Created teacher");
            mutate(`api/v1/count/${session.user.institution}/teacher`)
            formik.resetForm()
            setReloadKey(reloadKey + 1);

        
          } catch (error) {
          toast.error("Error Creating teacher");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateTeacher