import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Popup from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { activeItem, appData } from "redux/boardSlice";
import { AppState, IBoard } from "types";
// import ToggleBtn from "./ToggleBtn";
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
  // const currentTheme = localStorage.getItem("theme")!;
  // const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  // const updateThemehandler = (theme: string) => setTheme(theme);
  const [isFullscreen, setFullScreen] = useState(false);

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
        <div className="bg-white h-[50px] mini:h-[65px] dark:bg-secondary flex items-center absolute w-full border-b-[1px] border-gray/20">
          <div
            className={`relative mini:border-r-[1px] w-[220px] border-gray/20 h-[65px] items-start flex-col justify-center px-4 cursor-pointer flex`}
          >
            <div className="flex items-center justify-center gap-x-2">
              <div className="w-8 h-auto overflow-hidden">
                <img
                  src={workspace?.profilePics}
                  className="w-auto h-auto object-contain"
                  alt=""
                />
              </div>
              <button
                onClick={() => {
                  setWorkspaceMenu(!isWorkspaceMenu);
                }}
                className="flex items-center rounded-sm relative"
              >
                <h3
                  className={`${
                    workspace?.name.length > 10 ? "truncate w-[10ch]" : "w-auto"
                  } font-bold sm:text-base md:text-xl`}
                >
                  {TitleCase(workspace?.name)}
                </h3>{" "}
                <HiOutlineChevronDown className="mt-1 text-sm" />
              </button>
            </div>
            {isWorkspaceMenu && (
              <Popup
                description={
                  <div className="flex gap-x-6 items-center border-b-[1px] border-gray/10 py-4 dark:text-white text-gray font-medium px-6 justify-start">
                    <div className="w-8 h-auto overflow-hidden">
                      <img
                        src={workspace?.profilePics}
                        className="w-10 h-auto object-contain"
                        alt=""
                      />
                    </div>
                    <div className="dark:text-white text-black">
                      <h2 className="font-semibold text-base">
                        {TitleCase(workspace?.name)} workspace
                      </h2>
                    </div>
                  </div>
                }
                style={{ top: 55, right: -120 }}
                handleClose={() => setWorkspaceMenu(false)}
                items={[
                  {
                    title: (
                      <p className="flex gap-x-3 items-center">
                        <TbUsersPlus /> Invite members
                      </p>
                    ),
                    handler: () => {
                      setIsOpenInvite(true);
                    },
                  },
                  {
                    title: (
                      <p className="flex gap-x-3 items-center">
                        <IoSettingsOutline />
                        Settings
                      </p>
                    ),
                    handler: () => {
                      navigate("/workspace/settings"), setWorkspaceMenu(false);
                    },
                  },
                  {
                    title: (
                      <p className="flex gap-x-3 items-center">
                        <GoArrowSwitch /> Available workspace
                      </p>
                    ),
                    handler: () => {
                      navigate("/workspaces");
                    },
                  },
                  {
                    title: (
                      <p className="flex gap-x-3 items-center">
                        <GrNewWindow /> New workspace
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

          <div
            className={`w-full mini:w-[calc(100%_-_220px)] flex items-center gap-x-8 justify-end mini:justify-between px-4 md:px-6`}
          >
            <div className="hidden mini:block">
              {active ? (
                <button
                  onClick={() => setIsOpenBoardDetails(true)}
                  className="rounded-sm items-center py-2 md:px-4 hover:bg-gray-100 flex"
                >
                  <span className={`font-bold md:w-auto`}>
                    #{TitleCase(active?.name)}{" "}
                    <span className="hidden sm:inline">Board</span>
                  </span>{" "}
                  <HiOutlineChevronDown className="mt-1 text-sm" />
                </button>
              ) : (
                <Link
                  to={`/workspace/${workspace.id}`}
                  className="text-gray/80 font-bold hover:text-white"
                >
                  Board
                </Link>
              )}
            </div>
            <div className="flex items-center gap-x-8">
              <div className="border-[1px] border-solid border-gray-200 rounded-lg px-2 py-1 gap-x-4 items-center hidden mini:flex">
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
                        {ele.profilePics == null ? (
                          <p
                            className="w-8 p-0.5 text-xs h-8 rounded-full border border-gray/50 flex flex-col justify-center items-center font-bold
                      "
                          >
                            {" "}
                            {DefaultImage(ele.name)}
                          </p>
                        ) : (
                          <img
                            className="w-6 h-6 rounded-full img"
                            src={ele.profilePics}
                          />
                        )}
                      </button>
                    )
                  )}
                </div>
                <p className="font-medium text-xs">
                  {memberPics.length} members
                </p>
              </div>
              <button
                onClick={() => toggleFullScreen()}
                className="hidden mini:block font-bold text-gray-200 text-xl"
              >
                {isFullscreen ? <MdZoomInMap /> : <GoScreenFull />}
              </button>
              {/* <ToggleBtn
                updateThemehandler={updateThemehandler}
                theme={theme}
              /> */}
              <div className="relative">
                {user.profilePics ? (
                  <button
                    onClick={() => setOpenUser(true)}
                    className="border-gray w-max flex flex-col justify-center items-center"
                  >
                    <img
                      className="h-8 w-8 p-1 rounded-full overflow-hidden"
                      src={user.profilePics}
                      alt="user profile"
                    />
                  </button>
                ) : (
                  <button  onClick={() => setOpenUser(true)} className="h-[30px] w-[30px] mini:h-[40px] mini:w-[40px] text-sm p-1 overflow-hidden rounded-full border-[1px] hover:border-primary flex items-center justify-center flex-col font-bold">
                    {DefaultImage(user.name)}
                  </button>
                )}
                {isOpenUser && (
                  <Popup
                    style={{ top: 42, right: "-6px" }}
                    handleClose={() => setOpenUser(false)}
                    items={[
                      {
                        title: (
                          <div className="px-2 py-1">
                            <p className="font-bold mini:text-lg">
                              {user.name}
                            </p>
                            <span className="text-gray/50 text-xs">
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
        {board.length && (
          <div className="h-auto xs:h-[45px] bg-secondary absolute top-[50px] left-0 mini:hidden flex flex-col pr-4 items-start bg-gray-100 justify-center w-full">
            <div className="relative">
              <button
                onClick={() => setViewBoard(!viewBoard)}
                className={`font-bold md:w-auto text-sm pl-4`}
              >
                <div className="flex">
                  <span className="text-xs sm:inline">
                    ALL BOARDS ({board.length})
                  </span>

                  <HiOutlineChevronDown className="mt-0.5 text-sm inline " />
                </div>
              </button>{" "}
              <span>
                <FaAnglesRight className="inline text-xs mx-4 text-gray-200" />{" "}
              </span>
              <button
                onClick={() => setIsOpenBoardDetails(true)}
                className={`${
                  active?.name.length > 9
                    ? "truncate w-[9ch] sm:w-auto"
                    : "w-auto"
                } hidden xs:inline text-sm font-medium bg-gray/20 py-1 px-4 rounded`}
              >
                #{TitleCase(active?.name)}
              </button>
              {viewBoard && (
                <div
                  ref={domRef}
                  className={`bg-secondary absolute shadow-2xl rounded-br-lg left-0`}
                >
                  <div className="h-full py-8  ">
                    {board && (
                      <>
                        {board.map((options: IBoard) => {
                          return (
                            <button
                              key={options._id}
                              className={`h-10 w-52 px-4 relative flex items-center group justify-between font-semibold cursor-pointer ${
                                active?._id === options._id
                                  ? "bg-gray-100 rounded-r-full text-white"
                                  : "rounded-r-full hover:bg-primary/20"
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
                              <div className="flex items-center justify-between">
                                <MdSpaceDashboard className="text-lg" />
                                <span
                                  className={`${
                                    options.name.length > 13
                                      ? "truncate w-[13ch]"
                                      : "w-auto"
                                  } block text-base`}
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
                        // onClick={() => {
                        //   handleaddBoardMobile
                        //     ? handleaddBoardMobile()
                        //     : setIsOpen(true);
                        // }}
                        className="pl-4 mt-4 font-bold cursor-pointer text-gray hover:text-white"
                      >
                        <div className="flex items-center text-sm mini:text-base mt-4">
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
              )}
            </div>
          </div>
        )}
      </header>

      <Modal
        open={isOpenBoardDetails || isOpenInvite}
        handleClose={() => {
          setIsOpenBoardDetails(false), setIsOpenInvite(false);
        }}
      >
        {isOpenBoardDetails ? (
          <BoardDetails handleClose={() => setIsOpenBoardDetails(false)} />
        ) : (
          <WorkspaceInvite
            handleClose={() => {
              setIsOpenInvite(false), setWorkspaceMenu(true);
            }}
            workspaceId={workspace.id}
          />
        )}
      </Modal>
    </>
  );
}
