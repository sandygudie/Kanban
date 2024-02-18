import axios from "axios";
import type { AxiosRequestConfig } from "axios";
const baseURL = import.meta.env.VITE_API_BASEURL;

export async function makeApiCall<T = any>(
  url: string,
  method: AxiosRequestConfig["method"] = "get",
  payload?: AxiosRequestConfig["data"],
  axiosRequestConfig?: Omit<AxiosRequestConfig, "url" | "method" | "data">
): Promise<T> {
  try {
    if (!baseURL || typeof baseURL !== "string") {
      throw new Error("BASEURL is not defined");
    }
    const { data } = await axios({
      url,
      method,
      data: payload,
      baseURL,
      withCredentials: true,
      ...axiosRequestConfig,
    });

    return data;
  } catch (error: any) {
    if (error.response) {
      console.log(error);
      // if (error.response.status === 401) {
      //   // window.location.replace("/login");
      // }
    }

    throw new Error(error.response?.data?.message || error.message);
  }
}

import { ILogin, ISignup } from "types/auth";

export async function login(payload: ILogin) {
  const response = await makeApiCall("auth/login", "post", payload);
  return response;
}
export async function signUp(payload: ISignup) {
  const response = await makeApiCall("auth/signup", "post", payload);
  return response;
}

export async function verifyEmail(confirmationCode: string) {
  const response = await makeApiCall(`auth/email-verify/${confirmationCode}`);
  return response;
}
