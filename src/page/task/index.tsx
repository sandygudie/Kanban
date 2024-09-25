import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "components/Popup";
import SelectBox from "components/SelectBox";
import { App as AntDesign } from "antd";
import {
  useAddTaskAttachmentMutation,
  useAssignTaskMutation,
  useDeleteTaskAttachmentMutation,
  useEditTaskMutation,
  useGetTaskQuery,
} from "redux/apiSlice";
import Spinner from "components/Spinner";
import { AppState, ISubTask } from "types";
import { MdDelete, MdDeleteForever } from "react-icons/md";
import { CiEdit, CiFileOn } from "react-icons/ci";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import AddTask from "components/Board/AddTask";
import { DatePicker, DatePickerProps, TimePicker, Tooltip } from "antd";
import { IoAdd, IoCheckmarkSharp, IoClose } from "react-icons/io5";
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
import { BsArrowsAngleExpand, BsFileEarmarkPdf } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import ViewAttachment from "components/Task/ViewAttachment";
dayjs.extend(relativeTime);

export default function TaskDetails() {
  const { message } = AntDesign.useApp();
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
  const [isAttachmentMenu, setAttachmentMenu] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { workspaceId, taskId }: string | any = useParams();
  const { data: tasks, isLoading } = useGetTaskQuery({ workspaceId, taskId });

  const data: AppState = useSelector(appData);
  const { workspace } = data;
  const [addAttachment, { isLoading: addAttachmentLoading }] =
    useAddTaskAttachmentMutation();
  const [editATask] = useEditTaskMutation();
  const [deleteTaskAttachment, { isLoading: deleteAttachmentLoading }] =
    useDeleteTaskAttachmentMutation();
  const [assignTask] = useAssignTaskMutation();
  const [newLink, setNewLink] = useState<string | boolean>(false);
  const [deleteLink, setDeleteLink] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [startChat, setStartChat] = useState<string | boolean>("loading");
  const [isAddLabel, setAddLabel] = useState<boolean>(false);
  const [isViewAttachmentFile, setViewAttachmentFile] = useState<any>({});

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

  const addAttachmentFile = async (file: File) => {
    setAttachmentMenu(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const payload = {
        taskId: taskId,
        data: formData,
      };
      await addAttachment(payload).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };

  const addAttachmentLink = async () => {
    try {
      const payload = {
        taskId: taskId,
        data: { link: newLink },
      };

      await addAttachment(payload).unwrap();
      setNewLink(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const deleteAttachmentHandler = async (attachmentId: string) => {
    setDeleteLink(attachmentId);
    try {
      const payload = {
        taskId: taskId,
        attachmentId,
      };

      await deleteTaskAttachment(payload).unwrap();
    } catch (error: any) {
      console.log(error);
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
              <span className="mt-1 text-xs md:flex mb-2 text-white/50">
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
              className="text-sm mini:text-xl bg-gray/10 hover:bg-gray/30 rounded-md p-2"
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
          <div className="mt-16 flex flex-col md:flex-row md:gap-x-[20%] justify-between items-start gap-y-2">
            <div className="w-full md:w-[50%]">
              <div className="mb-14">
                <p className="text-[16px] font-medium mb-2">Description</p>
                <p>
                  {tasks.data.description
                    ? tasks.data.description
                    : "No description"}
                </p>
              </div>

              <div className="mb-14">
                <p className="font-medium text-[16px]">{`Subtasks (${filtered?.length} of ${tasks.data.subtasks.length})`}</p>
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

              <div className="w-full mb-14">
                <p className="font-medium text-[16px] mb-2">Columns</p>
                <SelectBox
                  selectedColumn={selectedColumn}
                  handleSelectedColumn={handleSelectedColumn}
                  tasks={tasks?.data}
                  isOpenEdit={isOpenEdit}
                  workspaceId={workspaceId}
                />
              </div>

              <div className="w-full mb-12">
                <div>
                  <div className="flex items-center justify-between mb-4 relative">
                    <p className="font-medium text-[16px]">Attachments</p>
                    {addAttachmentLoading ? (
                      <Spinner />
                    ) : (
                      <IconButton handleClick={() => setAttachmentMenu(true)}>
                        <IoAdd
                          size={24}
                          className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                        />
                      </IconButton>
                    )}
                    {isAttachmentMenu && (
                      <Popup
                        className="right-4 top-5"
                        items={[
                          {
                            title: (
                              <label
                                className="text-white cursor-pointer relative flex items-center gap-x-2 justify-between"
                                htmlFor="file_input"
                              >
                                <CiFileOn className="text-sm" /> File
                                <input
                                  type="file"
                                  size={100000}
                                  id="file_input"
                                  className="absolute top-20 text-sm invisible w-10"
                                  name="profilePics"
                                  accept=".pdf, .jpg, .jpeg, .png"
                                  onChange={(e) => {
                                    if (e.currentTarget.files) {
                                      if (
                                        e.currentTarget.files[0].size > 100000
                                      ) {
                                        message.error({
                                          content:
                                            "image should be less than 100kb.",
                                          className: "text-error",
                                        });
                                        return null;
                                      } else {
                                        addAttachmentFile(
                                          e.currentTarget.files[0]
                                        );
                                      }
                                    }
                                  }}
                                />
                              </label>
                            ),
                            handler: () => {},
                          },

                          {
                            title: (
                              <span className="flex items-center gap-x-2 justify-between">
                                {" "}
                                <BiLink className="text-sm" /> Link
                              </span>
                            ),
                            handler: () => {
                              setNewLink(true);
                            },
                          },
                        ]}
                        handleClose={() => setAttachmentMenu(false)}
                      />
                    )}{" "}
                  </div>

                  {tasks?.data.attachments.length ? (
                    tasks?.data.attachments.map(
                      (ele: {
                        _id: string;
                        url: string;
                        name: string;
                        addDate: string;
                        type: string;
                      }) => {
                        return (
                          <div
                            key={ele._id}
                            className="cursor-pointer my-2 flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-x-4">
                              {ele.type === "image" ? (
                                <img
                                  className="h-8 w-8 rounded-md"
                                  src={ele.url}
                                />
                              ) : ele.type === "pdf" ? (
                                <BsFileEarmarkPdf
                                  size={30}
                                  className="bg-secondary rounded-md p-2 font-bold"
                                />
                              ) : (
                                <div className="">
                                  <BiLink
                                    size={30}
                                    className="bg-secondary rounded-md p-2 font-bold"
                                  />
                                </div>
                              )}
                              <div>
                                {ele.type === "image" || ele.type === "pdf" ? (
                                  <p className="font-semibold text-sm">
                                    {ele.name}
                                  </p>
                                ) : (
                                  <a
                                    target="_blank"
                                    className="text-xs underline"
                                    href={ele.url}
                                    rel="noreferrer"
                                  >
                                    {ele.url}
                                  </a>
                                )}
                                <p className="text-[10px] text-white/50">
                                  {" "}
                                  {dayjs(ele.addDate).format("MMM Do, YYYY")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                              {deleteLink === ele._id &&
                              deleteAttachmentLoading ? (
                                <Spinner />
                              ) : (
                                <button
                                  onClick={() =>
                                    deleteAttachmentHandler(ele._id)
                                  }
                                  className="opacity-0 group-hover:opacity-100"
                                >
                                  <MdDeleteForever
                                    size={25}
                                    className="text-error/80 p-1.5 font-bold"
                                  />
                                </button>
                              )}
                              {(ele.type === "image" || ele.type === "pdf") && (
                                <IconButton
                                  handleClick={() => setViewAttachmentFile(ele)}
                                >
                                  <BsArrowsAngleExpand
                                    size={24}
                                    className="p-1.5 text-white/50 hover:bg-gray/30 rounded-md font-bold"
                                  />
                                </IconButton>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p className="text-gray/50 h-16 text-xs">No Attachments</p>
                  )}
                  <div />
                  {newLink ? (
                    <div className="flex items-center gap-x-3">
                      <BiLink
                        size={25}
                        className=" text-white/50 hover:bg-gray/30 rounded-md font-bold"
                      />
                      <input
                        className="rounded-md p-1.5 w-full"
                        type="url"
                        onChange={(e) => setNewLink(e.target.value)}
                      />
                      {addAttachmentLoading ? (
                        <Spinner />
                      ) : (
                        <>
                          <IconButton handleClick={() => addAttachmentLink()}>
                            <IoCheckmarkSharp
                              className="bold hover:text-success text-success/80"
                              size={18}
                            />
                          </IconButton>
                          <IconButton handleClick={() => setNewLink(false)}>
                            <IoClose
                              size={18}
                              className="bold text-error/80 hover:text-error"
                            />
                          </IconButton>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="w-full md:w-[40%]">
              <div className="relative mb-14">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[16px] mb-2 w-full md:w-[45%] flex items-center gap-x-2">
                    <MdOutlineAssignmentInd className="text-lg text-gray-300" />{" "}
                    Assignees
                  </p>
                  <IconButton handleClick={() => setAssign(true)}>
                    <IoAdd
                      size={24}
                      className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                    />
                  </IconButton>
                </div>

                {tasks.data.assignTo.length ? (
                  <div className="md:ml-4">
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
                          <IoAdd size={18} />
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
                  <p className="text-gray/50 h-16 text-xs">No Assignees</p>
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

              <div className="relative my-10 md:my-14">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[16px] mb-2 w-full md:w-[45%] flex items-center gap-x-2">
                    {" "}
                    <IoPricetagSharp className="text-gray-300 text-lg" />
                    Tags
                  </p>
                  <IconButton
                    handleClick={() => {
                      setAddLabel(true);
                    }}
                  >
                    <IoAdd
                      size={24}
                      className="p-1.5 bg-gray/20 hover:bg-gray/30 rounded-md font-bold"
                    />
                  </IconButton>
                </div>

                {tasks.data.tags.length ? (
                  <div className="mt-4 md:ml-4 mb-10 flex items-center gap-2 flex-wrap">
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
                  <p className="text-gray/50 h-16 text-xs">No Tags</p>
                )}
              </div>

              <div className="relative mb-14">
                <p className="font-medium text-[16px] mb-4 flex items-center gap-x-2">
                  {" "}
                  <span>
                    <IoTimerOutline className="text-gray-300 text-lg" />
                  </span>
                  Deadline
                </p>
                <div className="flex items-start text-white/50 flex-col gap-y-2">
                  {tasks?.data.dueDate.length > 0 || isDate ? (
                    <div className="flex items-center relative gap-x-4">
                      <p className="text-xs mb-2 w-16 text-white/50">
                        Due Date
                      </p>
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
                          className="px-3 py-[10px] !rounded-md hover:!bg-gray/30 focus:!gray/30 outline-none border-none hover:border-none bg-gray"
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
                    <div className="flex items-center gap-x-2 md:gap-x-4 mt-2 ">
                      <p className="text-xs md:text-sm mb-2 w-16 text-white/50">
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
                        className="px-5 py-[10px] !rounded-md hover:!bg-secondary/30 focus:!bg-secondary/30 outline-none border-none hover:border-none bg-secondary"
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
        open={
          isOpenEdit || isOpenDelete || isAddLabel || isViewAttachmentFile._id
        }
        handleClose={() => {
          setIsOpenEdit(false), setIsOpenDelete(false);
          setAddLabel(false);
          setViewAttachmentFile("");
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
        ) : isViewAttachmentFile ? (
          <ViewAttachment ele={isViewAttachmentFile} />
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
