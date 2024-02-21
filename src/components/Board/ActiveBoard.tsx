import { ChangeEvent, useCallback, useState } from "react";
import AddTask from "./AddTask";
import { BsCircleFill } from "react-icons/bs";
import TaskItem from "./TaskItem";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import { colorMarker, colorSelection } from "utilis";
import { useDispatch, useSelector } from "react-redux";
import { addTask, appData, deleteTask, editColumnName } from "redux/boardSlice";
import { v4 as uuidv4 } from "uuid";
import { IoIosAdd } from "react-icons/io";
import Modal from "components/Modal";
import { AppState, IColumn, ITask } from "types";
import DeleteItem from "components/DeleteItem";
import { PiDotsThreeBold } from "react-icons/pi";
import { IoPencil } from "react-icons/io5";
import { FcCheckmark } from "react-icons/fc";
import IconButton from "components/IconButton";
import { IoCloseOutline } from "react-icons/io5";
import AddColumn from "./AddColumn";

export default function ActiveBoard() {
  const dispatch = useDispatch();
  const [isAddTask, setAddTask] = useState(false);
  const [showColumnOptions, setShowColumnOptions] = useState(false);
  const [isAddColumn, setAddColumn] = useState(false);
  const [isEditColumn, setEditColumn] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isDeleteColumn, setDeleteColumn] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<IColumn>();
  const data: AppState = useSelector(appData);
  const { active } = data;

  const onDragEnd = useCallback((result: any) => {
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
    dispatch(deleteTask(sourceTask));
    const updatedTasks = {
      ...sourceTask,
      id: uuidv4(),
      status: result.destination.droppableId,
    };
    const position = result.destination.index;
    dispatch(addTask({ updatedTasks, position }));
  }, []);

  const addCard = () => {
    setAddTask(true);
  };

  const editColumnHandler = () => {
    if (!editedText.length) {
      setInputError(true);
    } else {
      setEditColumn(false);
      dispatch(editColumnName({ editedText, selectedColumn }));
    }
  };

  const deleteColumnHandler = () => {
    setDeleteColumn(true);
  };

  const editColumnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false);
    const editedText = e.target.value;
    dispatch(editColumnName({ editedText, selectedColumn }));
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-[90vh] mb-10">
          <div className="z-10 h-full flex gap-x-10 w-full">
            {active.columns?.map((item: IColumn, index: number) => {
              return (
                <div
                  onMouseOver={() => {
                    setSelectedColumn(item), setShowColumnOptions(true);
                  }}
                  // onMouseOut={() => setShowColumnOptions(false)}
                  key={item.name}
                  className="w-[250px] cursor-pointer shrink-0"
                >
                  <div className="flex  h-10 justify-between relative items-center ">
                    <div
                      className="flex gap-x-1 items-center text-gray 
            font-bold uppercase text-xs tracking-widest"
                    >
                      <BsCircleFill
                        style={{
                          fill:
                            index < colorMarker.length
                              ? colorMarker[index]
                              : colorSelection(),
                        }}
                      />
                      {isEditColumn && selectedColumn?._id === item._id ? (
                        <input
                          type="text"
                          value={editedText}
                          onChange={(e) => editColumnChangeHandler(e)}
                          className={`${
                            inputError && "border-error"
                          } border-[1px] w-20 rounded-md py-1 px-2`}
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditColumn(true),
                              setSelectedColumn(item),
                              setEditedText(item.name);
                          }}
                          className={`${
                            item?.name.length > 10
                              ? "truncate w-[10ch]"
                              : "w-fit"
                          } p-[3px] rounded-md border border-offwhite dark:border-black cursor-text hover:border-gray/10 border-[1px] `}
                        >
                          {" "}
                          {item.name}
                        </span>
                      )}
                      {item.tasks.length > 0 ? item.tasks.length : null}
                    </div>
                    <div
                      className={`${
                        showColumnOptions && selectedColumn?._id === item._id
                          ? "flex"
                          : "hidden"
                      }  absolute right-0 gap-x-1 items-center`}
                    >
                      {isEditColumn && selectedColumn?._id === item._id ? (
                        <>
                          <IconButton handleClick={() => setEditColumn(false)}>
                            <IoCloseOutline className="text-error text-lg font-bold" />
                          </IconButton>
                          <IconButton handleClick={editColumnHandler}>
                            {<FcCheckmark className="text-lg font-bold" />}
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          handleClick={() => {
                            setEditColumn(true),
                              setSelectedColumn(item),
                              setEditedText(item.name);
                          }}
                        >
                          <IoPencil className="text-sm font-bold" />
                        </IconButton>
                      )}

                      <IconButton
                        handleClick={() => {
                          setSelectedColumn(item), deleteColumnHandler();
                        }}
                      >
                        {" "}
                        <PiDotsThreeBold className="text-gray text-3xl font-bold " />
                      </IconButton>

                      <div className="flex flex-col">
                        <IconButton
                          handleClick={() => {
                            addCard();
                          }}
                        >
                          <IoIosAdd className="text-gray text-xl font-bold" />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <Droppable droppableId={`${item.name}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mt-4 h-full hover:bg"
                      >
                        {item.tasks?.length > 0 ? (
                          item.tasks.map((tasks: ITask, index: number) => {
                            const filtered = tasks.subtasks.filter(
                              (item) => item.isCompleted === true
                            );
                            return (
                              <TaskItem
                                tasks={tasks}
                                filtered={filtered}
                                key={tasks._id}
                                index={index}
                              />
                            );
                          })
                        ) : (
                          <div className="w-[250px] shrink-0 h-full">
                            <div className="h-screen dark:bg-secondary/20 border-dashed border-[1px] border-gray/20 rounded-lg"></div>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}

            <div className="mt-14 h-screen w-[280px] pr-8 shrink-0">
              <button
                onClick={() => setAddColumn(true)}
                className="h-full w-full bg-primary/10 hover:bg-primary/20 cursor-pointer flex items-center flex-col justify-center text-center rounded-lg"
              >
                <p className="text-lg hover:text-primary text-primary/50 font-bold">
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
