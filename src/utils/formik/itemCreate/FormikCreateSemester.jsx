import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const createSemesterSchema = Yup.object().shape({
  year: Yup.string().required("Year is required"),
  name: Yup.string().required("Title is required"),
});

const FormikCreateSemester = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        year: "",
        name :  "",
      },
      validationSchema: createSemesterSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/semester`, [values]);
            toast.success("Successfully Created semester");
            formik.resetForm()
            setReloadKey(reloadKey + 1);

        
          } catch (error) {
          toast.error("Error Creating semester");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey};
}
export default FormikCreateSemester