import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
const forgetSchema = Yup.object().shape({
    email: Yup.string()
    .email("Invalid email address").required("Email is required"),
  });

const FormikForget = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
      initialValues: {
        email: "",
        
      },
      validationSchema: forgetSchema,
      onSubmit: async ({ email }) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/forget/${email}`);

            if (res.status === 201) {
              toast.success("Check your email for reset link");
              router.push("/login");
            }
            if (res.status === 404) {
              toast.error("User not found");
            }

          

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
})
return { formik, loading };
}
export default FormikForget