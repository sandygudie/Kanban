import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IoIosSend } from "react-icons/io";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import { useSelector } from "react-redux";
import { taskColorMarker } from "utilis";
const serverURL = "http://localhost:4000";
const socket = io(serverURL);

export default function Index({ taskId }: any) {
  const [chats, setChats] = useState<any>([]);
  const [message, setMessage] = useState("");
  const data: AppState = useSelector(appData);
  const { user } = data;

  useEffect(() => {
    socket.emit("getmessage", taskId);
    socket.on("all_tasks_chats", (data) => {
      setChats(data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [taskId]);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("send_message", {
        createdBy: user,
        taskId,
        message,
      });
      setMessage(" ");
    }
  };
  // design the message view
  return (
    <div className="mt-24 mb-12 text-center px-10">
      {chats.length > 0 ? (
        chats?.map((ele: any, i: number, array: any) => {
          return (
            <button
              key={ele.id}
              className={` ${
                ele.createdBy?.id === user.id
                  ? "ml-auto mr-6 rounded-l-2xl rounded-br-2xl"
                  : "mr-auto ml-6 rounded-r-2xl rounded-bl-2xl"
              }  my-4 bg-gray/20 relative w-fit px-4 py-2 font-medium block`}
            >
              {array[i - 1]?.createdBy.name !== ele.createdBy?.name && (
                <div>
                  <div className="absolute -left-10">
                    <img src="" alt="user-pics" />
                  </div>
                  <p
                    style={{
                      color:
                        i < taskColorMarker.length ? taskColorMarker[i] : "",
                    }}
                    className="text-sm text-left pb-2"
                  >
                    {ele[i]}
                    {ele.createdBy?.name}
                  </p>
                </div>
              )}
              <p className="text-sm">{ele.message}</p>
            </button>
          );
        })
      ) : (
        <div className="my-20">
          <h2>No Conversation Yet!</h2>
        </div>
      )}

      <div className="flex items-center gap-x-4">
        <input
          className="rounded-lg p-3 w-full placeholder:text-sm"
          placeholder="Start a conversation"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-primary rounded-xl p-3"
          onClick={() => {
            sendMessage();
          }}
        >
          <IoIosSend className="text-white" />
        </button>
      </div>
    </div>
  );
}
