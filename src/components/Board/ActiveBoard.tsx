import { ChangeEvent, useState } from "react";
import AddTask from "./AddTask";
import { BsCircleFill } from "react-icons/bs";
import TaskItem from "./TaskItem";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { colorMarker} from "utilis";
import { useDispatch, useSelector } from "react-redux";
import { addTask, appData, deleteTask, editColumnName } from "redux/boardSlice";
import { v4 as uuidv4 } from "uuid";
import Modal from "components/Modal";
import { AppState, IColumn, ISubTask, ITask } from "types";
import DeleteItem from "components/DeleteItem";
import IconButton from "components/IconButton";
import AddColumn from "./AddColumn";
import { PiDotsThreeBold } from "react-icons/pi";
import Popup from "components/Popup";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useEditColumnMutation,
} from "redux/apiSlice";

export default function ActiveBoard() {
  const dispatch = useDispatch();
  const [isAddTask, setAddTask] = useState(false);
  const [showColumnOptions, setShowColumnOptions] = useState(false);
  const [isAddColumn, setAddColumn] = useState(false);
  const [isEditColumn, setEditColumn] = useState<string | null>("");
  const [isEdit, setEdit] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isDeleteColumn, setDeleteColumn] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<IColumn>();
  const [createTask] = useCreateTaskMutation();
  const [editAColumn] = useEditColumnMutation();
  const [deleteATask] = useDeleteTaskMutation();
  const data: AppState = useSelector(appData);
  const { active, workspace } = data;

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const activeCopy = { ...active };
    const sourceList = activeCopy.columns.find(
      (item: IColumn) => item.name === result.source.droppableId
    );
    const sourceTask = sourceList?.tasks.find(
      (item: ITask, index: number) => index === result.source.index
    );

    const columnId = activeCopy.columns.find(
      (item: IColumn) => item.name === result.destination.droppableId
    )._id;

    const updatedSubstasks = sourceTask.subtasks.map((ele: ISubTask) => {
      return {
        title: ele.title,
        isCompleted: ele.isCompleted,
      };
    });

    const updatedTasks = {
      ...sourceTask,
      id: uuidv4(),
      status: result.destination.droppableId,
    };
    const position = result.destination.index;
    dispatch(addTask({ updatedTasks, position }));
    dispatch(deleteTask(sourceTask));

    const payload = {
      formdata: {
        title: sourceTask.title,
        description: sourceTask.description,
        subtasks: updatedSubstasks,
      },
      workspaceId: workspace.id,
      columnId: columnId,
    };
    await createTask(payload).unwrap();
    await deleteATask({
      taskId: sourceTask?._id,
      columnId: sourceTask?.columnId,
      workspaceId: workspace.id,
    }).unwrap();
  };

  const editColumnChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false);
    const editedText = e.target.value;
    try {
      const response = await editAColumn({
        columnId: selectedColumn?._id,
        workspaceId: workspace.id,
        formData: { editedText },
      }).unwrap();
      if (response) {
        dispatch(editColumnName({ editedText, selectedColumn }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className=" overflow-x-auto settings_scroll overflow-y-hidden">
          <div className="z-10 h-full flex gap-x-10 w-full pt-8 px-14">
            {active.columns?.map((item: IColumn, index: number) => {
              return (
                <div
                  onMouseOver={() => {
                    setSelectedColumn(item), setShowColumnOptions(true);
                  }}
                  key={item._id}
                  className="w-[250px] cursor-pointer shrink-0"
                >
                  <div className="flex h-10 mb-4 justify-between relative items-center">
                    <div className="flex gap-x-1 items-center justify-between w-10/12 text-gray font-bold uppercase text-xs tracking-widest">
                      <div className="flex items-center gap-x-1">
                        <BsCircleFill
                          style={{
                            fill:
                              index < colorMarker.length
                                ? colorMarker[index]
                                : "",
                          }}
                        />
                        <input
                          onMouseOver={() => {
                            setEdit(true), setEditColumn(item._id);
                            setOpenMenu(false);
                          }}
                          onMouseOut={() => {
                            setEdit(false), setEditColumn("");
                            setOpenMenu(false);
                          }}
                          type="text"
                          value={item.name}
                          onChange={(e) => editColumnChangeHandler(e)}
                          className={`${
                            inputError && "border-error"
                          } w-28 px-2 h-8 border-none text-[14px] rounded-md ${
                            isEdit && isEditColumn === item._id
                              ? "bg-gray/5"
                              : "border-none"
                          }`}
                        />
                      </div>
                      {item.tasks.length > 0 && (
                        <p className="text-gray/40 text-[14px]">
                          ({item.tasks.length})
                        </p>
                      )}
                    </div>
                    <div
                      className={`${
                        showColumnOptions && selectedColumn?._id === item._id
                          ? "flex"
                          : "hidden"
                      }  absolute right-0 gap-x-1 items-center`}
                    >
                      <div className="flex flex-col">
                        <IconButton
                          handleClick={() => {
                            setOpenMenu(true);
                            setEditColumn(item._id);
                          }}
                        >
                          <div className="bg-secondary px-1.5 rounded-md">
                            <PiDotsThreeBold className="text-2xl font-bold" />
                          </div>
                        </IconButton>

                        {isOpenMenu && isEditColumn === item._id && (
                          <Popup
                            style={{ right: "-60px" }}
                            items={[
                              {
                                title: (
                                  <p className="flex py-1 items-center gap-x-2.5 dark:text-white/80">
                                    <CiEdit className="text-gray text-sm" /> Add
                                    card
                                  </p>
                                ),
                                handler: () => {
                                  setAddTask(true);
                                },
                              },
                              {
                                title: (
                                  <p className="flex py-1 items-center gap-x-2.5 dark:text-white/80">
                                    <MdDelete className="text-error" /> Delete
                                  </p>
                                ),
                                handler: () => {
                                  setDeleteColumn(true);
                                },
                              },
                            ]}
                             handleClose={() => setEditColumn("")}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <Droppable droppableId={`${item.name}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="h-full"
                      >
                        {item.tasks?.length > 0 ? (
                          <div className="h-[75vh] pr-2 pb-6 overflow-y-auto">
                            {item.tasks.map((tasks: ITask, index: number) => {
                              const filtered = tasks.subtasks.filter(
                                (item) => item.isCompleted === true
                              );
                              return (
                                <TaskItem
                                  workspaceId={workspace.id}
                                  tasks={tasks}
                                  filtered={filtered}
                                  key={tasks._id}
                                  index={index}
                                  boardId={active._id}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="w-[250px] shrink-0 h-full">
                            <div className="h-[75vh] dark:bg-secondary/20 border-dashed border-[1px] border-gray/20 rounded-lg"></div>
                          </div>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}

            <div className="mt-14 h-[75vh] w-[280px] pr-8 shrink-0">
              <button
                onClick={() => setAddColumn(true)}
                className="h-full w-full bg-gray/5 hover:bg-gray/10 cursor-pointer flex items-center flex-col justify-center text-center rounded-lg"
              >
                <p className="text-lg hover:text-white/70 text-white/50 font-bold">
                  {" "}
                  + Add Column
                </p>
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>

      <Modal
        open={isAddTask || isAddColumn || isDeleteColumn}
        handleClose={() => {
          setAddTask(false), setAddColumn(false);
        }}
      >
        {isAddColumn ? (
          <AddColumn handleClose={() => setAddColumn(false)} />
        ) : isDeleteColumn ? (
          <DeleteItem
            handleClose={() => setDeleteColumn(false)}
            selectedColumn={selectedColumn}
          />
        ) : (
          <AddTask
            activeColumn={selectedColumn}
            handleClose={() => setAddTask(false)}
          />
        )}
      </Modal>
    </>
  );
}
