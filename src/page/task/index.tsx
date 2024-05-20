import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "components/Popup";
import { useDispatch } from "react-redux";
import SelectBox from "components/SelectBox";
import {
  useAssignTaskMutation,
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DefaultImage } from "utilis";
import { HiOutlineChevronLeft } from "react-icons/hi";
import IconButton from "components/IconButton";
import Chat from "components/Chat";
import { getTaskChat } from "services/api/chat";
import { IChat } from "types/chat";
import { RxCheck } from "react-icons/rx";

dayjs.extend(relativeTime);

export default function TaskDetails() {
  const serverURL = import.meta.env.VITE_CHAT_API;
  const socket = io(serverURL);
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const [chats, setChats] = useState<any>([]);
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
  const [assignTask] = useAssignTaskMutation();
  const [checkedState, setCheckedState] = useState<boolean[] | any>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [startChat, setStartChat] = useState(false);

  useEffect(() => {
    if (tasks?.data) {
      setSelectedColumn(tasks?.data.status);
      setCheckedState(tasks?.data.subtasks.map((o: ISubTask) => o.isCompleted));
    }

    loadmessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, tasks]);

  const loadmessages = async () => {
    try {
      const res: any = await getTaskChat(taskId);
      if (res.chats && res.chats.chats.length > 0) {
        setChats(res.chats.chats);
        setStartChat(true);
      } else {
        setChats([]);
        setStartChat(false);
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
    setStartChat(true);
  };

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

  const assignUsers = async (user: any) => {
    try {
      const payload = {
        formdata: {
          name: user.name,
          profilePics: user.profilePics,
        },
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
              className="mini:text-2xl mini:text-xl bg-gray/10 hover:bg-gray/30 rounded-md p-2"
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
          <div className="mt-8">
            <div className="my-8 md:mb-12">
              <p className="font-semibold mb-2">Description</p>
              <p className="rounded-md mini:w-8/12">
                {tasks.data.description
                  ? tasks.data.description
                  : "No description"}
              </p>
            </div>
            <div className="my-10 flex flex-col md:flex-row justify-between gap-x-36 gap-y-8 md:items-start">
              <div className="md:w-[50%]">
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
                          className="bg-gray/20 flex items-center gap-x-2 rounded-sm p-3 mt-2"
                        >
                          <input
                            type="checkbox"
                            value={subtask.title}
                            checked={checkedState[index]! || false}
                            onChange={() => handleOnChange(index)}
                          />
                          <p
                            className={`${
                              checkedState[index]! && "line-through opacity-50"
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

              <div className="relative md:w-[40%]">
                <div className="flex items-center gap-x-20">
                  <p className="font-semibold mb-2 text-sm">Assign task</p>
                  <IconButton handleClick={() => setAssign(true)}>
                    <IoAdd
                      size={25}
                      className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                    />
                  </IconButton>
                </div>

                {tasks.data.assignTo.map((list: any) => {
                  return (
                    <div
                      key={list.name}
                      className="py-1 font-bold text-[0.8rem] flex items-center gap-x-3"
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
                      <span className="font-medium">{list.name}</span>
                    </div>
                  );
                })}
                {isAssign && (
                  <Popup
                    className="left-0 top-[30px]"
                    handleClose={() => setAssign(false)}
                    items={workspace?.data.members.map((ele: any) => {
                      return {
                        title: (
                          <div className="py-1 px-4 font-bold text-[0.8rem] flex items-center gap-x-3">
                            {tasks.data.assignTo.map((user: { name: string }) =>
                              user.name === ele.name ? (
                                <p className="absolute left-2" key={user.name}>
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
            </div>
            <div className="flex flex-col md:flex-row gap-x-36 justify-between gap-y-8 items-start mt-10">
              <div className="md:pb-6 w-full md:w-[50%]">
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
              <div className="md:w-[40%]">
                <p className="text-sm font-semibold mb-4">Labels</p>
                <div className="flex items-start flex-col gap-y-2">
                  {tasks?.data.dueDate.length > 0 || isDate ? (
                    <div className="flex items-center relative gap-x-4">
                      <p className="text-xs md:text-sm font-medium mb-2 w-16">
                        Due Date
                      </p>
                      <div className="">
                        {tasks?.data.dueDate.length > 0 && (
                          <p
                            className={`${
                              pendingDate > 1 ? "text-success" : "text-error"
                            } font-bold absolute -top-7 text-xs my-2`}
                          >
                            {pendingDate} days left
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
                      className="font-medium bg-gray/20 hover:bg-gray/30 py-2 px-4 text-sm rounded-md"
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
                      className="bg-gray/20 hover:bg-gray/30 text-sm font-medium py-2 mt-2 px-4 rounded-md"
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
