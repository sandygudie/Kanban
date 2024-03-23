import { createSlice } from "@reduxjs/toolkit";
import { IBoard, IColumn, ISubTask, ITask } from "types";
import { loadState, loadWorkspaceData } from "utilis";
import type { RootState } from "./store";
import { apiSlice } from "./apiSlice";

const workspaceData = loadState();
const { board, active, workspace, user } = workspaceData;

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

    updateUserProfile: (state, action) => {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
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

    editBoard: (state, action) => {
      const updatedBoard: IBoard[] = state.board.map((item: IBoard) =>
        item._id === state.active._id ? { ...item, ...action.payload } : item
      );
      return {
        ...state,
        board: updatedBoard,
        active: updatedBoard.find(
          (item: IBoard) => item._id === action.payload._id
        ),
      };
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
    addColumn: (state, action) => {
      state.board.find((ele: IBoard) =>
        ele._id === state.active._id
          ? (ele.columns = ele.columns.concat(action.payload))
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item._id === state.active._id
      );
    },
    editColumnName: (state, action) => {
      console.log(action.payload)
      state.board.find((ele: IBoard) =>
        ele._id === state.active._id
          ? ele.columns.find((o: IColumn) =>
              o._id === action.payload.selectedColumn._id
                ? (o.name = action.payload.name)
                : null
            )
          : null
      );
      state.active = state.board.find(
        (item: IBoard) => item._id === state.active._id
      );
    },

    deleteColumn: (state, action) => {
      state.board.find((ele: IBoard) =>
        ele._id === state.active._id
          ? ele.columns.find((o: IColumn) =>
              o._id === action.payload._id
                ? (ele.columns = ele.columns.filter(
                    (s) => s._id !== action.payload._id
                  ))
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

    isCompletedToggle: (state, action) => {
      state.board.find((item: IBoard) =>
        item.name === state.active.name
          ? item.columns.find((o: IColumn) =>
              o.name === action.payload.tasks.status
                ? o.tasks.map((s: ITask) =>
                    s._id === action.payload.tasks._id
                      ? s.subtasks.map((t: ISubTask, i: number) =>
                          i === action.payload.id
                            ? (t.isCompleted =
                                action.payload.updatedCheckedState[
                                  action.payload.id
                                ])
                            : t
                        )
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

        const { workspace, userDetails } = payload.data;
        const {
          boards,
          _id,
          name,
          createdAt,
          profilePics,
          createdBy,
          description,
        } = workspace;
        const {
          userid,
          username,
          profilePics: userProfileImage,
          email,
        } = userDetails;
        state.board = boards;
        state.active = currentWorkspace?.activeBoard
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
  isCompletedToggle,
  deleteBoard,
  editBoard,
  addBoard,
  editTask,
  addTask,
  deleteTask,
  addWorkspace,
  deleteColumn,
  editColumnName,
  addColumn,
  updateWorkspace,
  updateUserProfile,
} = boardSlice.actions;
export const appData = (state: RootState) => state.boarddata;
export default boardSlice.reducer;
