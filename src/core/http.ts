// import { useAuthStore } from "@/stores/auth";
import { LOCAL_USER_KEY } from "@/configs/auth.config";
import axios from "axios";
import cache from "./cache";

const HTTP = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL
})

HTTP.interceptors.request.use((req) => {
  const res = cache.getCache(LOCAL_USER_KEY);
  if (res?.data.token && req.headers) {
    req.headers['Authorization'] = `Bearer ${res?.data.token}`
  }
  return req;
})

HTTP.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const data = err.response && err.response.data;
    if (err.response && err.response.status === 401 && Event !== undefined) {
      const event = new Event('unauthorized');
      // const event = document.createEvent("Event");
      // event.initEvent("unauthorized", true, true);
      document.dispatchEvent(event);
    }
    console.error('HTTP error: ', err);
    const msg = data.message || err.message;
    err.message = msg;
    throw err;
  } 
)

export const handleResponse = (res: any) => res.data.result;

export const wrapResponse = (res: any) => {
  if (!res.data?.result?.success && res.data?.result?.message) {
    throw new Error(res.data?.result?.message);
  }

  return res;
}

export default HTTP;