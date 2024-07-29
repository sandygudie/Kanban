import { useState } from "react";
import "./style.css";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { AppState, IColumn, ITask } from "types";
import { useMoveTaskMutation } from "redux/apiSlice";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";

interface Props {
  selectedColumn: string | any;
  tasks?: ITask;
  isOpenEdit: boolean;
  workspaceId?: string;
  handleSelectedColumn: (selectedColumn: string) => void;
  handleClose?: () => void;
}

export default function Index({
  selectedColumn,
  handleSelectedColumn,
  tasks,
  isOpenEdit,
  workspaceId,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);
  const [moveTask] = useMoveTaskMutation();
  const data: AppState = useSelector(appData);
  const { active } = data;

  const handleItemClick = async (title: string, columnId: string) => {
    handleSelectedColumn(title);

    if (isOpenEdit === false) {
      const payload = {
        workspaceId: workspaceId,
        columnId: columnId,
        taskId: tasks?._id,
      };
      await moveTask(payload).unwrap();
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
        <p className="text-sm font-medium">
          {" "}
          {selectedColumn ? selectedColumn : tasks?.status}
        </p>
        {isOpen ? (
          <BiChevronDown className={`icon ${isOpen && "open"}`} />
        ) : (
          <BiChevronUp className={`icon ${isOpen && "open"}`} />
        )}
        {isOpen && (
          <div className={`dropdown-body bg-secondary rounded-md shadow-3xl`}>
            {active?.columns.map((item: IColumn, i: number) => (
              <div
                className={`dropdown-item font-semibold text-sm px-4 py-2.5 hover:bg-gray-200 hover:text-gray cursor-pointer ${
                  i < active?.columns.length && "border-b-[1px] border-gray/10"
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
