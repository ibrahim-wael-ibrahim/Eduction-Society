import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

const createTakeTeacherSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  semester: Yup.string().required("Semester is required"),
  year: Yup.string().required("Year is required"),
  subject: Yup.string().required("Subject is required"),
  teacher: Yup.string().required("Teacher is required"),
  take: Yup.string().required("Take is required"),
});

const FormikCreateTakeAndTeacher = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const formik = useFormik({
      initialValues: {
        department: "",
        semester :  "",
        year: "",
        subject : "",
        teacher : "",
        take : "",
      },
      validationSchema: createTakeTeacherSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
          console.log(values)
            await axios.post(`/api/v2/teacher/take`, values);
            toast.success("Successfully Created teacher and take");
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
export default FormikCreateTakeAndTeacher