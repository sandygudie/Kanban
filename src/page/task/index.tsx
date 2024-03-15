import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "components/Popup";
import { useDispatch } from "react-redux";
import SelectBox from "components/SelectBox";
import {
  useEditTaskMutation,
  useGetBoardQuery,
  useGetTaskQuery,
  useGetWorkspaceQuery,
} from "redux/apiSlice";
import Spinner from "components/Spinner";
import { ISubTask } from "types";
import { isCompletedToggle } from "redux/boardSlice";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import AddTask from "components/Board/AddTask";
import { DatePicker, DatePickerProps, TimePicker } from "antd";
import { IoAdd } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { RangePickerProps } from "antd/es/date-picker";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import { DefaultImage } from "utilis";
import { HiOutlineChevronLeft } from "react-icons/hi";
import IconButton from "components/IconButton";
dayjs.extend(relativeTime);

export default function TaskDetails() {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const [isAssign, setAssign] = useState(false);
  const [currentTime, setTime] = useState<null | any>(null);
  const [isDate, setDate] = useState<null | any>(null);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { workspaceId, boardId, taskId }: string | any = useParams();
  const { data: tasks, isLoading } = useGetTaskQuery({ workspaceId, taskId });
  const { data: workspace } = useGetWorkspaceQuery(workspaceId);
  const { data: active, isLoading: isLoadingActiveBoard } = useGetBoardQuery({
    workspaceId,
    boardId,
  });
  const [editATask] = useEditTaskMutation();
  const [checkedState, setCheckedState] = useState<boolean[] | any>([]);
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
    try {
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
        dispatch(
          isCompletedToggle({ updatedCheckedState, id, tasks: tasks?.data })
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOpenMenu = () => setOpenMenu(false);
  const filtered = tasks?.data?.subtasks.filter(
    (item: ISubTask) => item.isCompleted
  );

  const onChangeTime = async (timeString: any) => {
    try {
      const payload = {
        formdata: {
          dueTime: timeString,
        },
        workspaceId: workspaceId,
        columnId: tasks?.data.columnId,
        taskId: tasks?.data._id,
      };
      await editATask(payload).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };

  const onChangeDate = async (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    try {
      const payload = {
        formdata: {
          dueDate: dateString,
        },
        workspaceId: workspaceId,
        columnId: tasks?.data.columnId,
        taskId: tasks?.data._id,
      };
      await editATask(payload).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };

  const pendingDate = dayjs(tasks?.data.dueDate[1]).diff(
    dayjs(tasks?.data.dueDate[0]),
    "day"
  );

  return (
    <>
      {tasks ? (
        <div className="px-6 overflow-auto h-full mini:px-20 pt-16 pb-24">
          <div className="text-lg font-bold flex items-start justify-between relative">
            <div className="absolute -top-[28px] mini:-top-[40px]">
              {" "}
              <IconButton handleClick={() => navigate(-1)}>
                {" "}
                <HiOutlineChevronLeft />
              </IconButton>
            </div>
            <div>
              {" "}
              <p className="text-2xl mini:text-3xl"> {tasks?.data.title}</p>
              <span className="text-gray/80 font-thin mt-1 text-xs mini:flex">
                created by {tasks.data.createdBy} on{" "}
                {dayjs(tasks.data.createdAt).format("MMM DD, YYYY")}
                <span className="flex items-center mini:ml-3">
                  <LuDot className="mini:text-sm text-gray" /> updated{" "}
                  {dayjs(tasks.data.updatedAt).fromNow()}
                </span>
              </span>
            </div>
            <button className="text-2xl mini:text-3xl hover:text-primary mt-2">
              <FiMoreVertical onClick={() => setOpenMenu(!isOpenMenu)} />
            </button>
            {isOpenMenu && (
              <Popup
                style={{}}
                items={[
                  {
                    title: (
                      <div className="flex items-center gap-x-2 dark:text-white/80">
                        <CiEdit className="text-gray text-sm" /> Edit
                      </div>
                    ),
                    handler: () => {
                      setIsOpenEdit(true);
                    },
                  },
                  {
                    title: (
                      <div className="flex items-center w-20 gap-x-2 dark:text-white/80">
                        <MdDelete className="text-error" /> Delete
                      </div>
                    ),
                    handler: () => {
                      setIsOpenDelete(true);
                    },
                  },
                ]}
                handleClose={handleOpenMenu}
              />
            )}{" "}
          </div>
          <div className="mt-8">
            <p className="font-semibold text-sm mb-2">Description</p>
            <p className="text-white/50 rounded-md w-8/12">
              {tasks.data.description
                ? tasks.data.description
                : "No description"}
            </p>
            <div className="mt-10 md:my-14 flex flex-col md:flex-row gap-x-36 gap-y-8 md:items-center">
              <div className="md:w-[28rem]">
                <p className="font-semibold text-sm">{`Subtasks (${filtered?.length} of ${tasks.data.subtasks.length})`}</p>
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
                            checked={checkedState[index]! || false}
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

              <div className="relative">
                <p className="font-semibold pb-2 text-sm">Assignees</p>
                <button
                  onClick={() => setAssign(true)}
                  className="p-2 bg-secondary rounded-md"
                >
                  <IoAdd className="text-xl font-bold" />
                </button>

                {isAssign && (
                  <Popup
                    style={{ left: 0, top: 65 }}
                    handleClose={() => setAssign(false)}
                    items={workspace?.data.members.map((ele: any) => {
                      return {
                        title: (
                          <div className="py-1 px-4 font-bold text-[0.8rem] flex items-center gap-x-3">
                            {ele.profilePics ? (
                              <img
                                className="w-6 h-6 rounded-full"
                                src={ele.profilePics}
                                alt="profile pic"
                              />
                            ) : (
                              <span className="h-[30px] w-[30px] text-sm p-1 overflow-hidden rounded-full border-[1px] hover:border-primary flex items-center justify-center flex-col font-bold">
                                {DefaultImage(ele.name)}
                              </span>
                            )}
                            <span>{ele.name}</span>
                          </div>
                        ),
                        handler: () => {},
                      };
                    })}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-36 gap-y-8 items-start mt-10">
              <div className="pb-6 w-full md:w-[28rem]">
                <p className="text-sm font-semibold mb-2">Columns</p>
                <SelectBox
                  selectedColumn={selectedColumn}
                  active={active?.data}
                  handleSelectedColumn={handleSelectedColumn}
                  tasks={tasks?.data}
                  isOpenEdit={isOpenEdit}
                  workspaceId={workspaceId}
                />
              </div>
              <div className="">
                <p className="text-sm font-bold mb-4">Labels</p>
                <div className="flex items-start flex-col gap-y-2">
                  {tasks?.data.dueDate.length > 0 || isDate ? (
                    <div className="flex items-center gap-x-4">
                      <p className="text-xs md:text-sm font-bold mb-2 w-16">
                        Due Date
                      </p>
                      <div className="mini:flex items-center justify-center gap-x-3">
                        <RangePicker
                          onChange={onChangeDate}
                          defaultValue={
                            tasks?.data.dueDate.length > 0
                              ? [
                                  dayjs(tasks?.data.dueDate[0]),
                                  dayjs(tasks?.data.dueDate[1]),
                                ]
                              : [dayjs(), dayjs()]
                          }
                          className="px-3 py-[10px] hover:!bg-secondary/30 focus:!bg-secondary/30 outline-none border-none hover:border-none bg-secondary"
                        />
                        {tasks?.data.dueDate.length > 0 && (
                          <p
                            className={`${
                              pendingDate > 1 ? "text-success" : "text-error"
                            } font-bold text-sm mt-1`}
                          >
                            {pendingDate} days left
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="bg-secondary font-bold py-2 px-4 text-sm rounded-md"
                      onClick={() => {
                        setDate(true);
                      }}
                    >
                      Add Date
                    </button>
                  )}
                  {tasks?.data.dueTime || currentTime ? (
                    <div className="flex items-center gap-x-2 md:gap-x-4">
                      <p className="text-xs md:text-sm font-bold mb-2 w-16">
                        Time
                      </p>
                      <TimePicker
                        defaultValue={
                          tasks?.data.dueTime
                            ? dayjs(tasks?.data.dueTime)
                            : null
                        }
                        use12Hours
                        format="h:mm a"
                        className="px-5 py-[10px] hover:!bg-secondary/30 focus:!bg-secondary/30 outline-none border-none hover:border-none bg-secondary"
                        onChange={onChangeTime}
                      />
                    </div>
                  ) : (
                    <button
                      className="bg-secondary text-sm font-bold py-2 px-4 rounded-md"
                      onClick={() => {
                        setTime(true);
                      }}
                    >
                      Add Time
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isLoading || isLoadingActiveBoard || !tasks ? (
        <div className="flex-col items-center justify-center h-full flex">
          <Spinner />
        </div>
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
