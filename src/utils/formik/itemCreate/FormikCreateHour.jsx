import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const createHourSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  semester: Yup.string().required("Semester is required"),
  year: Yup.string().required("Year is required"),
  price: Yup.number().required("Price is required"),

});

const FormikCreateHour = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        department: "",
        semester :  "",
        year: "",
        price :  "",
      },
      validationSchema: createHourSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/hour`, [values]);
            toast.success("Successfully Created hour");
            formik.resetForm()
            setReloadKey(reloadKey + 1);

          
          } catch (error) {
          toast.error("Error Creating hour");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateHour