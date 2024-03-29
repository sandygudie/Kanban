import { useState } from "react";
import { io } from "socket.io-client";
import { IoIosSend } from "react-icons/io";

const serverURL = "http://localhost:4000";
const socket = io(serverURL);

export default function Index({ taskId }: any) {
  const [username, setUsername] = useState("");
  //   const [task, setRoom] = useState("");

  const joinRoom = () => {
    if (username !== "") {
      socket.emit("join_room", { username, taskId });
    }
  };
  return (
    <div className="mt-24 mb-12">
      <div className="flex items-center gap-x-6">
        <input
          className="rounded-lg p-3 w-full placeholder:text-sm"
          placeholder="Start a conversation"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-primary rounded-xl p-3"
          onClick={() => {
            joinRoom();
          }}
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
}
