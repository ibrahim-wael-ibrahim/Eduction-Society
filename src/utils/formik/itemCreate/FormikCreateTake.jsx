import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const createTakeSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  semester: Yup.string().required("Semester is required"),
  year: Yup.string().required("Year is required"),
  subject: Yup.string().required("Subject is required"),
  hourCount: Yup.number().integer().required("Hour Count is required"),
  optional: Yup.boolean().required("Optional is required"),
  hour : Yup.string().required("Hour is required"),
});

const FormikCreateTake = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const {data : session} = useSession();
    const formik = useFormik({
      initialValues: {
        department: "",
        semester :  "",
        year: "",
        subject : "",
        hourCount : "",
        optional :  false,
        hour : ""
      },
      validationSchema: createTakeSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v1/institution/${session.user.institution}/take`, [values]);
            toast.success("Successfully Created Take");
            formik.resetForm()
            setReloadKey(reloadKey + 1);

          } catch (error) {
          toast.error("Error Creating Take");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey };
}
export default FormikCreateTake