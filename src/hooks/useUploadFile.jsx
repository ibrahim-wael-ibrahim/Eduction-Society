import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
const useFileUpload = (formik) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState(null);
  useEffect(() => {
    if(formik){
      if(response) formik.setFieldValue('file', response);
      return () => setResponse(null); // cleanup function to reset response state when component unmounts
    }
  }, [ response ]);
const handleFile = (e) => {
  setFiles([...files, ...e.target.files]);
};

  const handleDelete = (index) => {
    setFiles(files.filter((file, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if(files.length === 0) return toast.error('Please select a file');
    files.forEach(file => {
      formData.append('file', file);
    });
    setLoading(true);
    try {
      const res = await axios.post('/api/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
        setResponse(res.data.arrayFiles);
        toast.success('File uploaded successfully');
      setFiles([]);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to upload file');
      setLoading(false);
    }
  };

  return {
    files,
    response,
    loading,
    progress,
    handleFile,
    handleDelete,
    handleUpload
  };
};

export default useFileUpload;
