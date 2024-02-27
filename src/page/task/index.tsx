import { FiMoreVertical } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "components/Popup";
import { useDispatch } from "react-redux";
import SelectBox from "components/SelectBox";
import { useGetBoardQuery, useGetTaskQuery } from "redux/apiSlice";
import Spinner from "components/Spinner";
import { ISubTask } from "types";
import { isCompletedToggle } from "redux/boardSlice";
import IconButton from "components/IconButton";
import { BiArrowBack } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import AddTask from "components/Board/AddTask";

export default function TaskDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { workspaceId, boardId, taskId }: string | any = useParams();
  const { data: tasks, isLoading } = useGetTaskQuery({ workspaceId, taskId });
  const { data: active, isLoading: isLoadingActiveBoard } = useGetBoardQuery({
    workspaceId,
    boardId,
  });
  const [checkedState, setCheckedState] = useState(
    tasks?.data
      ? tasks?.data.subtasks.map((o: ISubTask) => o.isCompleted)
      : false
  );

  const [selectedColumn, setSelectedColumn] = useState<string>();

  useEffect(() => {
    if (tasks?.data) {
      setSelectedColumn(tasks?.data.status);
    }
  }, [tasks]);

  const handleSelectedColumn = (selectedColumn: string) =>
    setSelectedColumn(selectedColumn);
  const handleOnChange = (id: number) => {
    if (id >= 0) {
      const updatedCheckedState = checkedState.map((item: any, index: number) =>
        index === id ? !item : item
      );
      setCheckedState(updatedCheckedState);
      dispatch(isCompletedToggle({ updatedCheckedState, id, tasks }));
    }
  };
  const handleOpenMenu = () => setOpenMenu(false);
  const filtered = tasks?.data?.subtasks.filter(
    (item: ISubTask) => item.isCompleted
  );
  return (
    <>
      {tasks ? (
        <div className="">
          <div className="absolute top-3 left-14">
            <IconButton
              handleClick={() => {
                navigate(`/workspace/${workspaceId}`);
              }}
            >
              <div className="flex text-gray items-center gap-x-2">
                <BiArrowBack className="font-bold text-lg" />{" "}
                <span className="text-xs">Board</span>
              </div>
            </IconButton>
          </div>
          <div className="text-lg font-bold flex mt-6 items-center justify-between">
            <p className="text-3xl"> {tasks?.data.title}</p>{" "}
            <div className="relative">
              <button className="text-3xl hover:text-primary">
                <FiMoreVertical onClick={() => setOpenMenu(!isOpenMenu)} />
              </button>
              {isOpenMenu && (
                <Popup
                  style={{}}
                  items={[
                    {
                      title: (
                        <p className="flex items-center  gap-x-2.5 dark:text-white/80">
                          <CiEdit className="text-gray text-sm" /> Edit
                        </p>
                      ),
                      handler: () => {
                        setIsOpenEdit(true);
                      },
                    },
                    {
                      title: (
                        <p className="flex items-center gap-x-2.5 dark:text-white/80">
                          <MdDelete className="text-error" /> Delete
                        </p>
                      ),
                      handler: () => {
                        setIsOpenDelete(true);
                      },
                    },
                  ]}
                  handleOpenMenu={handleOpenMenu}
                />
              )}
            </div>
          </div>
          <div className="mt-8 w-96">
            <p className="text-gray my-10">
              {tasks.data.description
                ? tasks.data.description
                : "No description"}
            </p>
            <div className="my-3">
              <p className="font-bold mb-2 text-sm">{`Subtasks (${filtered?.length} of ${tasks.data.subtasks.length})`}</p>
              <div
                className={`overflow-y-auto ${
                  tasks.data.subtasks.length >= 4 && "h-[10rem] pr-4"
                }`}
              >
                {tasks?.data.subtasks.map(
                  (subtask: ISubTask, index: number) => {
                    return (
                      <div
                        key={subtask._id}
                        className="dark:bg-secondary bg-offwhite flex items-center gap-x-4 rounded-sm p-4 mt-2"
                      >
                        <input
                          type="checkbox"
                          value={subtask.title}
                          checked={checkedState[index]!}
                          onChange={() => handleOnChange(index)}
                        />
                        <p
                          className={`${
                            checkedState[index]! && "line-through"
                          } text-xs`}
                        >
                          {subtask.title}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="mt-10 pb-6">
              <p className="text-sm font-bold mb-1">Columns</p>
              <SelectBox
                selectedColumn={selectedColumn}
                active={active?.data}
                handleSelectedColumn={handleSelectedColumn}
                tasks={tasks?.data}
                isOpenEdit ={isOpenEdit}
                workspaceId={workspaceId}
              />
            </div>
          </div>
        </div>
      ) : isLoading || isLoadingActiveBoard || !tasks ? (
        <Spinner />
      ) : null}

      <Modal
        open={isOpenEdit || isOpenDelete}
        handleClose={() => {
          setIsOpenEdit(false), setIsOpenDelete(false);
        }}
      >
        {isOpenEdit ? (
          <AddTask
            // active={active?.data}
            selectedColumn={selectedColumn}
            handleSelectedColumn={handleSelectedColumn}
            tasks={tasks?.data}
            handleClose={() => setIsOpenEdit(false)}
          />
        ) : (
          <DeleteItem
            handleClose={() => setIsOpenDelete(false)}
            tasks={tasks?.data}
            workspaceId={workspaceId}
          />
        )}
      </Modal>
    </>
  );
}
