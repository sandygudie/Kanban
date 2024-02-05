import axios, { type AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASEURL;

async function makeApiCall<T = any>(
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
      if (error.response.status === 401) {
        window.location.replace("/login");
      }
    }

    throw new Error(error.response?.data?.message || error.message);
  }
}

export default makeApiCall;
