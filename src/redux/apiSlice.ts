import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "services/api";
import { IWorkspace } from "types/workspace";

const baseURL = import.meta.env.VITE_API_BASEURL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["Workspace", "User", "Board", "Column", "Task"],

  endpoints: (builder) => ({
    UpdateUser: builder.mutation({
      query: (payload: {
        userId: string;
        userData: { name: string; email: string; profilePics: string };
      }) => ({
        url: `/user/${payload.userId}`,
        method: "PATCH",
        data: payload.userData,
      }),
      invalidatesTags: ["User", "Board", "Workspace", "Task"],
    }),

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
      query: () => ({ url: "/user", method: "GET" }),
      providesTags: ["Workspace"],
    }),

    getWorkspaceBoards: builder.query({
      query: (workspaceId: string) => ({
        url: `/board/${workspaceId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IWorkspace }) => response.data,
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

    updateSocialLinks: builder.mutation({
      query: (payload) => ({
        url: `/workspace/socials/${payload.workspaceId}`,
        method: "POST",
        data: payload.links,
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

    deleteWorkspace: builder.mutation({
      query: (payload) => ({
        url: `/workspace/${payload.workspaceId}`,
        method: "DELETE",
      }),
    }),

    createBoard: builder.mutation({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}`,
        method: "POST",
        data: payload.formData,
      }),
      invalidatesTags: ["Board", "Workspace"],
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
      invalidatesTags: ["Board", "Workspace"],
    }),

    deleteBoard: builder.mutation({
      query: (payload) => ({
        url: `/board/${payload.workspaceId}/${payload.boardId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board", "Workspace"],
    }),

    createColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.boardId}`,
        method: "POST",
        data: payload.formData,
      }),
      invalidatesTags: ["Column", "Board", "Workspace"],
    }),

    editColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.columnId}`,
        data: payload.formData,
        method: "PATCH",
      }),
      invalidatesTags: ["Column", "Board", "Workspace"],
    }),

    deleteColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload.workspaceId}/${payload.columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Column", "Board", "Workspace"],
    }),

    createTask: builder.mutation({
      query: (payload: any) => ({
        url: `/task/${payload.workspaceId}/${payload.columnId}`,
        method: "POST",
        data: payload.formdata,
      }),
      invalidatesTags: ["Task", "Board", "Workspace"],
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
      invalidatesTags: ["Task", "Workspace"],
    }),

    deleteTask: builder.mutation({
      query: (payload) => ({
        url: `/task/${payload.workspaceId}/${payload.columnId}/${payload.taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Board","Workspace","Column"],
    }),

    assignTask: builder.mutation({
      query: (payload) => ({
        url: `/task/assign-task/${payload.workspaceId}/${payload.taskId}`,
        method: "POST",
        data: payload.userId,
      }),
      invalidatesTags: ["Task", "Board", "Workspace"],
    }),

    moveTask: builder.mutation({
      query: (payload) => ({
        url: `/task/movetask/${payload.workspaceId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Task", "Board", "Workspace"],
    }),

    addTaskTags: builder.mutation({
      query: (payload) => ({
        url: `/task/tag/${payload.taskId}`,
        method: "POST",
        data: payload.tag,
      }),
      invalidatesTags: ["Task"],
    }),

    deleteTaskTags: builder.mutation({
      query: (payload) => ({
        url: `/task/tag/${payload.taskId}`,
        method: "DELETE",
        data: payload.tag,
      }),
      invalidatesTags: ["Workspace", "Task"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
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
  useUpdateMemberRoleMutation,
  useUpdateSocialLinksMutation,
  useAssignTaskMutation,
  useMoveTaskMutation,
  useAddTaskTagsMutation,
  useDeleteTaskTagsMutation,
} = apiSlice;
