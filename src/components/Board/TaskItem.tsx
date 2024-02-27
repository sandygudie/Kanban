import Modal from "components/Modal";
import { useState } from "react";
import { ISubTask, ITask } from "types";
import AddTask from "./AddTask";

import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { colorSelection } from "utilis";

interface Props {
  tasks: ITask;
  filtered: ISubTask[];
  index: number;
  workspaceId: string;
 boardId:string
}

export default function TaskItem({
  tasks,
  filtered,
  index,
  workspaceId,
  boardId
}: Props) {
  const navigate = useNavigate();

  const [isOpenModal, setOpenModal] = useState(false);

  // const handleOpenModal = () => setOpenModal(true);

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
                navigate(
                  `/workspace/${workspaceId}/${boardId}/${tasks._id}`
                );
              }}
            >
              <div
                style={{
                  borderColor: colorSelection(),
                }}
                className="shadow-lg hover:bg-gray/10
              cursor-pointer rounded-lg border-l-2 mb-4 py-6 px-4"
              >
                <p className="font-bold text-sm">{tasks.title} </p>
                <p className="pt-2 text-xs text-white/50 font-bold">
                  {" "}
                  {filtered.length} of {tasks.subtasks.length} subtasks
                </p>
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
