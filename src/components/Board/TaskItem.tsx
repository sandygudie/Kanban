import Modal from "components/Modal";
import { useState } from "react";
import { ISubTask, ITask } from "types";
import AddTask from "./AddTask";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { taskColorMarker } from "utilis";
import dayjs from "dayjs";
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
  const pendingDays = tasks?.dueDate?.length ? dayjs(tasks.dueDate[1]).diff(
    dayjs(tasks.dueDate[0]),
    "days"
  ): null;

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
                  borderColor: taskColorMarker[tasks.title.length + index],
                }}
                className="bg-gray-200 hover:bg-gray-300
              cursor-pointer rounded-lg border-l-2 mb-4 py-3 px-4"
              >
                <p className="font-semibold">{tasks.title} </p>
                <div className="mt-4 mb-2 flex items-center justify-between">
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
                  {tasks?.dueDate?.length > 0 &&
                    (pendingDays! > 0 ? (
                      <p className={`text-[11px] text-success font-medium`}>
                        {tasks?.dueDate?.length && pendingDays} days left
                      </p>
                    ) : (
                      <p className={`text-[11px] text-error font-medium`}>
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
