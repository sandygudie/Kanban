import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "components/Popup";
import SelectBox from "components/SelectBox";
import {
  useAssignTaskMutation,
  useEditTaskMutation,
  useGetTaskQuery,
} from "redux/apiSlice";
import Spinner from "components/Spinner";
import { AppState, ISubTask } from "types";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import AddTask from "components/Board/AddTask";
import { DatePicker, DatePickerProps, TimePicker, Tooltip } from "antd";
import { IoAdd } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DefaultImage } from "utilis";
import { HiOutlineChevronLeft } from "react-icons/hi";
import IconButton from "components/IconButton";
import Chat from "components/Chat";
import { getTaskChat } from "services/api/chat";
import { IChat } from "types/chat";
import { RxCheck } from "react-icons/rx";
import { IoPricetagSharp } from "react-icons/io5";
import { IoTimerOutline } from "react-icons/io5";
import AddTaskTag from "components/AddTaskTag";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";
dayjs.extend(relativeTime);

export default function TaskDetails() {
  const serverURL = import.meta.env.VITE_CHAT_API;
  const socket = io(serverURL, {
    withCredentials: true,
  });
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [chats, setChats] = useState<any>([]);
  const [isAssign, setAssign] = useState(false);
  const [currentTime, setTime] = useState<null | any>(null);
  const [isDate, setDate] = useState<null | any>(null);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { workspaceId, taskId }: string | any = useParams();
  const { data: tasks, isLoading } = useGetTaskQuery({ workspaceId, taskId });

  const data: AppState = useSelector(appData);
  const { workspace } = data;

  const [editATask] = useEditTaskMutation();
  const [assignTask] = useAssignTaskMutation();

  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [startChat, setStartChat] = useState<string | boolean>("loading");
  const [isAddLabel, setAddLabel] = useState<boolean>(false);

  useEffect(() => {
    if (tasks?.data) {
      setSelectedColumn(tasks?.data.status);
    }
    loadmessages();
  }, []);

  const loadmessages = async () => {
    try {
      setStartChat("loading");
      const res: any = await getTaskChat(taskId);
      if (res.chats && res.chats.chats.length > 0) {
        setChats(res.chats.chats);
        setStartChat(false);
      } else {
        setChats([]);
        setStartChat(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatedChatsHandler = async (updatedChats: any) => {
    if (updatedChats?._id) {
      const existingChat = chats.find(
        (chat: { _id: string }) => chat._id === updatedChats._id
      );
      setChats(
        existingChat
          ? chats.map((chat: IChat) =>
              chat._id === updatedChats._id ? (chat = updatedChats) : chat
            )
          : [...chats, updatedChats]
      );
    } else {
      await loadmessages();
    }
  };
  const startChathandler = () => {
    setStartChat(false);
  };

  const handleSelectedColumn = (selectedColumn: string) => {
    setSelectedColumn(selectedColumn);
  };

  const handleOnChange = async (id: number) => {
    const updatedSubstasks = tasks.data.subtasks.map(
      (ele: ISubTask, index: number) => {
        index === id;
        return {
          title: ele.title,
          isCompleted: !ele.isCompleted,
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
      await editATask(payload).unwrap();
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

  const assignUsers = async (ele: any) => {
    try {
      const payload = {
        userId: { userId: ele.userId },
        workspaceId: workspaceId,
        taskId: tasks?.data._id,
      };

      await assignTask(payload).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {tasks ? (
        <div className="px-6 overflow-auto h-full mini:pl-20 mini:pr-12 pt-16 pb-36">
          <div className="text-lg flex items-start justify-between relative">
            <div className="absolute -top-[28px] font-bold mini:-top-[40px]">
              {" "}
              <IconButton handleClick={() => navigate(-1)}>
                {" "}
                <HiOutlineChevronLeft />
              </IconButton>
            </div>
            <div>
              {" "}
              <p className="text-2xl mini:text-2xl font-semibold">
                {" "}
                {tasks?.data.title}
              </p>
              <span className="text-gray/80 font-medium mt-1 text-xs mini:flex">
                Created by {tasks.data.createdBy} on{" "}
                {dayjs(tasks.data.createdAt).format("MMM Do, YYYY")}
                <span className="flex items-center">
                  <LuDot className="mini:text-sm text-gray" /> Updated{" "}
                  {dayjs(tasks.data.updatedAt).fromNow()}
                </span>
              </span>
            </div>
            <button
              onClick={() => setOpenMenu(!isOpenMenu)}
              className="mini:text-xl bg-gray/10 hover:bg-gray/30 rounded-md p-2"
            >
              <FiMoreVertical />
            </button>
            {isOpenMenu && (
              <Popup
                className="right-8 top-5"
                items={[
                  {
                    title: (
                      <div className="flex items-center gap-x-2">
                        <CiEdit className="text-sm" /> Edit
                      </div>
                    ),
                    handler: () => {
                      setIsOpenEdit(true);
                    },
                  },
                  {
                    title: (
                      <div className="flex items-center w-20 gap-x-2">
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
          <div className="mt-8 flex flex-col md:flex-row md:gap-x-36 justify-between gap-y-12 items-start">
            <div className="w-full">
              <div>
                <p className="font-semibold text-lg mb-2">Description</p>
                <p>
                  {tasks.data.description
                    ? tasks.data.description
                    : "No description"}
                </p>
              </div>

              <div className="my-10">
                <p className="font-semibold">{`Subtasks (${filtered?.length} of ${tasks.data.subtasks.length})`}</p>
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
                          className="bg-gray/20 flex items-center gap-x-2 rounded-md p-3 mt-2"
                        >
                          <input
                            type="checkbox"
                            value={subtask.title}
                            checked={subtask.isCompleted}
                            onChange={() => handleOnChange(index)}
                          />
                          <p
                            className={`${
                              subtask.isCompleted && "line-through opacity-50"
                            } text-sm font-medium`}
                          >
                            {subtask.title}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="md:pb-6 w-full">
                <p className="font-semibold mb-2">Columns</p>
                <SelectBox
                  selectedColumn={selectedColumn}
                  handleSelectedColumn={handleSelectedColumn}
                  tasks={tasks?.data}
                  isOpenEdit={isOpenEdit}
                  workspaceId={workspaceId}
                />
              </div>
            </div>

            <div className="w-full">
              <div className="relative mb-8">
                <div className="flex items-center gap-x-20">
                  <p className="font-semibold mb-2 w-full md:w-[45%] flex items-center gap-x-2">
                    <MdOutlineAssignmentInd /> Assignees
                  </p>
                  <IconButton handleClick={() => setAssign(true)}>
                    <IoAdd
                      size={28}
                      className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                    />
                  </IconButton>
                </div>

                {tasks.data.assignTo.length ? (
                  <div>
                    {tasks.data.assignTo.slice(0, 2).map((list: any) => {
                      return (
                        <div
                          key={list._id}
                          className="py-1 font-bold text-[0.8rem] flex items-start gap-x-3"
                        >
                          {list.profilePics ? (
                            <img
                              className="w-6 h-6 rounded-full"
                              src={list.profilePics}
                              alt="profile pic"
                            />
                          ) : (
                            <span className="h-[30px] w-[30px] text-sm p-1 overflow-hidden rounded-full border-[1px] hover:border-primary flex items-center justify-center flex-col font-bold">
                              {DefaultImage(list.name)}
                            </span>
                          )}
                          <span className="font-semibold">{list.name}</span>
                        </div>
                      );
                    })}
                    {tasks.data.assignTo.length > 2 && (
                      <div className="ml-2 flex items-center gap-x-2 font-bold mt-2">
                        {" "}
                        <span>
                          <IoAdd />
                        </span>
                        {tasks.data.assignTo.slice(2).map((list: any) => {
                          return (
                            <button
                              key={list._id}
                              className="avatar w-auto h-auto"
                            >
                              <Tooltip color={"#2b2929"} title={list.name}>
                                {list.profilePics ? (
                                  <img
                                    className="w-6 h-6 rounded-full"
                                    src={list.profilePics}
                                    alt="profile pic"
                                  />
                                ) : (
                                  <span className="h-[30px] w-[30px] text-sm p-1 overflow-hidden rounded-full border-[1px] hover:border-primary flex items-center justify-center flex-col font-bold">
                                    {DefaultImage(list.name)}
                                  </span>
                                )}
                              </Tooltip>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray/50 h-16 text-xs">None yet</p>
                )}
                {isAssign && (
                  <Popup
                    className="left-0 w-72 top-[30px]"
                    handleClose={() => setAssign(false)}
                    items={workspace?.members.map((ele: any) => {
                      return {
                        title: (
                          <div className="py-1 px-4 font-bold text-[0.8rem] flex items-center gap-x-3">
                            {tasks.data.assignTo.map((user: { _id: string }) =>
                              user._id == ele.userId ? (
                                <p className="absolute left-2" key={user._id}>
                                  <RxCheck size={15} />
                                </p>
                              ) : null
                            )}
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
                            <span className="font-medium">{ele.name}</span>
                          </div>
                        ),
                        handler: () => {
                          assignUsers(ele);
                        },
                      };
                    })}
                  />
                )}
              </div>

              <div className="relative">
                <div className="flex items-center gap-x-20">
                  <p className="font-semibold mb-2 w-full md:w-[45%] flex items-center gap-x-2">
                    {" "}
                    <IoPricetagSharp />
                    Tags
                  </p>
                  <IconButton
                    handleClick={() => {
                      setAddLabel(true);
                    }}
                  >
                    <IoAdd
                      size={28}
                      className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                    />
                  </IconButton>
                </div>

                {tasks.data.tags.length ? (
                  <div className="mt-4 mb-10 flex items-center gap-2 flex-wrap">
                    {tasks.data.tags.map(
                      (
                        list: { name: string; color: string },
                        index: number
                      ) => {
                        return (
                          index < 10 && (
                            <p
                              style={{ backgroundColor: list.color }}
                              key={list.name}
                              className="px-3 py-1 w-fit text-xs font-bold rounded-full flex items-center gap-x-3"
                            >
                              {list.name}
                            </p>
                          )
                        );
                      }
                    )}
                    {tasks.data.tags.length > 10 && (
                      <button
                        onClick={() => {
                          setAddLabel(true);
                        }}
                        className="inline underline font-bold"
                      >
                        {" "}
                        + {tasks.data.tags.length - 10} more
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray/50 h-16 text-xs">None yet</p>
                )}
              </div>

              <div className="relative">
                <p className="font-semibold mb-4 flex items-center gap-x-2">
                  {" "}
                  <span>
                    <IoTimerOutline className="font-bold" />
                  </span>
                  Deadline
                </p>
                <div className="flex items-start text-white/50 flex-col gap-y-2">
                  {tasks?.data.dueDate.length > 0 || isDate ? (
                    <div className="flex items-center relative gap-x-4">
                      <p className="text-xs font-medium mb-2 w-16">Due Date</p>
                      <div className="">
                        {tasks?.data.dueDate.length > 0 && (
                          <p
                            className={`${
                              pendingDate > 1 ? "text-success" : "text-error"
                            } font-bold absolute left-24 text-xs -top-[2.2rem]`}
                          >
                            ( {pendingDate} days left)
                          </p>
                        )}
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
                          className="px-3 py-[10px] hover:!bg-gray/30 focus:!gray/30 outline-none border-none hover:border-none bg-gray"
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      className="font-medium bg-gray/20 hover:bg-gray-200 py-2 px-4 text-xs rounded-md"
                      onClick={() => {
                        setDate(true);
                      }}
                    >
                      Add Date
                    </button>
                  )}
                  {tasks?.data.dueTime || currentTime ? (
                    <div className="flex items-center gap-x-2 md:gap-x-4 mt-2">
                      <p className="text-xs md:text-sm font-medium mb-2 w-16">
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
                      className="bg-gray/20 hover:bg-gray/30 text-xs font-medium py-2 mt-2 px-4 rounded-md"
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
          <Chat
            startChathandler={startChathandler}
            updatedChatsHandler={updatedChatsHandler}
            taskId={taskId}
            chats={chats}
            socket={socket}
            startChat={startChat}
          />
        </div>
      ) : isLoading || !tasks ? (
        <div className="flex-col items-center justify-center h-full flex">
          <Spinner />
        </div>
      ) : null}

      <Modal
        open={isOpenEdit || isOpenDelete || isAddLabel}
        handleClose={() => {
          setIsOpenEdit(false), setIsOpenDelete(false);
          setAddLabel(false);
        }}
      >
        {isAddLabel ? (
          <AddTaskTag
            taskTags={tasks?.data.tags}
            taskId={taskId}
            handleClose={() => setAddLabel(false)}
          />
        ) : isOpenEdit ? (
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
