import Modal from "components/Modal";
import { useState } from "react";
import { ISubTask, ITask } from "types";
import AddTask from "./AddTask";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { taskColorMarker } from "utilis";
import dayjs from 'dayjs';
import { Progress } from "antd";

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
                  : "bg-white dark:bg-secondary"
              } select-none rounded-lg`}
              data-id={index}
              onClick={() => {
                navigate(`/workspace/${workspaceId}/${boardId}/${tasks._id}`);
              }}
            >
              <div
                style={{
                  borderColor: taskColorMarker[tasks.title.length + index],
                }}
                className="shadow-lg hover:bg-gray-100
              cursor-pointer rounded-lg border-l-2 mb-4 py-3 px-4"
              >
                <p className="font-semibold">{tasks.title} </p>
                <div className="mt-4 mb-2 flex items-center justify-between">
                  <div className="text-xs text-white/50 font-semibold w-16">
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
                        trailColor="#3d3a3a80"
                        strokeWidth={5}
                      />
                    </div>
                  </div>
                  {tasks?.dueDate?.length >0&& (
                    <p className="text-[11px] font-medium text-white/50  ">
                      {tasks?.dueDate?.length &&
                        dayjs(tasks.dueDate[1]).diff(
                          dayjs(tasks.dueDate[0]),
                          "day"
                        )}{" "}
                      days left
                    </p>
                  )}
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
