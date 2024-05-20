import { useEffect, useState, useRef, ChangeEvent } from "react";
import dayjs from "dayjs";
import { IoIosSend } from "react-icons/io";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import { useSelector } from "react-redux";
import IconButton from "components/IconButton";
import { CgMailReply } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IChat } from "types/chat";
import relativeTime from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
import { MdClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineUpload } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { Tooltip } from "antd";

interface Props {
  taskId: string;
  socket: any;
  chats: IChat[];
  updatedChatsHandler: (chats: any) => void;
  startChathandler: () => void;
  startChat: boolean;
}
export default function Index({
  updatedChatsHandler,
  chats,
  socket,
  taskId,
  startChat,
  startChathandler,
}: Props) {
  const data: AppState = useSelector(appData);
  const { user } = data;
  const [message, setMessage] = useState("");
  const [editPost, setEditPost] = useState<IChat>();
  const [messageId, setMessageId] = useState("");
  const [postEmoji, setPostEmoji] = useState<{
    postId: string;
    reactions: { emoji: string; users: string[] }[];
  }>({ postId: "", reactions: [] });
  const [inputEmoji, setInputEmoji] = useState(false);
  const [reply, setReply] = useState<IChat | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setInputEmoji(false);
        setPostEmoji({ postId: "", reactions: [] });
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    // socket.emit("messages", taskId);
    socket.on("messages", (data: any) => {
      updatedChatsHandler(data);
    });
    setEditPost(undefined);
    return () => {
      socket.off("receive_message");
    };
  }, [chats, socket, updatedChatsHandler]);

  const sendMessage = (event: any) => {
    event.preventDefault();
    if (socket && message.length > 0) {
      socket.emit("send_message", {
        createdBy: user,
        taskId,
        message,
        replyId: reply ? reply._id : null,
      });
      setMessage(" ");
      setReply(null);
    }
  };

  const handlePostEmoji = (post: IChat, emojiData: any) => {
    const tempData: {
      emoji: string;
      users: string[];
    } = { emoji: "", users: [] };
    let temp = [...post.emojiReactions];
    const updateEmoji: any = temp.find((ele) => ele.emoji === emojiData.emoji);

    if (updateEmoji !== undefined) {
      if (updateEmoji.users.includes(user.name)) {
        updateEmoji.users = updateEmoji.users.filter(
          (username: string) => username !== user.name
        );

        if (!updateEmoji.users.length) {
          temp = temp.filter((ele) => ele.emoji !== emojiData.emoji);
        }
      } else {
        updateEmoji.users.push(user.name);
      }
    } else {
      tempData.emoji = emojiData.emoji;
      tempData.users.push(user.name);
      temp.push(tempData);
    }

    postEmojiHandler(post._id, temp);
  };


  const postEmojiHandler = (postId: string, temp: any) => {
    const updatedEmoji = {
      postId,
      reactions: temp,
    };
    if (socket && postEmoji) {
      socket.emit("post_emoji", updatedEmoji);
    }
  };
  const editPostHandler = (post: IChat) => {
    setEditPost(post);
  };

  const updateEditHandler = () => {
    if (socket && editPost) {
      socket.emit("edit_post", editPost);
    }
    setEditPost(undefined);
  };

  const editHandlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const editValue: IChat | any = { ...editPost, message: e.target.value };
    setEditPost(editValue);
  };

  const deletePostHandler = (postId: string) => {
    // if (socket && postEmoji) {
    socket.emit("delete_post", postId);
    // }
  };

  return (
    <div className="mt-16 text-center pt-6 border-t-[1px] border-gray/10">
      {chats.length > 0 ? (
        <div className="relative">
          <h2 className="text-gray/80">
            {chats[0].createdBy.name} started this conversation!
          </h2>
          {chats?.map((ele: IChat, i: number, array: any) => {
            return (
              <div
                key={ele?._id}
                className={`cursor-pointer relative text-left mt-2 font-medium block`}
              >
                {dayjs(array[i]?.createdAt).isSame(
                  array[i - 1]?.createdAt,
                  "day"
                ) ? (
                  ""
                ) : (
                  <h2 className="text-sm text-gray/50 text-center my-6">
                    {dayjs(array[i]?.createdAt).format("dddd, MMMM Do, YYYY")}
                  </h2>
                )}

                {array[i - 1]?.createdBy.name !== ele.createdBy?.name && (
                  <div
                    className={`${
                      ele.createdBy?.id === user.id
                        ? ""
                        : "flex items-center gap-x-2"
                    }`}
                  >
                    {user.name !== ele.createdBy?.name && (
                      <div className="">
                        <img
                          className="h-8 w-8 p-1 rounded-full overflow-hidden"
                          src={ele.createdBy?.profilePics}
                          alt="user-pics"
                        />
                      </div>
                    )}
                    <p
                      className={`${
                        ele.createdBy?.id === user.id
                          ? "text-right"
                          : "text-left"
                      } font-semibold`}
                    >
                      {ele.createdBy?.id === user.id
                        ? "You"
                        : ele.createdBy?.name}
                    </p>{" "}
                  </div>
                )}
                <div
                  className={`${
                    ele.createdBy?.id === user.id
                      ? "rounded-l-2xl ml-auto rounded-br-2xl"
                      : "rounded-r-2xl mr-auto rounded-bl-2xl"
                  } ${
                    ele.message.length > 30 ? "py-4" : "pt-2"
                  }  bg-gray/20 w-fit max-w-lg px-3 text-sm relative group 
                  
                  ${messageId === ele._id ? "bg-primary" : ""} `}
                >
                  <div
                    ref={emojiRef}
                    className={`${
                      ele.createdBy?.id === user.id ? " right-0 " : "left-0"
                    } absolute bottom-10`}
                  >
                    <EmojiPicker
                      autoFocusSearch={false}
                      open={postEmoji.postId === ele._id}
                      height={350}
                      onEmojiClick={(emojiData) =>
                        handlePostEmoji(ele, emojiData)
                      }
                    />
                  </div>

                  <div
                    className={`-right-8 hidden group-hover:flex rounded-lg shadow-3xl gap-x-3 bg-secondary -top-5 px-2 py-3 absolute`}
                  >
                    <IconButton
                      handleClick={() => {
                        setReply(ele), inputRef.current?.focus();
                      }}
                    >
                      <Tooltip color={"#2b2929"} title="reply">
                        {" "}
                        <div>
                          <CgMailReply size={20} />
                        </div>
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      handleClick={() =>
                        setPostEmoji((prevFormData) => ({
                          ...prevFormData,
                          postId: ele._id,
                        }))
                      }
                    >
                      <Tooltip color={"#2b2929"} title="emoji">
                        <div>
                          <BsEmojiSmile />
                        </div>
                      </Tooltip>
                    </IconButton>
                    {ele.createdBy?.id === user.id && (
                      <IconButton handleClick={() => editPostHandler(ele)}>
                        <Tooltip color={"#2b2929"} title="edit">
                          <div>
                            <CiEdit />
                          </div>
                        </Tooltip>
                      </IconButton>
                    )}
                    {ele.createdBy?.id === user.id && (
                      <IconButton
                        handleClick={() => deletePostHandler(ele._id)}
                      >
                        <Tooltip color={"#2b2929"} title="delete">
                          <div>
                            <MdDelete className="text-error" />
                          </div>
                        </Tooltip>
                      </IconButton>
                    )}
                  </div>
                  {ele.replyTo && (
                    <button
                      onClick={() => setMessageId(ele.replyTo._id)}
                      className="p-2 mb-2 block text-left border-l-4 border-primary bg-gray/20 rounded-lg"
                    >
                      <div className="flex gap-x-1">
                        <img
                          className="h-6 w-6 p-1 rounded-full overflow-hidden"
                          src={ele.replyTo.createdBy.profilePics}
                          alt="user-pics"
                        />
                        <p className="text-sm">{ele.replyTo.createdBy?.name}</p>
                      </div>
                      {ele.replyTo?.message}
                    </button>
                  )}

                  {editPost?._id && editPost?._id === ele._id ? (
                    <div className="py-2">
                      <input
                        type="text"
                        className="rounded-md p-2 w-full"
                        defaultValue={editPost.message}
                        onChange={(e) => editHandlerChange(e)}
                      />
                      <div className="flex items-center gap-x-2 mt-3">
                        <button
                          onClick={() => setEditPost(undefined)}
                          className="py-2 w-20 border-gray/40 text-xs hover:bg-gray/20 font-semibold rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateEditHandler()}
                          className="py-2 w-20 text-xs font-semibold bg-success/80 hover:bg-success rounded-md"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    ele.message
                  )}

                  <span
                    className={`${
                      ele.message.length > 30
                        ? "absolute -bottom-0 right-3"
                        : ""
                    } pl-4 font-medium text-gray/90 justify-end text-[9px] flex items-center gap-x-2`}
                  >
                    {ele.isEdited && (
                      <p className="italic text-[10px]">edited</p>
                    )}{" "}
                    {dayjs(ele.updatedAt).format("h:mm A")}
                  </span>
                </div>
                {ele.emojiReactions.length > 0 && (
                  <div
                    className={`${
                      ele.createdBy?.id === user.id
                        ? "text-right ml-auto"
                        : "text-left mr-auto"
                    } font-semibold flex gap-x-1 items-center w-fit pt-1`}
                  >
                    {ele.emojiReactions.map((ele) => {
                      return (
                        <Tooltip
                          title={`${ele.users.map((emojiUser) =>
                            emojiUser === user.name ? "You" : ` ${emojiUser}`
                          )} reacted with ${ele.emoji}`}
                          key={ele.emoji}
                        >
                          <button
                            className="border-gray/20 border-[1px] rounded-full py-0.5 px-2"
                            key={ele.emoji}
                          >
                            {ele.emoji}
                            <span className="ml-1 text-xs">
                              {" "}
                              {ele.users.length}
                            </span>
                          </button>
                        </Tooltip>
                      );
                    })}
                    <div
                      className={`${
                        ele.emojiReactions.length
                          ? "block h-4 rounded-full px-2"
                          : "hidden"
                      }`}
                    >
                      <IconButton
                        handleClick={() =>
                          setPostEmoji((prevFormData) => ({
                            ...prevFormData,
                            postId: ele._id,
                          }))
                        }
                      >
                        <Tooltip color={"#2b2929"} title="emoji">
                          <div>
                            <BsEmojiSmile />
                          </div>
                        </Tooltip>
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !startChat ? (
        <div className="pt-20 mx-auto w-full flex flex-col justify-center items-center text-center">
          <img className="w-24 opacity-40" src="/message.png" alt="user-pics" />
          <p className="text-gray font-normal text-lg">No messages yet!</p>
          <button
            onClick={() => startChathandler()}
            className="font-medium bg-primary hover:bg-primary-dark mt-4 text-white px-20 py-3 text-lg rounded-lg"
          >
            Start a conversation
          </button>
        </div>
      ) : null}
      {startChat && (
        <form onSubmit={(e) => sendMessage(e)} className="mt-36">
          {reply && (
            <div className="text-left flex mb-2 relative">
              <IconButton handleClick={() => setReply(null)}>
                <MdClose className="absolute right-20 rounded-lg p-2 top-0 text-gray/90 bg-gray/10 hover:bg-gray/30 text-3xl" />
              </IconButton>
              <div className="bg-transparent border-l-2 min-w-4 border-primary border-t-2 rounded-tl-lg"></div>
              <div className="py-1">
                <div className="flex gap-x-1">
                  <img
                    className="h-6 w-6 p-1 rounded-full overflow-hidden"
                    src={reply.createdBy.profilePics}
                    alt="user-pics"
                  />
                  <p className="text-sm">{reply.createdBy.name}</p>
                </div>
                {reply.message}
              </div>
            </div>
          )}
          <div className="flex items-center relative gap-x-4">
            <div ref={emojiRef} className="absolute bottom-12 right-0">
              <EmojiPicker
                open={inputEmoji}
                height="500px"
                onEmojiClick={(emojiData) =>
                  setMessage(message + emojiData.emoji)
                }
              />
            </div>

            <input
              ref={inputRef}
              className={`rounded-lg p-3 w-full placeholder:text-sm`}
              placeholder="Start a conversation"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex gap-x-3 items-center absolute right-20">
    
              <IconButton handleClick={() => setInputEmoji(true)}>
                <Tooltip color={"#2b2929"} title="emoji">
                  <div>
                    <BsEmojiSmile
                      className="text-gray/80 hover:text-gray"
                      size={16}
                    />
                  </div>
                </Tooltip>
              </IconButton>

              <IconButton handleClick={() => ""}>
                <Tooltip title="upload" color={"#2b2929"}>
                  <div>
                    <AiOutlineUpload
                      className="text-gray/80 hover:text-gray"
                      size={16}
                    />
                  </div>
                </Tooltip>
              </IconButton>
            </div>

            <button type="submit" className="bg-primary rounded-xl p-3">
              <IoIosSend className="text-white" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

//separate out reply components
// emojis
