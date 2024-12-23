import keyValue from "@/commons/key-value";
import env from "@/env";
import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: env.REACT_APP_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the token to the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(keyValue.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    //It only for local dev
    if (config.url?.startsWith("/r/") && env.DEV_MODE === true) {
      config.baseURL = "http://127.0.0.1:8080"; // rust api
      config.url = config.url.replace(/^\/r\//, "/");
    } else {
      config.baseURL = env.REACT_APP_PUBLIC_API_BASE_URL;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authHandleError = async (error: AxiosError) => {
  if (error.response?.status === 401) {
    localStorage.clear();
    window.location.reload();
  }
  const data = error?.response?.data as any;
  return Promise.reject(data?.meta || data || error);
};
const authHandleSuccess = (res: AxiosResponse) => {
  return res;
};
api.interceptors.response.use(authHandleSuccess, authHandleError);
export default api;
