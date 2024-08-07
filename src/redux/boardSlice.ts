import { createSlice } from "@reduxjs/toolkit";
import { AppState, IBoard, IColumn, ITask } from "types";
import { initialState, loadWorkspaceData } from "utilis";
import type { RootState } from "./store";
import { apiSlice } from "./apiSlice";


const { board, active, workspace, user } = initialState

const boardSlice = createSlice({
  name: "boarddata",
  initialState: {
    board,
    active,
    workspace,
    user,
  },

  reducers: {
    activeItem: (state, action) => {
      return {
        ...state,
        active: state.board.find(
          (item: IBoard) => item._id === action.payload._id
        ),
      };
    },

    deleteBoard: (state, action) => {
      const filteredBoard: IBoard[] = state.board.filter(
        (item: IBoard) => item._id !== action.payload._id
      );
      return {
        ...state,
        board: filteredBoard,
        active: state.board.find((item: IBoard, index: number) => index === 0),
      };
    },

    addWorkspace: (state, action) => {
      return {
        ...state,
        workspace: action.payload,
      };
    },

    updateWorkspace: (state, action) => {
      return {
        ...state,
        workspace: { ...state.workspace, name: action.payload.name },
      };
    },

    addBoard: (state, action) => {
      state.board.push(action.payload);
      state.active = state.board.find(
        (item: IBoard) => item._id === action.payload._id
      );
      state.workspace;
    },

    addTask: (state, action) => {
      state.board.find((item: IBoard) =>
        item._id === state.active._id
          ? item.columns.find((o: IColumn) =>
              o.name === action.payload.updatedTasks.status
                ? o.tasks.splice(
                    action.payload.position,
                    0,
                    action.payload.updatedTasks
                  )
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item._id === state.active._id
      );
    },


    deleteTask: (state, action) => {
      state.board.find((item: IBoard) =>
        item.name === state.active.name
          ? item.columns.find((o: IColumn) =>
              o.name === action.payload.status
                ? (o.tasks = o.tasks.filter(
                    (s: any) => s._id !== action.payload._id
                  ))
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item._id === state.active._id
      );
    },

    editTask: (state, action) => {
      state.board.find((item: IBoard) =>
        item.name === state.active.name
          ? item.columns.find((o: IColumn) =>
              o._id === action.payload.tasks.columnId
                ? o.tasks.map((s: ITask) =>
                    s._id === action.payload.values._id
                      ? ((s.title = action.payload.values.title),
                        (s.description = action.payload.values.description),
                        (s.status = action.payload.values.status),
                        (s.subtasks = action.payload.values.subtasks))
                      : s
                  )
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item._id === state.active._id
      );
    },
  },

  extraReducers: (builder) => {
    const currentWorkspace = loadWorkspaceData();

    builder.addMatcher(
      apiSlice.endpoints.getWorkspaceBoards.matchFulfilled,
      (state, { payload }) => {
        const { workspace, userDetails } = payload;

        const {
          boards,
          _id,
          name,
          createdAt,
          profilePics,
          createdBy,
          description,
          socialLinks,
          members
        } = workspace;
        const {
          userid,
          username,
          profilePics: userProfileImage,
          email,
        } = userDetails;
        state.board = boards;
        state.active = state.active?._id
          ? state.board.find((item: IBoard) => item._id === state.active._id)
          : currentWorkspace?.activeBoard
          ? state.board.find(
              (item: IBoard) => item._id === currentWorkspace?.activeBoard
            )
          : state.board.find((item: IBoard, index: number) => index === 0);

        state.workspace = {
          id: _id,
          name,
          createdAt,
          profilePics,
          createdBy,
          description,
          socialLinks,
          members
        };

        state.user = {
          id: userid,
          name: username,
          profilePics: userProfileImage,
          email: email,
        };
      }
    );
  },
});

export const {
  activeItem,
  deleteBoard,
  addBoard,
  editTask,
  addTask,
  deleteTask,
  addWorkspace,
  updateWorkspace,

} = boardSlice.actions;
export const appData = (state: RootState): AppState => state.boarddata;
export default boardSlice.reducer;
