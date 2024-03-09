import { Dispatch, SetStateAction, useState } from "react";
import { GoSidebarExpand } from "react-icons/go";
import Icon from "components/Icon";
import { AppState, IBoard } from "types";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { appData, activeItem } from "redux/boardSlice";
import { IoIosAdd } from "react-icons/io";
import Modal from "components/Modal";
import AddBoard from "components/Board/AddBoard";
import { saveloadWorkspaceData } from "utilis";
import { useNavigate } from "react-router-dom";

interface Props {
  showSidebar: boolean;

  setShowSidebar?: Dispatch<SetStateAction<boolean>>;
  handleClose?: () => void;
  handleaddBoardMobile?: () => void;
}

export default function Index({
  handleaddBoardMobile,
  setShowSidebar,
  handleClose,
  showSidebar,
  // workspaceId,
}: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const { active, board, workspace } = data;
  const isMobile = useMediaQuery({ query: "(min-width: 700px)" });
  const [isOpenBoard, setOpenBoard] = useState(false);

  // console.log(active ,board)
  return (
    <>
      <>
        <div
          className={`h-screen fixed z-20 w-[220px] transition duration-700 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-64"
          }`}
        >
          <div
            className={`z-40 text-gray bg-white dark:bg-secondary ${
              isMobile && "pr-2 pb-24 border-r-[1px] border-gray/20"
            } pt-2 flex flex-col justify-between h-full left-0`}
          >
            <div>
              <p className="pl-4 pt-2 pb-4 text-xs">
                ALL BOARDS ({board.length})
              </p>

              <div className="pt-1">
                {board && (
                  <>
                    {board.map((options: IBoard) => {
                      return (
                        <button
                          key={options._id}
                          className={`h-10 w-[13.5rem] px-4 relative flex items-center group justify-between font-bold cursor-pointer ${`${
                            active?._id === options._id
                              ? "bg-primary rounded-r-full text-white"
                              : "rounded-r-full hover:bg-primary/20"
                          } `} `}
                          onClick={() => {
                            navigate(`/workspace/${workspace.id}`);
                            dispatch(activeItem(options));
                            saveloadWorkspaceData({
                              workspaceId: workspace.id,
                              activeBoard: options._id,
                            });
                            if (handleClose) {
                              handleClose();
                            }
                          }}
                        >
                          <div className="flex items-center gap-x-2 justify-between">
                            <Icon type="board" />
                            <span className="text-sm flex items-center">
                              {" "}
                              <span
                                className={`${
                                  options.name.length > 12
                                    ? "truncate w-[11ch]"
                                    : "w-auto"
                                } block `}
                              >
                                {options.name}
                              </span>
                              <span className="text-sm font-bold pl-1">
                                ({options.columns?.length})
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}

                {workspace.id ? (
                  <button
                    onClick={() => {
                      handleaddBoardMobile
                        ? handleaddBoardMobile()
                        : setIsOpen(true);
                    }}
                    className="pl-4 mt-4 font-bold cursor-pointer text-primary/80 hover:text-primary"
                  >
                    <div className="flex items-center">
                      {" "}
                      <span>
                        {" "}
                        <IoIosAdd size={20} />{" "}
                      </span>{" "}
                      <p> New Board</p>
                    </div>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mb-4 absolute top-0 right-0 md:mb-0">
              <button
                aria-label="Hide Sidebar"
                onClick={() => {
                  setShowSidebar ? setShowSidebar(false) : null;
                }}
                className="cursor-pointer p-2 rounded-l-full bg-primary text-white border-none inline-flex items-center gap-x-2 text-xs"
              >
                <GoSidebarExpand size={20} />
              </button>
            </div>
          </div>
        </div>
      </>
      <Modal
        open={isOpen || isOpenBoard}
        handleClose={() => {
          setIsOpen(false), setOpenBoard(false);
        }}
      >
        {isOpenBoard ? (
          <AddBoard handleClose={() => setOpenBoard(false)} />
        ) : (
          <AddBoard handleClose={() => setIsOpen(false)} />
        )}
      </Modal>
    </>
  );
}
