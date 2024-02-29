import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from "components/Popup";
import { useDispatch } from "react-redux";
import SelectBox from "components/SelectBox";
import {
  useEditTaskMutation,
  useGetBoardQuery,
  useGetTaskQuery,
} from "redux/apiSlice";
import Spinner from "components/Spinner";
import { ISubTask } from "types";
import { isCompletedToggle } from "redux/boardSlice";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import AddTask from "components/Board/AddTask";
import { DatePicker, TimePicker } from "antd";
import { IoAdd } from "react-icons/io5";

export default function TaskDetails() {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const [value, setValue] = useState<null>(null);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { workspaceId, boardId, taskId }: string | any = useParams();
  const { data: tasks, isLoading } = useGetTaskQuery({ workspaceId, taskId });
  const { data: active, isLoading: isLoadingActiveBoard } = useGetBoardQuery({
    workspaceId,
    boardId,
  });
  const [editATask] = useEditTaskMutation();
  const [checkedState, setCheckedState] = useState<boolean[]|any>([]);

  const [selectedColumn, setSelectedColumn] = useState<string>();

  useEffect(() => {
    if (tasks?.data) {
      setSelectedColumn(tasks?.data.status);
      setCheckedState(tasks?.data.subtasks.map((o: ISubTask) => o.isCompleted));
    }
  }, [tasks]);

  const handleSelectedColumn = (selectedColumn: string) => {
    setSelectedColumn(selectedColumn);
  };

  const handleOnChange = async (id: number) => {
    const updatedCheckedState = checkedState.map((item: any, index: number) =>
      index === id ? !item : item
    );
    setCheckedState(updatedCheckedState);
    const updatedSubstasks = tasks.data.subtasks.map(
      (ele: ISubTask, index: number) => {
        index === id;
        return {
          title: ele.title,
          isCompleted: updatedCheckedState[index],
        };
      }
    );
    const payload = {
      formdata: {
        subtasks: updatedSubstasks,
      },
      workspaceId: workspaceId,
      columnId: tasks?.data.columnId,
      taskId: tasks?.data._id,
    };
    const response = await editATask(payload).unwrap();
    if (response) {
      dispatch(isCompletedToggle({ updatedCheckedState, id, tasks }));
    }
  };

  const handleOpenMenu = () => setOpenMenu(false);
  const filtered = tasks?.data?.subtasks.filter(
    (item: ISubTask) => item.isCompleted
  );

  const onChange = (time: any) => {
    setValue(time);
    console.log(value);
  };

  return (
    <>
      {tasks ? (
        <div className="">
          <div className="text-lg font-bold flex mt-3 items-center justify-between">
            <p className="text-3xl"> {tasks?.data.title}</p>{" "}
            <div className="relative">
              <button className="text-3xl hover:text-primary">
                <FiMoreVertical onClick={() => setOpenMenu(!isOpenMenu)} />
              </button>
              {isOpenMenu && (
                <Popup
                  style={{}}
                  items={[
                    {
                      title: (
                        <p className="flex items-center  gap-x-2.5 dark:text-white/80">
                          <CiEdit className="text-gray text-sm" /> Edit
                        </p>
                      ),
                      handler: () => {
                        setIsOpenEdit(true);
                      },
                    },
                    {
                      title: (
                        <p className="flex items-center gap-x-2.5 dark:text-white/80">
                          <MdDelete className="text-error" /> Delete
                        </p>
                      ),
                      handler: () => {
                        setIsOpenDelete(true);
                      },
                    },
                  ]}
                  handleOpenMenu={handleOpenMenu}
                />
              )}
            </div>
          </div>
          <div className="mt-8 ">
            <p className="font-bold text-sm mb-2">Description</p>
            <p className="text-white/50 rounded-md bg-secondary px-6 py-4 w-8/12">
              {tasks.data.description
                ? tasks.data.description
                : "No description"}
            </p>
            <div className="my-14 flex items-center justify-between">
              <div className="w-96">
                <p className="font-bold  text-sm">{`Subtasks (${filtered?.length} of ${tasks.data.subtasks.length})`}</p>
                <div
                  className={`overflow-y-auto ${
                    tasks.data.subtasks.length >= 4 && "h-[10rem] pr-4"
                  }`}
                >
                  {tasks?.data.subtasks.map(
                    (subtask: ISubTask, index: number) => {
                      return (
                        <div
                          key={subtask._id}
                          className="dark:bg-secondary bg-offwhite flex items-center gap-x-4 rounded-sm p-4 mt-2"
                        >
                          <input
                            type="checkbox"
                            value={subtask.title}
                            checked={checkedState[index]!}
                            onChange={() => handleOnChange(index)}
                          />
                          <p
                            className={`${
                              checkedState[index]! && "line-through"
                            } text-xs`}
                          >
                            {subtask.title}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="w-96">
                <p className="font-bold mb-2 text-sm">Assignees</p>
                <button className="p-2  bg-secondary rounded-md">
                  <IoAdd className="text-xl font-bold" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start mt-10">
              <div className=" pb-6 w-96">
                <p className="text-sm font-bold mb-2">Columns</p>
                <SelectBox
                  selectedColumn={selectedColumn}
                  active={active?.data}
                  handleSelectedColumn={handleSelectedColumn}
                  tasks={tasks?.data}
                  isOpenEdit={isOpenEdit}
                  workspaceId={workspaceId}
                />
              </div>
              <div className="w-96 flex items-start flex-col gap-y-2">
                <div>
                  <p className="text-sm font-bold mb-2">Due Date</p>
                  <div>
                    <RangePicker className="px-5 py-[10px] hover:!bg-secondary/30 focus:!bg-secondary/30 outline-none border-none hover:border-none bg-secondary" />
                  </div>
                </div>
                <div>
                  <div>
                    <TimePicker
                      use12Hours
                      format="h:mm a"
                      className="px-5 py-[10px] hover:!bg-secondary/30 focus:!bg-secondary/30 outline-none border-none hover:border-none bg-secondary"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isLoading || isLoadingActiveBoard || !tasks ? (
        <Spinner />
      ) : null}

      <Modal
        open={isOpenEdit || isOpenDelete}
        handleClose={() => {
          setIsOpenEdit(false), setIsOpenDelete(false);
        }}
      >
        {isOpenEdit ? (
          <AddTask
            selectedColumn={selectedColumn}
            handleSelectedColumn={handleSelectedColumn}
            tasks={tasks?.data}
            handleClose={() => setIsOpenEdit(false)}
          />
        ) : (
          <DeleteItem
            handleClose={() => setIsOpenDelete(false)}
            tasks={tasks?.data}
          />
        )}
      </Modal>
    </>
  );
}
