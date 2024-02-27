import { useState } from "react";
import "./style.css";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { IBoard, IColumn, ISubTask, ITask } from "types";
import { addTask, deleteTask } from "redux/boardSlice";
import { useDispatch } from "react-redux";
import { useCreateTaskMutation, useDeleteTaskMutation } from "redux/apiSlice";

interface Props {
  selectedColumn: string | any;
  handleSelectedColumn: (selectedColumn: string) => void;
  tasks?: ITask;
  active?: IBoard;
  handleClose?: () => void;
  isOpenEdit: boolean;
  workspaceId?: string;
}

export default function Index({
  selectedColumn,
  handleSelectedColumn,
  tasks,
  active,
  isOpenEdit,
  workspaceId,
}: Props) {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);
  const [createTask] = useCreateTaskMutation();
  const [deleteATask] = useDeleteTaskMutation();

  console.log(isOpenEdit)
  const handleItemClick = async (title: string, columnId: string) => {
    handleSelectedColumn(title);

    if (isOpenEdit === false ) {
      const updatedSubstasks = tasks?.subtasks.map((ele: ISubTask) => {
        return {
          title: ele.title,
          isCompleted: ele.isCompleted,
        };
      });
      const payload = {
        formdata: {
          title: tasks?.title,
          description: tasks?.description,
          subtasks: updatedSubstasks,
        },
        workspaceId: workspaceId,
        columnId: columnId,
      };

      const response = await createTask(payload).unwrap();
      const result = await deleteATask({
        taskId: tasks?._id,
        columnId: tasks?.columnId,
        workspaceId: workspaceId,
      }).unwrap();

      if (response && result) {
        const updatedTasks = {
          ...tasks,
          _id: response.data.taskId,
          columnId:response.data.columnId,
          status: title,
        };
        dispatch(addTask({ updatedTasks, position: 0 }));
        dispatch(deleteTask(tasks));
      }
    }
  };

  return (
    <div className="dropdown mt-2">
      <div
        className={`dropdown-header dark:bg-secondary relative ${
          isOpen && "border-[1px] border-primary"
        }`}
        onClick={toggleDropdown}
      >
        <p className="text-sm">
          {" "}
          {selectedColumn ? selectedColumn : tasks?.status}
        </p>
        {isOpen ? (
          <BiChevronDown className={`icon ${isOpen && "open"}`} />
        ) : (
          <BiChevronUp className={`icon ${isOpen && "open"}`} />
        )}
        {isOpen && (
          <div className={`dropdown-body bg-offwhite dark:bg-secondary`}>
            {active?.columns.map((item: IColumn, i: number) => (
              <div
                className={`dropdown-item text-sm px-4 py-2.5 hover:text-primary cursor-pointer ${
                  i < 2 && "border-b-[1px] border-gray/10"
                }`}
                onClick={(e) =>
                  handleItemClick(
                    String(e.currentTarget.getAttribute("data-title")),
                    String(e.currentTarget.getAttribute("data-id"))
                  )
                }
                key={item._id}
                data-title={item.name}
                data-id={item._id}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
