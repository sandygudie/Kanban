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

export default function Index({ setShowSidebar, showSidebar }: Props) {
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
                <p className="pl-4 pt-2 pb-4 font-medium text-gray text-[12px]">
                  ALL BOARDS ({board.length})
                </p>
              )}

              {board.length > 0 && (
                <div className="pt-1 pb-4">
                  {board.map((options: IBoard) => {
                    return (
                      <button
                        key={options._id}
                        className={`h-10 w-[13.5rem] px-4 relative rounded-r-full flex items-center group justify-between font-semibold cursor-pointer ${`${
                          active?._id === options._id
                            ? "bg-gray-300"
                            : "hover:bg-gray/10"
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
                          <MdSpaceDashboard className="text-xl" />
                          <span
                            className={`${
                              options.name.length > 12
                                ? "truncate w-[170px] text-left"
                                : "w-auto"
                            } block text-[15px]`}
                          >
                            {options.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {workspace.id ? (
                <button
                  onClick={() => {
                    setOpenBoard(true);
                  }}
                  className="pl-4 text-center mt-6 font-bold cursor-pointer hover:text-typography text-sm"
                >
                  <div className="flex items-center text-white pr-6 justify-center bg-primary hover:bg-primary-hover rounded-lg px-4 py-2.5">
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
