import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "services/api";
const baseURL = import.meta.env.VITE_API_BASEURL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["User", "Workspace", "Board", "Column", "Task"],
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

    // Workspace
    createWorkspace: builder.mutation({
      query: (payload) => ({
        url: `/workspace`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Workspace"],
    }),

    joinWorkspace: builder.mutation({
      query: (payload) => ({
        url: `/workspace/join-workspace`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Workspace"],
    }),

    getAllWorkspaces: builder.query<any, void>({
      query: () => ({ url: "/user", method: "get" }),
      providesTags: ["Workspace"],
    }),

    getWorkspaceBoard: builder.query({
      query: (workspaceId: string) => ({
        url: `/board/${workspaceId}`,
        method: "get",
      }),
      providesTags: ["Workspace"],
    }),

    // Board
    createBoard: builder.mutation({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}`,
        method: "POST",
        data: payload.formData,
      }),
      invalidatesTags: ["Board"],
    }),

    deleteBoard: builder.mutation({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}/${payload.boardId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board"],
    }),
    
    // Column
    createColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.boardId}`,
        method: "POST",
        data: payload.formData,
      }),
      invalidatesTags: ["Column"],
    }),

    deleteColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Column"],
    }),

    // Task
    createTask: builder.mutation({
      query: (payload: any) => ({
        url: `/task/${payload.workspaceId}/${payload.columnId}`,
        method: "POST",
        data: payload.formdata,
      }),
      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation({
      query: (payload) => ({
        url: `/task/${payload.workspaceId}/${payload.columnId}/${payload.taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetWorkspaceBoardQuery,
  useCreateWorkspaceMutation,
  useGetAllWorkspacesQuery,
  useCreateTaskMutation,
  useCreateUserMutation,
  useLoginUserMutation,
  useCreateBoardMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
  useDeleteBoardMutation,
  useJoinWorkspaceMutation
} = apiSlice;
