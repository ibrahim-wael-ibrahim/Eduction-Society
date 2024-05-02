import axios from "axios";
import { toast } from "sonner";
const Axios = axios.create(
)
const fetchData = async (action , url , msg ,obj )=>{
  try{
    const res = await Axios[action](url,obj)
    if (msg) {
      toast.success(msg);
    }

    if (!res.data) {
      return "data not found";
    }

    return res.data;
  }catch(err){
    throw err?.response?.data?.error || "some thing error"

  }
}
export default fetchData