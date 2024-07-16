import { useSelector } from "react-redux";
import {
  useDeleteBoardMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
  useDeleteWorkspaceMutation,
} from "redux/apiSlice";
import { appData } from "redux/boardSlice";
import { AppState, IColumn, ITask } from "types";
import { Loader } from "./Spinner";
import { useNavigate } from "react-router-dom";
import { App as AntDesign } from "antd";
import { notificationfeed } from "utilis/notification";

interface Props {
  handleClose: () => void;
  tasks?: ITask;
  boardname?: string;
  selectedColumn?: IColumn;
}

export default function Delete({
  handleClose,
  tasks,
  boardname,
  selectedColumn,
}: Props) {
  const navigate = useNavigate();
  const { message } = AntDesign.useApp();
  const [deleteAColumn, { isLoading: isDeletingColumn }] =
    useDeleteColumnMutation();
  const [deleteATask, { isLoading: isDeletingTask }] = useDeleteTaskMutation();
  const [deleteAWorkspace, { isLoading: isDeletingWorkspace }] =
    useDeleteWorkspaceMutation();
  const [deleteABoard, { isLoading: isDeletingBoard }] =
    useDeleteBoardMutation();

  const data: AppState = useSelector(appData);
  const { active, workspace, user } = data;

  const deleteBoardHandler = async () => {
    try {
      const response = await deleteABoard({
        boardId: active._id,
        workspaceId: workspace.id,
      }).unwrap();
      if (response) {
        handleClose();
        await notificationfeed(
          user,
          workspace,
          `Board: ${active?.name}`,
          ``,
          "removed"
        );
      }
    } catch (err: any) {
      console.log(err);
      message.error({
        content: err.message || "Request failed",
        className: "text-error",
      });
    }
  };

  const deleteTaskHandler = async () => {
    try {
      const response = await deleteATask({
        taskId: tasks?._id,
        columnId: tasks?.columnId,
        workspaceId: workspace.id,
      }).unwrap();
      if (response) {
        handleClose();
        await notificationfeed(
          user,
          workspace,
          `Task: ${tasks?.title}`,
          ``,
          "removed"
        );
        navigate(`/workspace/${workspace.id}`);
      }
    } catch (err: any) {
      message.error({
        content: err.message || "Request failed",
        className: "text-error",
      });
    }
  };

  const deleteColumnHandler = async () => {
    try {
      const response = await deleteAColumn({
        columnId: selectedColumn?._id,
        workspaceId: workspace.id,
      }).unwrap();
      if (response) {
        handleClose();
        await notificationfeed(
          user,
          workspace,
          `Column: ${selectedColumn?.name}`,
          ``,
          "removed"
        );
        navigate(`/workspace/${workspace.id}`);
      }
    } catch (err: any) {
      message.error({
        content: err.message || "Request failed",
        className: "text-error",
      });
    }
  };

  const deleteWorkspaceHandler = async () => {
    try {
      const response = await deleteAWorkspace({
        workspaceId: workspace.id,
      }).unwrap();
      if (response.data.workspaceLeft > 0) {
        navigate(`/workspaces`);
      } else {
        navigate(`/workspace/new`);
      }
    } catch (err: any) {
      message.error({
        content: err.message || "Request failed",
        className: "text-error",
      });
    }
  };

  return (
    <div className="md:p-4">
      <h1 className="text-left text-xl text-error font-bold mb-4">
        {" "}
        <span className=""> Delete</span>{" "}
        {boardname
          ? boardname
          : selectedColumn
          ? selectedColumn.name
          : tasks
          ? tasks?.title
          : `${workspace.name}`}
      </h1>
      <p className="text-base">
        Are you sure you want to delete this{" "}
        <span className="font-bold text-lg text-error">
          {selectedColumn
            ? "column"
            : boardname
            ? "board"
            : tasks
            ? "task"
            : "workspace"}
        </span>{" "}
        ?{" "}
        <span className="ml-1">
          {boardname
            ? "This action will remove all columns and tasks in this board."
            : selectedColumn
            ? "This action will remove all tasks from this column."
            : "This action cannot be reversed."}
        </span>
      </p>

      <div className="text-center flex items-center justify-end gap-x-8 mt-8">
        <button
          className="p-2 text-sm md:w-24 text-white h-10 flex justify-center items-center flex-col hover:bg-[#e60023] rounded-md bg-error font-bold"
          type="button"
          onClick={
            boardname
              ? deleteBoardHandler
              : selectedColumn
              ? deleteColumnHandler
              : tasks
              ? deleteTaskHandler
              : deleteWorkspaceHandler
          }
        >
          {" "}
          {isDeletingColumn ||
          isDeletingTask ||
          isDeletingBoard ||
          isDeletingWorkspace ? (
            <Loader />
          ) : (
            "Delete"
          )}
        </button>
        <button
          className="p-2 text-sm md:w-24 font-bold border-[1px] border-gray/30 hover:bg-gray-200 h-10 duration-300 rounded-md"
          type="button"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
