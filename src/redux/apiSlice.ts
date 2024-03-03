import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "services/api";

const baseURL = import.meta.env.VITE_API_BASEURL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["Workspace", "Board", "Column", "Task"],

  endpoints: (builder) => ({
    // Workspace
    createWorkspace: builder.mutation({
      query: (payload) => ({
        url: `/workspace`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Workspace"],
    }),

    updateWorkspaceProfile: builder.mutation({
      query: (payload) => ({
        url: `/workspace/${payload.workspaceId}`,
        method: "PATCH",
        data: payload.formData,
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

    getWorkspaceBoards: builder.query({
      query: (workspaceId) => ({
        url: `/board/${workspaceId}`,
        method: "GET",
      }),
      providesTags: ["Workspace"],
    }),

    getWorkspace: builder.query({
      query: (workspaceId) => ({
        url: `/workspace/${workspaceId}`,
        method: "GET",
      }),
      providesTags: ["Workspace"],
    }),

  
    updateMemberRole: builder.mutation({
      query: (payload) => ({
        url: `/workspace/assign-admin/${payload.workspaceId}/${payload.userId}`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["Workspace"],
    }),

    workspaceInvite: builder.mutation({
      query: (payload) => ({
        url: `/workspace/addmember/${payload.workspaceId}`,
        method: "PATCH",
        data: payload.formData,
      }),
      invalidatesTags: ["Workspace"],
    }),

    removeWorkspaceMember: builder.mutation({
      query: (payload) => ({
        url: `/workspace/delete-member/${payload.workspaceId}/${payload.userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),

    removePendingMember: builder.mutation({
      query: (payload) => ({
        url: `/workspace/delete-pendingmember/${payload.workspaceId}/${payload.userEmail}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),

    // /delete-member/:workspaceId/:userEmail
    deleteWorkspace: builder.mutation({
      query: (payload) => ({
        url: `/workspace/${payload.workspaceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
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

    getBoard: builder.query({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}/${payload.boardId}`,
        method: "GET",
      }),
      providesTags: ["Board"],
    }),

    editBoard: builder.mutation({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}/${payload.boardId}`,
        method: "PATCH",
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

    editColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.columnId}`,
        data: payload.formData,
        method: "PATCH",
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

    getTask: builder.query({
      query: (payload) => ({
        url: `/task/${payload.workspaceId}/${payload.taskId}`,
        method: "get",
      }),
      providesTags: ["Task"],
    }),

    editTask: builder.mutation({
      query: (payload) => ({
        url: `/task/${payload.workspaceId}/${payload.columnId}/${payload.taskId}`,
        method: "PATCH",
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
  useGetWorkspaceBoardsQuery,
  useUpdateWorkspaceProfileMutation,
  useGetWorkspaceQuery,
  useCreateWorkspaceMutation,
  useGetAllWorkspacesQuery,
  useCreateTaskMutation,
  useEditColumnMutation,
  useCreateBoardMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
  useDeleteBoardMutation,
  useJoinWorkspaceMutation,
  useEditBoardMutation,
  useWorkspaceInviteMutation,
  useGetTaskQuery,
  useGetBoardQuery,
  useEditTaskMutation,
  useRemoveWorkspaceMemberMutation,
  useDeleteWorkspaceMutation,
  useRemovePendingMemberMutation,
useUpdateMemberRoleMutation
} = apiSlice;
