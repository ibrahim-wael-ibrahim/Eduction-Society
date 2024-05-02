import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const loginSchema = Yup.object().shape({
    email: Yup.string()
    .email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters").required("Password is required"),
  });

const FormikLogin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async ({ email, password }) => {
        setLoading(true);
        try {
          
          const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          if (res.ok) {
            toast.success("Successfully logged in!");
            router.push("/");
          } else {
            toast.error(res.error);
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
export default FormikLogin