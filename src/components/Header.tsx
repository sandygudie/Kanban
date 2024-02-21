import { useState } from "react";
import Modal from "./Modal";
import Popup from "./Popup";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import ToggleBtn from "./ToggleBtn";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { GoScreenFull } from "react-icons/go";
import { MdZoomInMap } from "react-icons/md";
import BoardDetails from "./Board/BoardDetails";
import WorkspaceInvite from "./WorkspaceInvite";

export default function Header() {
  const [isOpenBoardDetails, setIsOpenBoardDetails] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const [isWorkspaceMenu, setWorkspaceMenu] = useState(false);
  const data: AppState = useSelector(appData);
  const { active, workspace } = data;
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const updateThemehandler = (theme: string) => setTheme(theme);
  const [isFullscreen, setFullScreen] = useState(false);
  const navigate = useNavigate();

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
            <button
              onClick={() => {
                setWorkspaceMenu(!isWorkspaceMenu);
              }}
              className="flex items-center relative"
            >
              <h3
                className={`${
                  workspace.name.length > 10 ? "truncate w-[10ch]" : "w-auto"
                } font-bold sm:text-base md:text-xl`}
              >
                {workspace.name}
              </h3>{" "}
              <HiOutlineChevronDown className="mt-1 text-sm" />
            </button>
            {isWorkspaceMenu && (
              <Popup
                description={
                  <div className="flex gap-x-6 items-center border-b-[1px] border-gray/30 py-4 dark:text-white text-gray font-medium px-4 justify-center ">
                    <div className="w-8 h-8">
                      <img
                        src="./workspace-placeholder.webp"
                        className="w-8 h-8 object-fit"
                        alt=""
                      />
                    </div>
                    <div className="dark:text-white text-black ">
                      <h2 className="font-bold">
                        {workspace.name}&apos;s Workspace
                      </h2>
                    </div>
                  </div>
                }
                style={{ top: 45, right: "-7rem" }}
                handleOpenMenu={() => setWorkspaceMenu(false)}
                items={[
                  {
                    title: `Invite people to ${workspace.name}`,
                    handler: () => {setIsOpenInvite(true)},
                   
                  },
                  {
                    title: "Workspace settings",
                    handler: () => {
                      navigate("/workspace/settings");
                    },
                  },
                  {
                    title: "Switch workspace",
                    handler: () => {
                      navigate("/workspace");
                    },
                    status: true,
                  },
                  {
                    title: "New workspace",
                    handler: () => {
                      navigate("/workspace/new");
                    },
                    status: true,
                  },
                  {
                    title: (
                      <p className="text-error text-sm"> Exit workspace</p>
                    ),
                    handler: () => {
                      navigate("/workspace/new");
                    },
                    status: true,
                  },
                ]}
              />
            )}
          </div>

          <div
            className={`flex items-center justify-between w-5/6 px-4 md:px-6`}
          >
            {active ? (
              <button
                onClick={() => setIsOpenBoardDetails(true)}
                className="flex rounded-sm items-center py-2 px-4 hover:bg-gray/5"
              >
                <span className={`font-bold md:w-auto `}>#{active.name}</span>{" "}
                <HiOutlineChevronDown className="mt-1 text-sm" />
              </button>
            ) : (
              <h3 className="text-gray text-sm font-bold">No Board yet</h3>
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
            </div>
          </div>
        </div>
      </header>

      <Modal
        open={isOpenBoardDetails||isOpenInvite}
        handleClose={() => {
          setIsOpenBoardDetails(false),setIsOpenInvite(false);
        }}
      >
        {isOpenBoardDetails ? (
          <BoardDetails handleClose={() => setIsOpenBoardDetails(false)} />
        ) : (
          <WorkspaceInvite handleClose={() => setIsOpenInvite(false)} workspaceId ={workspace.id}/>
        )}
      </Modal>
    </>
  );
}
