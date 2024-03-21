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
import { CiEdit } from "react-icons/ci";
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
console.log(selectedColumn)
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto settings_scroll overflow-y-auto">
          <div className="z-10 h-full flex gap-x-10 w-full pt-12 mini:pt-8 px-8 mini:px-14">
            {active.columns?.map((item: IColumn, index: number) => {
              return (
                <div
                  key={item._id}
                  className="w-[250px] cursor-pointer shrink-0"
                >
                  <div className="flex h-10 mb-3 justify-between relative items-center">
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
                          } w-28 px-2 h-8 font-medium text-white/50 border-none text-[14px] rounded-md ${
                            isEdit && isEditColumn === item._id
                              ? "bg-gray-100"
                              : "border-none"
                          }`}
                        />
                      </div>
                      {item.tasks.length > 0 && (
                        <p className="text-white/50 text-[14px]">
                          ({item.tasks.length})
                        </p>
                      )}
                    </div>
                    <div className={`absolute right-0 gap-x-1 items-center`}>
                      <div className="flex flex-col">
                        <IconButton
                          handleClick={() => {
                            setOpenMenu(true);
                            setSelectedColumn(item);
                            setEditColumn(item._id);
                          }}
                        >
                          <div className="hover:bg-gray-100 hover:text-white text-white/50 px-1.5 mt-1.5 rounded-md">
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
                          <div className="h-[75vh] px-3 pb-6 overflow-y-auto">
                            <button
                               onClick={() => { setSelectedColumn(item),setAddTask(true)}}
                              className="flex items-center justify-center w-full my-3 mx-auto text-center px-3 text-xs py-2 rounded-md hover:text-white/70 text-white/50 bg-gray/10 hover:bg-gray/15"
                            >
                              {" "}
                              <span>
                                {" "}
                                <IoIosAdd size={20} />{" "}
                              </span>{" "}
                              Add card
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
                            <div className="h-[75vh] border-dashed border-[1px] border-gray/15 rounded-md">
                              <button
                                onClick={() => { setSelectedColumn(item),setAddTask(true)}}
                                className="flex items-center justify-center w-[90%] mx-auto mt-3 text-center px-3 text-xs py-2 rounded-md hover:text-white/70 text-white/50 bg-gray/10 hover:bg-gray/15"
                              >
                                {" "}
                                <span>
                                  {" "}
                                  <IoIosAdd size={20} />{" "}
                                </span>{" "}
                                Add card
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
                className="h-full w-full bg-gray/10 hover:bg-gray/15 cursor-pointer flex items-center flex-col justify-center text-center rounded-md"
              >
                <p className="text-lg hover:text-white/70 text-white/50 font-bold flex items-center">
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
