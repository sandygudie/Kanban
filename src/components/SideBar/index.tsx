import { Dispatch, SetStateAction, useState } from "react";
import { GoSidebarExpand } from "react-icons/go";
import { AppState, IBoard } from "types";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { appData, activeItem } from "redux/boardSlice";
import { IoIosAdd } from "react-icons/io";
import Modal from "components/Modal";
import AddBoard from "components/Board/AddBoard";
import { saveloadWorkspaceData } from "utilis";
import { useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";

interface Props {
  showSidebar: boolean;
  setShowSidebar?: Dispatch<SetStateAction<boolean>>;
}

export default function Index({
  setShowSidebar,
  showSidebar,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const { active, board, workspace } = data;
  const isMobile = useMediaQuery({ query: "(min-width: 700px)" });
  const [isOpenBoard, setOpenBoard] = useState(false);

  return (
    <>
      <>
        <div
          className={`hidden mini:block h-screen fixed z-20 w-[220px] ${
            showSidebar ? "translate-x-0" : "-translate-x-64"
          }`}
        >
          <div
            className={`z-40 bg-secondary ${
              isMobile && "pr-2 pb-24 border-r-[1px] border-gray/20"
            } pt-2 h-full left-0`}
          >
            <div>
              {board.length > 0 && (
                <p className="pl-4 pt-2 pb-4 font-medium text-xs">
                  ALL BOARDS ({board.length})
                </p>
              )}

              <div className="pt-1">
                {board && (
                  <>
                    {board.map((options: IBoard) => {
                      return (
                        <button
                          key={options._id}
                          className={`h-10 w-[13.5rem] px-4 relative flex items-center group justify-between font-semibold cursor-pointer ${`${
                            active?._id === options._id
                              ? "bg-gray-300 rounded-r-full"
                              : "rounded-r-full hover:bg-gray/10"
                          } `} `}
                          onClick={() => {
                            navigate(`/workspace/${workspace.id}`);
                            dispatch(activeItem(options));
                            saveloadWorkspaceData({
                              workspaceId: workspace.id,
                              activeBoard: options._id,
                            });
                          }}
                        >
                          <div className="flex items-center gap-x-2 justify-between">
                            <MdSpaceDashboard />
                            <span
                              className={`${
                                options.name.length > 12
                                  ? "truncate w-[11ch]"
                                  : "w-auto"
                              } block `}
                            >
                              {options.name}
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
                      setOpenBoard(true);
                    }}
                    className="pl-4 mt-8 font-bold cursor-pointer font-medium text-gray hover:text-typography px-3 text-sm"
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
                className="cursor-pointer p-2 rounded-l-full hover:bg-gray/50 bg-gray-200 text-gray hover:text-white border-none inline-flex items-center gap-x-2 text-xs"
              >
                <GoSidebarExpand size={20} />
              </button>
            </div>
          </div>
        </div>
      </>
      <Modal
        open={isOpenBoard}
        handleClose={() => {
          setOpenBoard(false);
        }}
      >
        <AddBoard handleClose={() => setOpenBoard(false)} />
      </Modal>
    </>
  );
}
