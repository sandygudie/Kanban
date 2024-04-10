import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoIosSend } from "react-icons/io";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import { useSelector } from "react-redux";
// import { taskColorMarker } from "utilis";
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
  chats: [];
  updatedChatsHandler: (chats: any) => void;
}
export default function Index({
  updatedChatsHandler,
  chats,
  socket,
  taskId,
}: Props) {
  const [message, setMessage] = useState("");

  const data: AppState = useSelector(appData);
  const { user } = data;

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
    <div className="mt-16 text-center">
      {chats.length > 0 ? (
        chats?.map((ele: IChat, i: number, array: any) => {
          return (
            <div
              key={ele?._id}
              className={`  ${
                ele.createdBy?.id === user.id ? "ml-auto mr-6" : "mr-auto ml-6"
              } my-1 relative cursor-pointer w-fit text-left font-medium block group relative`}
            >
              {array[i - 1]?.createdBy.name !== ele.createdBy?.name && (
                <div>
                  {user.name !== ele.createdBy?.name && (
                    <div className="absolute top-0 -left-10">
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
                        i < taskColorMarker.length ? taskColorMarker[i] : "",
                    }}
                    className="font-semibold"
                  >
                    {ele.createdBy?.name}
                  </p>{" "}
                </div>
              )}
              <p
                className={`${
                  ele.createdBy?.id === user.id
                    ? "rounded-l-2xl rounded-br-2xl"
                    : " rounded-r-2xl rounded-bl-2xl"
                } ${
                  ele.message.length > 30 ? "py-4" : "py-2"
                } bg-gray/20 min-w-24 max-w-72 px-3 text-sm relative`}
              >
                <div
                  className={`-right-10 hidden group-hover:flex rounded-lg shadow-3xl gap-x-2 bg-main -top-5 px-2 py-2 absolute`}
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
                    ele.message.length > 30 ? "absolute -bottom-0 right-3" : ""
                  } pl-2  font-medium text-gray/90 text-[9px]`}
                >
                  {dayjs(ele.updatedAt).format("h:mm A")}
                </span>
              </p>
            </div>
          );
        })
      ) : (
        <div className="pt-20 mx-auto w-full border-t-[1px] border-gray/20 flex flex-col justify-center items-center text-center">
          <img className="w-24 opacity-40" src="/message.png" alt="user-pics" />
          <button className="font-medium bg-primary hover:bg-primary-dark mt-8 text-white px-7 py-3 text-lg rounded-lg">Start a conversation</button>
        </div>
      )}

      <form
        onSubmit={(e) => sendMessage(e)}
        className="hidden flex items-center gap-x-4"
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
    </div>
  );
}
