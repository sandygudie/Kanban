import { createSlice } from "@reduxjs/toolkit";
import { IBoard, IColumn, ISubTask, ITask } from "types";
import { loadState, loadWorkspaceData } from "utilis";
import type { RootState } from "./store";
import { apiSlice } from "./apiSlice";

const workspaceData = loadState();
const { board, active, workspace } = workspaceData;
const boardSlice = createSlice({
  name: "boarddata",
  initialState: {
    board,
    active,
    workspace,
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
        active: filteredBoard.find(
          (item: IBoard, index: number) => index === 0
        ),
      };
    },
    addWorkspace: (state, action) => {
      return {
        ...state,
        workspace: action.payload,
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
      state.board.find((ele: IBoard) =>
        ele._id === state.active._id
          ? ele.columns.find((o: IColumn) =>
              o._id === action.payload.selectedColumn._id
                ? (o.name = action.payload.editedText)
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
      console.log(action.payload)
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
              o.name === action.payload.tasks.status
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
                          i === action.payload._id
                            ? (t.isCompleted =
                                action.payload.updatedCheckedState[
                                  action.payload._id
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
      apiSlice.endpoints.getWorkspaceBoard.matchFulfilled,
      (state, { payload }) => {
        const { boards, _id, name } = payload.data;
        state.board = boards;
        state.active = currentWorkspace.activeBoard
          ? state.board.find(
              (item: IBoard) => item._id === currentWorkspace.activeBoard
            )
          : state.board.find((item: IBoard, index: number) => index === 0);
        state.workspace = { id: _id, name };
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
  addColumn
} = boardSlice.actions;
export const appData = (state: RootState) => state.boarddata;
export default boardSlice.reducer;
