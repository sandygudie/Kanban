import { ChangeEvent, useState } from "react";
import AddTask from "./AddTask";
import { BsCircleFill } from "react-icons/bs";
import TaskItem from "./TaskItem";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { colorMarker } from "utilis";
import { useDispatch, useSelector } from "react-redux";
import { addTask, appData, deleteTask, editColumnName } from "redux/boardSlice";
import Modal from "components/Modal";
import { AppState, IColumn, ISubTask, ITask } from "types";
import DeleteItem from "components/DeleteItem";
import IconButton from "components/IconButton";
import AddColumn from "./AddColumn";
import { PiDotsThreeBold } from "react-icons/pi";
import Popup from "components/Popup";
import { MdDelete } from "react-icons/md";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useEditColumnMutation,
} from "redux/apiSlice";
import { IoIosAdd } from "react-icons/io";

export default function ActiveBoard() {
  const dispatch = useDispatch();
  const [isAddTask, setAddTask] = useState(false);
  const [isAddColumn, setAddColumn] = useState(false);
  const [searchString, setSearchString] = useState<any>("");
  const [isEditColumn, setEditColumn] = useState<string | null>("");
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

    dispatch(deleteTask(sourceTask));

    const updatedTasks = {
      ...sourceTask,
      status: result.destination.droppableId,
    };
    const position = result.destination.index;
    dispatch(addTask({ updatedTasks, position }));
    
    await deleteATask({
      taskId: sourceTask?._id,
      columnId: sourceTask?.columnId,
      workspaceId: workspace.id,
    }).unwrap();

    const payload = {
      formdata: {
        taskId: sourceTask._id,
        title: sourceTask.title,
        description: sourceTask.description,
        subtasks: updatedSubstasks,
        position,
      },
      workspaceId: workspace.id,
      columnId: columnId,
    };
    await createTask(payload).unwrap();
  };

  const editColumnChangeHandler = async (
    e: ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    setInputError(false);
    const name = e.target.value;
    setSearchString(e.target.value);
    try {
      const response = await editAColumn({
        columnId: item?._id,
        workspaceId: workspace.id,
        formData: { name },
      }).unwrap();
      if (response) {
        dispatch(editColumnName({ name, selectedColumn: item }));
      }
      setSearchString("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto novisible-scroll overflow-y-auto">
          <div className="z-10 h-full flex gap-x-10 w-full pt-12 mini:pt-8 px-8 mini:px-14">
            {active.columns?.map((item: IColumn, index: number) => {
              return (
                <div
                  key={item._id}
                  className="w-[240px] cursor-pointer shrink-0"
                >
                  <div className="flex h-10 mb-3 justify-between relative items-center">
                    <div className="flex gap-x-1 items-center justify-between w-10/12 uppercase text-xs tracking-widest">
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
                            setEditColumn(item._id);
                          }}
                          onMouseOut={() => {
                            setEditColumn("");
                          }}
                          type="text"
                          value={
                            isEditColumn === item._id && searchString.length > 0
                              ? searchString
                              : item.name
                          }
                          onChange={(e) => editColumnChangeHandler(e, item)}
                          className={`${
                            inputError && "border-error"
                          } w-28 px-2 h-8 font-medium border-none text-[14px] rounded-md ${
                            isEditColumn === item._id
                              ? "bg-gray-100"
                              : "border-none"
                          }`}
                        />
                      </div>
                      {item.tasks.length > 0 && (
                        <p className="text-[14px] font-medium">
                          ({item.tasks.length})
                        </p>
                      )}
                    </div>
                    <div className={`absolute right-0 gap-x-1 items-center`}>
                      <div className="flex flex-col">
                        <IconButton
                          handleClick={() => {
                            setOpenMenu(true), setSelectedColumn(item);
                          }}
                        >
                          <div className="hover:bg-gray-200 mt-1.5 rounded-md">
                            <PiDotsThreeBold className="text-2xl font-bold" />
                          </div>
                        </IconButton>

                        {isOpenMenu && selectedColumn?._id === item._id && (
                          <Popup
                            className="right-0 top-7"
                            items={[
                              {
                                title: (
                                  <p className="flex py-1 items-center text-xs gap-x-2">
                                    <IoIosAdd size={20} /> Add Card
                                  </p>
                                ),
                                handler: () => {
                                  setAddTask(true);
                                },
                              },
                              {
                                title: (
                                  <p className="flex py-1 text-xs items-center gap-x-2">
                                    <MdDelete
                                      size={20}
                                      className="text-error"
                                    />{" "}
                                    Delete
                                  </p>
                                ),
                                handler: () => {
                                  setDeleteColumn(true);
                                },
                              },
                            ]}
                            handleClose={() => {
                              setOpenMenu(false);
                            }}
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
                          <div className="h-[75vh] pb-6 novisible-scroll overflow-y-auto">
                            <button
                              onClick={() => {
                                setSelectedColumn(item), setAddTask(true);
                              }}
                              className="flex font-medium items-center justify-center w-full my-3 mx-auto text-center text-xs py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                              {" "}
                              <span>
                                {" "}
                                <IoIosAdd size={20} />{" "}
                              </span>{" "}
                              Add Card
                            </button>
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
                            <div className="h-[75vh] border-dashed border-[1px] border-gray-300 rounded-md">
                              <button
                                onClick={() => {
                                  setSelectedColumn(item), setAddTask(true);
                                }}
                                className="flex items-center justify-center w-[90%] font-medium mx-auto mt-3 text-center px-3 text-xs py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                              >
                                {" "}
                                <span>
                                  {" "}
                                  <IoIosAdd size={20} />{" "}
                                </span>{" "}
                                Add Card
                              </button>
                            </div>
                          </div>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}

            <div className="mt-14 h-[75vh] w-[260px] pr-8 shrink-0">
              <button
                onClick={() => setAddColumn(true)}
                className="h-full w-full bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center flex-col justify-center text-center rounded-md"
              >
                <p className="font-bold flex text-gray items-center">
                  {" "}
                  <IoIosAdd size={20} /> Add Column
                </p>
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>

      <Modal
        open={isAddTask || isAddColumn || isDeleteColumn}
        handleClose={() => {
          setAddTask(false), setAddColumn(false), setDeleteColumn(false);
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
