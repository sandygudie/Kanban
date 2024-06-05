import Modal from "components/Modal";
import { useState } from "react";
import { ISubTask, ITask } from "types";
import AddTask from "./AddTask";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { DefaultImage, taskColorMarker } from "utilis";
import dayjs from "dayjs";
import { Progress } from "antd";
import { Tooltip } from "antd";

interface Props {
  tasks: ITask;
  filtered: ISubTask[];
  index: number;
  workspaceId: string;
  boardId: string;
}

export default function TaskItem({
  tasks,
  filtered,
  index,
  workspaceId,
  boardId,
}: Props) {
  const navigate = useNavigate();
  const [isOpenModal, setOpenModal] = useState(false);
  const pendingDays = tasks?.dueDate?.length
    ? dayjs(tasks.dueDate[1]).diff(dayjs(tasks.dueDate[0]), "days")
    : null;

  return (
    <>
      <Draggable key={tasks._id} draggableId={tasks._id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${
                snapshot.isDragging
                  ? "!top-auto !left-auto bg-purple/20"
                  : "bg-transparent"
              } select-none rounded-lg`}
              data-id={index}
              onClick={() => {
                navigate(`/workspace/${workspaceId}/${boardId}/${tasks._id}`);
              }}
            >
              <div
                style={{
                  borderColor:
                    taskColorMarker[Math.abs(tasks.title.length - 20)],
                }}
                className="bg-gray-200 hover:bg-gray-300
              cursor-pointer rounded-lg border-l-2 mb-4 py-3 px-4 relative"
              >
                <p className="font-semibold">{tasks.title} </p>
                <div className="mt-4 mb-4 flex items-end justify-between">
                  <div className="text-xs font-semibold w-16">
                    {" "}
                    {filtered.length}/{tasks.subtasks.length}
                    <div>
                      {" "}
                      <Progress
                        steps={3}
                        showInfo={false}
                        className="!text-white"
                        percent={
                          (filtered.length / tasks.subtasks.length) * 100
                        }
                        strokeColor="#44b774"
                        trailColor="gray"
                        strokeWidth={5}
                      />
                    </div>
                  </div>

                 {tasks.assignTo?.length >0 ? <div className="img_container">
                    {tasks.assignTo.map((list: any) => {
                      return (
                        <div
                          key={list._id}
                          className="avatar w-auto h-auto w-max"
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
                        </div>
                      );
                    })}
                  </div>:null}
                </div>
                <div className="absolute bottom-2 left-4">
                  {tasks?.dueDate?.length > 0 &&
                    (pendingDays! > 0 ? (
                      <p className={`text-[11px] text-success font-semibold`}>
                        {tasks?.dueDate?.length && pendingDays} days left
                      </p>
                    ) : (
                      <p className={`text-[11px] text-error font-semibold`}>
                        Tasks expired
                      </p>
                    ))}
                </div>
              </div>
            </div>
          );
        }}
      </Draggable>

      <Modal open={isOpenModal} handleClose={() => setOpenModal(false)}>
        <AddTask
          tasks={tasks}
          index={index}
          handleClose={() => setOpenModal(false)}
        />
      </Modal>
    </>
  );
}
