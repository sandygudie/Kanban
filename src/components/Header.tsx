import { useState } from "react";
import Modal from "./Modal";
import Popup from "./Popup";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import ToggleBtn from "./ToggleBtn";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { GoScreenFull } from "react-icons/go";
import { MdZoomInMap } from "react-icons/md";
import BoardDetails from "./Board/BoardDetails";
import WorkspaceInvite from "./WorkspaceInvite";
import { TbUsersPlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { GoArrowSwitch } from "react-icons/go";
import { GrNewWindow } from "react-icons/gr";
import { DefaultImage } from "utilis";

export default function Header() {
  const navigate = useNavigate();
  const data: AppState = useSelector(appData);
  const { active, workspace, user } = data;
  const [isOpenBoardDetails, setIsOpenBoardDetails] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const [isWorkspaceMenu, setWorkspaceMenu] = useState(false);
  const [isOpenUser, setOpenUser] = useState(false);
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const updateThemehandler = (theme: string) => setTheme(theme);
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

  return (
    <>
      <header className="fixed w-full z-40">
        <div className="bg-white h-[65px] dark:bg-secondary flex items-center absolute w-full border-b-[1px] border-gray/20">
          <div
            className={`relative border-r-[1px] w-[220px] border-gray/20 h-[65px] items-start flex-col justify-center px-4 cursor-pointer hidden md:flex`}
          >
            <div className="flex items-center justify-center gap-x-1">
              <div className="w-10 h-10 overflow-hidden">
                <img
                  src={workspace.profilePics}
                  className="w-12 h-12 object-contain"
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
                    workspace.name.length > 10 ? "truncate w-[10ch]" : "w-auto"
                  } font-bold sm:text-base md:text-xl `}
                >
                  {workspace.name}
                </h3>{" "}
                <HiOutlineChevronDown className="mt-1 text-sm" />
              </button>
            </div>
            {isWorkspaceMenu && (
              <Popup
                description={
                  <div className="flex gap-x-6 items-center border-b-[1px] border-gray/10 py-4 dark:text-white text-gray font-medium px-6 justify-start">
                    <div className="w-8 h-8 overflow-hidden">
                      <img
                        src={workspace.profilePics}
                        className="w-10 h-10 object-contain"
                        alt=""
                      />
                    </div>
                    <div className="dark:text-white text-black">
                      <h2 className="font-semibold text-base">
                        {workspace.name} Workspace
                      </h2>
                    </div>
                  </div>
                }
                style={{ top: 55, right: -120 }}
                handleClose={() => setWorkspaceMenu(false)}
                items={[
                  {
                    title: (
                      <p className="flex gap-x-4 items-center">
                        <TbUsersPlus /> Invite people to {workspace.name}
                      </p>
                    ),
                    handler: () => {
                      setIsOpenInvite(true);
                    },
                  },
                  {
                    title: (
                      <p className="flex gap-x-4 items-center">
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
                      <p className="flex gap-x-4 items-center">
                        <GoArrowSwitch /> Available workspace
                      </p>
                    ),
                    handler: () => {
                      navigate("/workspaces");
                    },
                  },
                  {
                    title: (
                      <p className="flex gap-x-4 items-center">
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
            className={`flex items-center w-full justify-between px-4 md:px-6`}
          >
            {active ? (
              <button
                onClick={() => setIsOpenBoardDetails(true)}
                className="flex rounded-sm items-center py-2 px-4 hover:bg-gray/5"
              >
                <span className={`font-bold md:w-auto `}>
                  #{active.name} Board
                </span>{" "}
                <HiOutlineChevronDown className="mt-1 text-sm" />
              </button>
            ) : (
              <Link
                to={`/workspace/${workspace.id}`}
                className="text-gray/50 font-bold"
              >
                Board
              </Link>
            )}

            <div className="flex items-center gap-x-6">
              <button
                onClick={() => toggleFullScreen()}
                className="font-bold text-primary text-xl"
              >
                {isFullscreen ? <MdZoomInMap /> : <GoScreenFull />}
              </button>
              <ToggleBtn
                updateThemehandler={updateThemehandler}
                theme={theme}
              />
              <div className="">
                <button
                  onClick={() => setOpenUser(true)}
                  className="border-gray "
                >
                  {user.profilePics ? (
                    <img
                      className="h-8 w-8 p-1 rounded-full border-[1px] overflow-hidden border border-solid hover:border-primary"
                      src={user.profilePics}
                      alt="user profile"
                    />
                  ) : (
                    <p className="h-[40px] w-[40px] text-sm p-1 overflow-hidden rounded-full border-[1px] hover:border-primary flex items-center justify-center flex-col font-bold">
                      {DefaultImage(user.name)}
                    </p>
                  )}
                </button>
                {isOpenUser && (
                  <Popup
                    style={{ top: 56, right: 20 }}
                    handleClose={() => setOpenUser(false)}
                    items={[
                      {
                        title: (
                          <div className="px-2 py-3">
                            <p className="font-bold text-xl">{user.name}</p>
                            <span className="text-gray/50 text-sm">
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
