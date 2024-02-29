import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "services/api";

const baseURL = import.meta.env.VITE_API_BASEURL;

export const authSlice = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // User
    createUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/signup`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation({
      query: (payload) => ({
        url: `/auth/login`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation({
      query: (confirmationCode) => ({
        url: `/auth//email-verify/${confirmationCode}`,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useVerifyEmailMutation,
} = authSlice;

// export async function verifyEmail(confirmationCode: string) {
//   const response = await makeApiCall(`auth/email-verify/${confirmationCode}`);
//   return response;
