import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
const forgetSchema = Yup.object().shape({
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    passwordConfirm: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Password confirm is required"),
});

const FormikChangePassword = (id) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: "",

        },
        validationSchema: forgetSchema,
        onSubmit: async ({ password }) => {
            let res = null
            setLoading(true);
            try {
                if(id){
                    res = await axios.patch(`/api/v1/forget/change/${id}`, { password });
                    if (res.status === 201) {
                        toast.success("Password changed successfully");
                        router.push("/login");
                    }
                    if (res.status === 404) {
                        toast.error("Invalid link");
                    }
                }else if(!id && session){
                res = await axios.patch(`/api/v1/forget/change/${session.user.id}`, { password });
                if (res.status === 201) {
                    toast.success("Password changed successfully");
                }
                if (res.status === 404) {
                    toast.error("Invalid link");
                }
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
export default FormikChangePassword