import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const registerSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(
        8,"Password must be at least 8 characters long"
    ).required("Required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    insName: Yup.string().required("Required"),
    insCountry: Yup.string().required("Required"),
    insState: Yup.string().required("Required"),
    insCity: Yup.string().required("Required"),
    insAddress: Yup.string().required("Required"),
    cardNumber: Yup.string().required("Required"),
    cardCvv: Yup.string().required("Required"),
    cardExpiration: Yup.string().required("Required"),
});

const FormikRegister = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            insName: "",
            insCountry: "",
            insState: "",
            insCity: "",
            insAddress: "",
            cardNumber: "",
            cardCvv: "",
            cardExpiration: "",

        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await axios.post("/api/v1/register", values);
                if (res.data.error) {
                    throw new Error(res.data.error);
                }
                formik.resetForm();

                toast.success("Successfully register!");
                router.push("/login");
            } catch (error) {
                
                toast.error(error.response.data.error);
            } finally {
                setLoading(false);
            }
        },
    });
    return { formik, loading };
};
export default FormikRegister;
