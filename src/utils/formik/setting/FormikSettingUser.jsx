import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

import useSWR, { useSWRConfig } from "swr";

import axios from "axios";

import diffAndComparison from "@/utils/function/diffAndComparison";

const userSchema = Yup.object().shape({
  name: Yup.string(),
  address: Yup.string(),
  birth: Yup.date(),
  phone: Yup.string().matches(/^[0-9]+$/, "Only numbers are allowed for this field "),
});

const FormikSettingUser = () => {
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();
  const fetcher = url => axios.get(url).then(res => res.data)

  const { data: user, isLoading: isLoadingUser } = useSWR(() => session?.user?.id ? `/api/v1/institution/${session.user.institution}/user/${session?.user?.id}` : null, fetcher)
  useEffect(() => {
    if (user) {
      formik.setValues({
        email: user.data.email,
        type: user.data.type,
        name: user.data.name,
        address: user.data.address,
        birth: user.data.birth,
        phone: user.data.phone,
        gender: user.data.gender,
        institution: user.data.institution.name,
      })
    }
  }
    , [user])






  const [loading, setLoading] = useState(false);


  const formik = useFormik({
    initialValues: {
      email: "",
      type: "",
      name: "",
      address: "",
      birth: "",
      phone: "",
      gender: "",
      institution: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let userData = diffAndComparison(user.data, values)
        console.log(userData)
        await axios.patch(`/api/v1/institution/${session.user.institution}/user/${session?.user?.id}`, userData);
        mutate(`/api/v1/institution/${session.user.institution}/user/${session?.user?.id}`);
        toast.success("success update user");
      } catch (error) {
        toast.error("can't update ");
      } finally {
        setLoading(false);
      }

    },
  });

  return { formik, loading };
};

export default FormikSettingUser;