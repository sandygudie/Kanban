import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Popup from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { activeItem, appData } from "redux/boardSlice";
import { AppState, IBoard } from "types";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { GoScreenFull } from "react-icons/go";
import { MdSpaceDashboard, MdZoomInMap } from "react-icons/md";
import BoardDetails from "./Board/BoardDetails";
import WorkspaceInvite from "./WorkspaceInvite";
import { TbUsersPlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { GoArrowSwitch } from "react-icons/go";
import { GrNewWindow } from "react-icons/gr";
import { DefaultImage, TitleCase, saveloadWorkspaceData } from "utilis";
import { IoIosAdd } from "react-icons/io";
import { FaAnglesRight } from "react-icons/fa6";
import AddBoard from "./Board/AddBoard";
import { removeToken } from "utilis/token";

export default function Header({ memberPics }: any) {
  const domRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const { active, workspace, board, user } = data;
  const [isOpenBoardDetails, setIsOpenBoardDetails] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const [isWorkspaceMenu, setWorkspaceMenu] = useState(false);
  const [isOpenUser, setOpenUser] = useState(false);
  const [viewBoard, setViewBoard] = useState(false);
  const [isFullscreen, setFullScreen] = useState(false);
  const [isOpenBoard, setOpenBoard] = useState(false);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreen(false);
    }
  }
  useEffect(() => {
    const handleClick = (e: any) => {
      if (domRef.current && !domRef.current.contains(e.target)) {
        setViewBoard(false);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <>
      <header className="fixed w-full z-40">
        <div className="h-[50px] mini:h-[65px] flex items-center w-full border-b-[1px] border-gray/20">
          <div
            className={`relative mini:border-r-[1px] w-[220px] border-gray/20 h-[65px] items-start flex-col justify-center cursor-pointer flex`}
          >
            <div className="flex gap-x-2 items-center justify-center relative pl-3">
              <div className="hidden mini:block w-10 h-10 overflow-hidden">
                <img
                  src={workspace?.profilePics}
                  className="w-10 h-10 object-contain"
                  alt=""
                />
              </div>
              <button
                onClick={() => {
                  setWorkspaceMenu(!isWorkspaceMenu);
                }}
                className="flex items-center w-auto rounded-sm relative"
              >
                <h3
                  className={`${
                    workspace?.name.length >= 15
                      ? "truncate overflow-hidden md:w-[130px]"
                      : "w-fit"
                  } font-semibold text-left sm:text-base md:text-lg`}
                >
                  {TitleCase(workspace?.name)}
                </h3>{" "}
                <HiOutlineChevronDown
                  className={`${
                    workspace?.name.length >= 15
                      ? "-right-4 md:-right-2"
                      : "-right-4"
                  } absolute mt-1 text-sm`}
                />
              </button>

              {isWorkspaceMenu && (
                <Popup
                  description={
                    <div className="flex gap-x-3 items-center border-b-[1px] border-gray/10 py-4 font-medium px-4 justify-start">
                      <div className="w-8 h-auto overflow-hidden">
                        <img
                          src={workspace?.profilePics}
                          className="w-10 h-auto object-contain"
                          alt=""
                        />
                      </div>
                      <div className="">
                        <h2 className="font-semibold text-base">
                          {TitleCase(workspace?.name)} workspace
                        </h2>
                      </div>
                    </div>
                  }
                  className="top-8 md:top-12 left-0"
                  handleClose={() => setWorkspaceMenu(false)}
                  items={[
                    {
                      title: (
                        <p className="flex gap-x-3 items-center">
                          <TbUsersPlus className="text-lg" /> Invite members to
                          workspace
                        </p>
                      ),
                      handler: () => {
                        setIsOpenInvite(true), setWorkspaceMenu(false);
                      },
                    },
                    {
                      title: (
                        <p className="flex gap-x-3 items-center">
                          <IoSettingsOutline className="text-lg" />
                          Settings
                        </p>
                      ),
                      handler: () => {
                        navigate("/workspace/settings"),
                          setWorkspaceMenu(false);
                      },
                    },
                    {
                      title: (
                        <p className="flex gap-x-3 items-center">
                          <GoArrowSwitch className="text-lg" /> Available
                          workspace
                        </p>
                      ),
                      handler: () => {
                        navigate("/workspaces"), setWorkspaceMenu(false);
                      },
                    },
                    {
                      title: (
                        <p className="flex gap-x-3 items-center">
                          <GrNewWindow className="text-lg" /> New workspace
                        </p>
                      ),
                      handler: () => {
                        navigate("/workspace/new");
                      },
                    },
                  ]}
                />
              )}
            </div>
          </div>
          <div
            className={`w-full mini:w-[calc(100%_-_220px)] flex items-center gap-x-8 justify-end mini:justify-between px-4 md:px-6`}
          >
            <div className="hidden mini:block">
              {active ? (
                <button
                  onClick={() => setIsOpenBoardDetails(true)}
                  className="rounded-sm items-center py-2 px-4 rounded-md hover:bg-gray-300 bg-gray-200 flex"
                >
                  <span className={`font-bold md:w-auto`}>
                    #{TitleCase(active?.name)}{" "}
                    <span className="hidden sm:inline">Board</span>
                  </span>{" "}
                  <HiOutlineChevronDown className="mt-[0.5px] ml-1 text-sm" />
                </button>
              ) : (
                <Link
                  to={`/workspace/${workspace.id}`}
                  className="mini:text-lg font-bold"
                >
                  Board
                </Link>
              )}
            </div>
            <div className="flex items-center gap-x-8">
              <button
                onClick={() => setIsOpenInvite(true)}
                className="hidden text-white md:block bg-success/90 hover:bg-success px-3 py-2 font-semibold text-sm rounded-md "
              >
                Invite members{" "}
              </button>
              <div
                onClick={() =>
                  navigate("/workspace/settings?members", { state: "Members" })
                }
                className="hover:bg-gray-300 bg-gray-200 border-[1px] cursor-pointer border-solid border-gray-200 rounded-lg p-2 gap-x-4 items-center hidden md:flex"
              >
                <div className="img_container">
                  {memberPics?.map(
                    (
                      ele: { name: string; profilePics: string },
                      index: number
                    ) => (
                      <button
                        className="avatar w-auto h-auto w-max"
                        key={index}
                      >
                        {index <= 4 ? (
                          ele.profilePics == null ? (
                            <p className="w-8 p-0.5 text-xs h-8 rounded-full border border-gray/50 flex flex-col justify-center items-center font-bold">
                              {" "}
                              {DefaultImage(ele.name)}
                            </p>
                          ) : (
                            <img
                              className="w-6 h-6 rounded-full img"
                              src={ele.profilePics}
                            />
                          )
                        ) : null}
                      </button>
                    )
                  )}
                </div>
                <p className="font-semibold text-sm">
                  {memberPics.length} members
                </p>
              </div>
              <button
                onClick={() => toggleFullScreen()}
                className="hidden mini:block font-bold text-gray hover:text-primary text-xl"
              >
                {isFullscreen ? <MdZoomInMap /> : <GoScreenFull />}
              </button>

              <div className="relative">
                {user.profilePics ? (
                  <button
                    onClick={() => setOpenUser(true)}
                    className="border-gray w-max flex flex-col justify-center items-center"
                  >
                    <img
                      className="h-8 w-8 rounded-full border-gray border-[1px] overflow-hidden"
                      src={user.profilePics}
                      alt="user profile"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => setOpenUser(true)}
                    className="h-[30px] w-[30px] mini:h-[40px] mini:w-[40px] text-sm p-1 overflow-hidden rounded-full border-[1px] border-gray hover:border-white flex items-center justify-center flex-col font-bold"
                  >
                    {DefaultImage(user.name)}
                  </button>
                )}
                {isOpenUser && (
                  <Popup
                    className="top-[42px] -right-[6px]"
                    handleClose={() => setOpenUser(false)}
                    items={[
                      {
                        title: (
                          <div className="px-2 py-1">
                            <p className="font-semibold mini:text-lg">
                              {user.name}
                            </p>
                            <span className="text-gray font-medium text-xs">
                              {user.email}
                            </span>
                          </div>
                        ),
                        handler: () => {
                          setOpenUser(false);
                        },
                      },
                      {
                        title: <p className="px-2 py-1.5">User settings</p>,
                        handler: () => {
                          navigate("/workspace/user"), setOpenUser(false);
                        },
                      },
                      {
                        title: (
                          <p className="px-2 py-1.5 text-error font-semibold">
                            Sign out
                          </p>
                        ),
                        handler: () => {
                          removeToken();
                          navigate("/login"),
                            setWorkspaceMenu(false),
                            setOpenUser(false);
                        },
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-auto bg-secondary mini:hidden py-2 bg-gray-100 w-full">
          {board.length > 0 ? (
            <div className="relative px-4">
              <button
                onClick={() => setViewBoard(!viewBoard)}
                className={`font-bold md:w-auto text-sm`}
              >
                <div className="flex">
                  <span className="text-xs sm:inline">
                    ALL BOARDS ({board.length})
                  </span>
                  <HiOutlineChevronDown className="mt-0.5 ml-1 text-sm inline" />
                </div>
              </button>{" "}
              <span>
                <FaAnglesRight className="inline text-xs mx-4 text-gray-300" />{" "}
              </span>
              <button
                onClick={() => setIsOpenBoardDetails(true)}
                className={`${
                  active?.name.length > 12 ? "truncate w-[150px]" : "w-auto"
                } hidden xs:inline text-sm font-medium bg-gray/20 py-2 px-2 rounded`}
              >
                #{TitleCase(active?.name)}
              </button>
              {viewBoard && (
                <div
                  ref={domRef}
                  className={`bg-secondary top-[44px] absolute shadow-3xl rounded-br-lg left-0`}
                >
                  <div className="h-full pb-4">
                    {board && (
                      <>
                        {board.map((options: IBoard) => {
                          return (
                            <button
                              key={options._id}
                              className={`h-10 w-52 px-4 relative flex items-center group justify-between font-semibold cursor-pointer ${
                                active?._id === options._id
                                  ? "bg-gray-300"
                                  : "hover:bg-gray/10"
                              }  `}
                              onClick={() => {
                                navigate(`/workspace/${workspace.id}`);
                                dispatch(activeItem(options));
                                saveloadWorkspaceData({
                                  workspaceId: workspace.id,
                                  activeBoard: options._id,
                                });
                                setViewBoard(false);
                              }}
                            >
                              <div className="flex items-center gap-x-2 justify-between">
                                <MdSpaceDashboard className="text-lg" />
                                <span
                                  className={`${
                                    options.name.length > 13
                                      ? "truncate text-left w-[150px]"
                                      : "w-auto"
                                  } block text-sm`}
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
                        onClick={() => setOpenBoard(true)}
                        className="pl-4 mt-4 font-bold cursor-pointer hover:text-typography"
                      >
                        <div className="flex items-center text-sm mini:text-base mt-4 bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-lg">
                          <span>
                            <IoIosAdd size={20} />
                          </span>
                          <p> Add Board</p>
                        </div>
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="pl-4 py-1 font-bold"> Board</p>
          )}
        </div>
      </header>

      <Modal
        open={isOpenBoardDetails || isOpenInvite || isOpenBoard}
        handleClose={() => {
          setIsOpenBoardDetails(false),
            setIsOpenInvite(false),
            setOpenBoard(false);
        }}
      >
        {isOpenBoardDetails ? (
          <BoardDetails handleClose={() => setIsOpenBoardDetails(false)} />
        ) : isOpenInvite ? (
          <WorkspaceInvite
            handleClose={() => {
              setIsOpenInvite(false);
            }}
            workspaceId={workspace.id}
          />
        ) : (
          <AddBoard handleClose={() => setOpenBoard(false)} />
        )}
      </Modal>
    </>
  );
}
