import { useEffect, useState } from "react";
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
import { taskColorMarker } from "utilis";
dayjs.extend(relativeTime);

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

  useEffect(() => {
    socket.on("messages", (data: any) => {
      updatedChatsHandler(data);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket, updatedChatsHandler]);

  const sendMessage = (event: any) => {
    event.preventDefault();
    if (socket && message) {
      socket.emit("send_message", {
        createdBy: user,
        taskId,
        message,
      });
      setMessage(" ");
    }
  };

  return (
    <div className="mt-16 text-center pt-6 border-t-[1px] border-gray/10">
      {chats.length > 0 && (
        <div className="relative">
          <h2 className="text-gray/50">
            {chats[0].createdBy.name} started this conversation!
          </h2>

          {chats?.map((ele: IChat, i: number, array: any) => {
            return (
              <div
                key={ele?._id}
                className={`cursor-pointer relative text-left font-medium block`}
              >
                {dayjs(array[i]?.createdAt).isSame(
                  array[i - 1]?.createdAt,
                  "day"
                ) ? (
                  ""
                ) : (
                  <h2 className="text-gray/50 text-center my-6">
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
                          src={user.profilePics}
                          alt="user-pics"
                        />
                      </div>
                    )}
                    <p
                      style={{
                        color:
                          ele.createdBy?.id === user.id
                            ? ""
                            : taskColorMarker[i],
                      }}
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
                      : " rounded-r-2xl mr-auto rounded-bl-2xl"
                  } ${
                    ele.message.length > 30 ? "py-4" : "py-2"
                  } bg-gray/20 min-w-24 w-fit max-w-72 px-3  mt-2 text-sm relative group`}
                >
                  <div
                    className={`-right-10 hidden group-hover:flex rounded-lg shadow-3xl gap-x-2 bg-secondary -top-5 px-2 py-2 absolute`}
                  >
                    <IconButton handleClick={() => ""}>
                      <CgMailReply />
                    </IconButton>
                    <IconButton handleClick={() => ""}>
                      <CiEdit />
                    </IconButton>
                    <IconButton handleClick={() => ""}>
                      <MdDelete className="text-error" />
                    </IconButton>{" "}
                  </div>
                  {ele.message}
                  <span
                    className={`${
                      ele.message.length > 30
                        ? "absolute -bottom-0 right-3"
                        : ""
                    } pl-2 font-medium text-gray/90 text-[9px]`}
                  >
                    {dayjs(ele.updatedAt).format("h:mm A")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!startChat ? (
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
      ) : (
        <form
          onSubmit={(e) => sendMessage(e)}
          className="flex mt-36 items-center gap-x-4"
        >
          <input
            className="rounded-lg p-3 w-full placeholder:text-sm"
            placeholder="Start a conversation"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="bg-primary rounded-xl p-3">
            <IoIosSend className="text-white" />
          </button>
        </form>
      )}
    </div>
  );
}
