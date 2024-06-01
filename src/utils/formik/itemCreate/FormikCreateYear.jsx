import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const createYearSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
});

const FormikCreateYear = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        name :  "",
      },
      validationSchema: createYearSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/year`, [values]);
            toast.success("Successfully Created Year");
            formik.resetForm()
            setReloadKey(reloadKey + 1);

        
          } catch (error) {
          toast.error("Error Creating Year");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateYear