import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const useFetchData = (action, url, msg, obj) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios[action](url, obj);
        if (msg) {
          toast.success(msg);
        }
        if (!res.data) {
          throw new Error('Data not found');
        }
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.error || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchData();
  }, [action, url, msg, obj]);

  return { data, error, loading };
};

export default useFetchData;
