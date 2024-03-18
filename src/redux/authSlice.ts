import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "services/api";
const baseURL = import.meta.env.VITE_API_BASEURL;

export const authSlice = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["User", "Workspace"],

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

forgotPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/forgotpassword`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/resetpassword`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation({
      query: (confirmationCode) => ({
        url: `/auth/email-verify/${confirmationCode}`,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    googleLogin: builder.mutation({
      query: (payload) => ({
        url: `/auth/google`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useVerifyEmailMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authSlice;
