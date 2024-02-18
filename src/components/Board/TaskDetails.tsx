import { AppState, IBoard, IColumn, ISubTask, ITask } from "types";
import { FiMoreVertical } from "react-icons/fi";
import SelectBox from "../SelectBox";
import { useState } from "react";
import Popup from "components/Popup";
import DeleteItem from "components/DeleteItem";
import { useDispatch, useSelector } from "react-redux";
import { appData, isCompletedToggle } from "redux/boardSlice";

interface Props {
  subtasks: ISubTask[];
  tasks: ITask;
  filtered: ISubTask[];
  index: number;
  handleClose: () => void;
  // handleOpenModal: () => void;
}

export default function TaskDetails({
  subtasks,
  tasks,
  filtered,
  handleClose,
  // handleOpenModal,
}: Props) {
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const active: IBoard = data.active;

  const [selectedColumn, setSelectedColumn] = useState<string | any>(
    tasks
      ? active.columns.find((item: IColumn) =>
          item.tasks.find((o) => o == tasks)
        )?.name
      : active.columns.find((item: IColumn) =>
          item.tasks.find((o, index) => index === 0)
        )?.name
  );
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isDeleteTask, setDeleteTask] = useState(false);
  const [checkedState, setCheckedState] = useState(
    subtasks.map((o) => o.isCompleted === true)
  );
  const handleOpenMenu = () => setOpenMenu(false);
  const handleOnChange = (id: number) => {
    if (id >= 0) {
      const updatedCheckedState = checkedState.map((item, index) =>
        index === id ? !item : item
      );
      setCheckedState(updatedCheckedState);
      dispatch(isCompletedToggle({ updatedCheckedState, id, tasks }));
    }
  };

  const editTaskHandler = () => {
    // handleOpenModal();
    handleClose();
  };

  return (
    <>
      {!isDeleteTask ? (
        <>
          <div className="text-lg font-bold flex items-center justify-between">
            <p className=""> {tasks.title}</p>{" "}
            <div className="relative">
              <button className="text-3xl hover:text-primary">
                <FiMoreVertical onClick={() => setOpenMenu(!isOpenMenu)} />
              </button>
              {isOpenMenu && (
                <Popup
                  style={{}}
                  items={[
                    {
                      title: "Edit Task",
                      handler: editTaskHandler,
                    },
                    {
                      title: "Delete Task",
                      handler: () => {
                        setDeleteTask(true);
                      },
                    },
                  ]}
                  handleOpenMenu={handleOpenMenu}
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray my-6">
              {tasks.description ? tasks.description : "No description"}
            </p>
            <p className=" text-sm font-bold mb-2 ">{`Subtasks (${filtered.length} of ${tasks.subtasks.length})`}</p>
            <div
              className={`overflow-y-auto ${
                tasks.subtasks.length >= 4 && "h-[10rem] pr-4"
              }`}
            >
              {subtasks.map((subtask: ISubTask, index: number) => {
                return (
                  <div
                    key={index}
                    className="dark:bg-secondary-dark bg-offwhite flex items-center gap-x-4 rounded-sm p-3 mt-2"
                  >
                    <input
                      type="checkbox"
                      value={subtask.title}
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                    />
                    <p
                      className={`${
                        checkedState[index] && "line-through"
                      } text-xs`}
                    >
                      {subtask.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pb-6">
            <p className="text-sm font-bold mb-1">Column</p>
            <SelectBox
              selectedColumn={selectedColumn}
              handleClose={handleClose}
              setSelectedColumn={setSelectedColumn}
              tasks={tasks}
            />
          </div>
        </>
      ) : (
        <DeleteItem
          handleClose={() => {
            setDeleteTask(false), handleClose();
          }}
    
          tasks={tasks}
          name={tasks.title}
        />
      )}
    </>
  );
}
