import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

const createStudentSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  birth: Yup.string().required("birth"),
  gender: Yup.string(),
  address: Yup.string(),
  phone: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed for this field "),
  code: Yup.string().required("code is required"),
  startYear: Yup.string().required("startYear is required"),
  grade: Yup.string(),
});

const FormikCreateStudent = () => {
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const formik = useFormik({
      initialValues: {
        name :  "",
        birth : "0000-00-00",
        gender : "",
        address : "",
        phone : "",
        code : "",
        startYear : "0000-00-00",
        grade : "",

      },
      validationSchema: createStudentSchema,
      onSubmit: async values => {
        setLoading(true);
        try {
            await axios.post(`/api/v2/student`, [values]);
            toast.success("Successfully Created Student");
            formik.resetForm()
            setReloadKey(reloadKey + 1);

        
          } catch (error) {
          toast.error("Error Creating Student");
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading , reloadKey};
}
export default FormikCreateStudent