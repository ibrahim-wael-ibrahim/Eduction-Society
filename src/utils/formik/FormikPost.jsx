import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import  { useSWRConfig } from 'swr'
const postSchema = Yup.object().shape({
  content: Yup.string(),
});

const FormikPost = () => {
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const formik = useFormik({
    initialValues: {
      content: "",
      files: "",
      publicChoose:true
    },
    validationSchema: postSchema,
    onSubmit: async ({ content, files ,publicChoose}) => {
      setLoading(true);
      try {
        if(!content && !files) throw new Error("No Content publish post")
        const formData = new FormData();
        files.length > 0 &&  files.forEach(file => {
          formData.append('file', file);
        });
        formData.append('content', content);
        formData.append('publicChoose', publicChoose);
        
        await axios.post("/api/v1/post", formData);
        mutate(`/api/v1/post`)
        toast.success("Post Published");
        formik.resetForm();
        setReloadKey(reloadKey + 1);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }

    },
  });

  return { formik, loading , reloadKey };
};

export default FormikPost;