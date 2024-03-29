import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { getToken } from "utilis/token";

  const token = getToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response) {
        if (err.response.status === 401) {
          window.location.replace("/login");
        }
      }
      return {
        error: err.response?.data || err.message,
      };
    }
  };

export default axiosBaseQuery;
