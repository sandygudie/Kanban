import { ChangeEvent, useState } from "react";
import AddTask from "./AddTask";
import { BsCircleFill } from "react-icons/bs";
import TaskItem from "./TaskItem";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { colorMarker } from "utilis";
import { useDispatch, useSelector } from "react-redux";
import { addTask, appData, deleteTask } from "redux/boardSlice";
import Modal from "components/Modal";
import { AppState, IColumn, ITask } from "types";
import DeleteItem from "components/DeleteItem";
import IconButton from "components/IconButton";
import AddColumn from "./AddColumn";
import { PiDotsThreeBold } from "react-icons/pi";
import Popup from "components/Popup";
import { MdDelete } from "react-icons/md";
import { useMoveTaskMutation, useEditColumnMutation } from "redux/apiSlice";
import { IoIosAdd } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import { App as AntDesign } from "antd";

export default function ActiveBoard() {
  const dispatch = useDispatch();
  const { message } = AntDesign.useApp();
  const [isAddTask, setAddTask] = useState(false);
  const [isAddColumn, setAddColumn] = useState(false);
  const [columnName, setColumnName] = useState<any>("");
  const [isEditColumn, setEditColumn] = useState<string | null>("");
  const [isEditing, setEditing] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isDeleteColumn, setDeleteColumn] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<IColumn>();
  const [moveTask] = useMoveTaskMutation();
  const [editAColumn] = useEditColumnMutation();
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

    dispatch(deleteTask(sourceTask));
    const updatedTasks = {
      ...sourceTask,
      status: result.destination.droppableId,
    };

    const position = result.destination.index;
    dispatch(addTask({ updatedTasks, position }));
    const payload = {
      taskId: sourceTask._id,
      workspaceId: workspace.id,
      columnId: columnId,
      position,
    };

    await moveTask(payload).unwrap();
  };

  const editColumnChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setEditing(true);
    setInputError(false);
    setColumnName(e.target.value);
  };

  const editColumnNameHandler = async (column: IColumn) => {
    if (columnName === "") {
      setEditColumn("");
    } else {
      const foundDuplicate = active.columns.find(
        (ele: IColumn) => ele.name === columnName
      );
      if (!foundDuplicate) {
        const name = columnName.length ? columnName : column.name;
        try {
          await editAColumn({
            columnId: column._id,
            workspaceId: workspace.id,
            formData: { name },
          }).unwrap();

          setColumnName("");
        } catch (error) {
          setInputError(true);
          console.log(error);
        }
        setEditing(false);
        setEditColumn("");
      } else {
        setInputError(true);
        message.error({
          content: "Column name already exist.",
          className: "text-error",
        });
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto overflow-y-hidden h-full">
          <div className="z-10 h-full flex gap-x-10 w-full pt-12 mini:pt-8 px-8 mini:px-14">
            {active.columns?.map((column: IColumn, index: number) => {
              return (
                <div
                  key={column._id}
                  className="w-[240px] cursor-pointer shrink-0"
                >
                  <div className="flex h-10 mb-3 justify-between relative items-center">
                    <div className="flex gap-x-1 items-center justify-between w-10/12 text-xs tracking-widest">
                      <div className="flex items-center gap-x-1 relative">
                        <BsCircleFill
                          style={{
                            fill:
                              index < colorMarker.length
                                ? colorMarker[index]
                                : "",
                          }}
                        />
                        {isEditColumn === column._id ? (
                          <div
                            onMouseLeave={() => {
                              setEditColumn(""),
                                setColumnName(""),
                                setEditing(false),
                                setInputError(false);
                            }}
                            className={`bg-secondary rounded-md px-3 h-10 flex items-center w-full justify-between`}
                          >
                            <input
                              type="text"
                              // value={
                              //   isEditColumn === column._id &&
                              //   columnName.length > 0
                              //     ? columnName
                              //     : column.name
                              // }

                              defaultValue={columnName || column.name}
                              onChange={(e) => editColumnChangeHandler(e)}
                              className={`font-medium text-[14px] p-2 w-full rounded-md cursor-pointer ${
                                inputError
                                  ? "border-error border"
                                  : "border-none"
                              } `}
                            />
                            {isEditing && (
                              <IconButton
                                handleClick={() => {
                                  editColumnNameHandler(column);
                                }}
                              >
                                <BiCheck className="fill-success font-bold text-lg" />
                              </IconButton>
                            )}
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditColumn(column._id);
                            }}
                            className="font-medium text-[12px] rounded-md cursor-pointer p-2 hover:bg-gray-100"
                          >
                            {" "}
                            {column.name}
                          </span>
                        )}
                      </div>
                      {column.tasks.length > 0 && (
                        <p className="text-[14px] font-medium">
                          ({column.tasks.length})
                        </p>
                      )}
                    </div>
                    <div className={`absolute right-0 gap-x-1 items-center`}>
                      <div className="flex flex-col">
                        <IconButton
                          handleClick={() => {
                            setOpenMenu(true), setSelectedColumn(column);
                          }}
                        >
                          <div className="bg-gray-200 p-1 rounded-md">
                            <PiDotsThreeBold className="text-xl font-bold" />
                          </div>
                        </IconButton>

                        {isOpenMenu && selectedColumn?._id === column._id && (
                          <Popup
                            className="right-0 top-7"
                            items={[
                              {
                                title: (
                                  <p className="flex py-1 items-center w-24 text-xs gap-x-2">
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

                  <Droppable droppableId={`${column.name}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="h-full"
                      >
                        {column.tasks?.length > 0 ? (
                          <div className="h-[80%] novisible-scroll overflow-y-auto">
                            <button
                              onClick={() => {
                                setSelectedColumn(column), setAddTask(true);
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
                            {column.tasks.map((tasks: ITask, index: number) => {
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
                            <div className="h-[80%] border-dashed border-[1px] border-gray-300 rounded-md">
                              <button
                                onClick={() => {
                                  setSelectedColumn(column), setAddTask(true);
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

            <div className="mt-14 h-[80%] w-[260px] pr-8 shrink-0">
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
