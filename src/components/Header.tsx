import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import AddBoard from "./Board/AddBoard";
import logoMobile from "../assets/logo-mobile.svg";
import AddTask from "./Board/AddTask";
import DeleteItem from "./DeleteItem";
import Icon from "./Icon";
import Modal from "./Modal";
import Popup from "./Popup";
// import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";
import { AppState } from "types";
import ToggleBtn from "./ToggleBtn";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineChevronDown } from "react-icons/hi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBoard, setOpenBoard] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isDeleteBoard, setDeleteBoard] = useState(false);
  const [showDowndrop, setShowDropDown] = useState(false);
  const data: AppState = useSelector(appData);
  const { active, profile } = data;
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const updateThemehandler = (theme: string) => setTheme(theme);

  const editBoard = () => {
    setOpenBoard(true);
    setOpenMenu(false);
  };
  const handleOpenMenu = () => setOpenMenu(false);

  return (
    <div>
      <div className="bg-white h-[65px] dark:bg-secondary flex items-center fixed w-full border-b-[1px] border-gray/20">
        <div
          className={`border-r-[1px] border-gray/20 py-6 px-4 min-w-[14rem] cursor-pointer hidden md:block`}
        >
          <Icon type="kanban_logo" />
        </div>
        <div className="block md:hidden border-gray/20 p-3 md:min-w-[14rem] cursor-pointer">
          <img src={logoMobile} alt="logo" className="w-8 h-8" />
        </div>

        <div
          className={`flex items-center justify-between w-full pr-2 md:px-4`}
        >
          <>
            {/* <h3 className="hidden gap-x-2 items-center md:flex w-40 md:w-auto font-bold text-sm md:text-base">
              <button className="flex gap-x-1 items-center">
                Workspace <HiOutlineChevronDown className="mt-1 text-sm" />
              </button>{" "}
              <span className="lg:text-2xl ml-3"> {profile.name}</span>
            </h3> */}

            <button
              onClick={() => {
                setShowDropDown(!showDowndrop);
              }}
              className="flex items-center gap-x-2 relative"
            >
              <h3 className="font-bold truncate w-[5ch] sm:w-auto sm:text-base md:text-xl">
                {profile.name}
              </h3>{" "}
              <HiOutlineChevronDown className="mt-1 text-sm" />
            </button>
          </>

          <div className="flex items-center gap-x-6">
            <ToggleBtn updateThemehandler={updateThemehandler} theme={theme} />
            {active ? (
              <div className="flex gap-x-4 items-center">
                {active.columns.length ? (
                  <button
                    aria-label="Add Task"
                    onClick={() => setIsOpen(true)}
                    className={`hover:bg-primary/40 rounded-full bg-primary text-sm font-bold text-white 
                  px-1.5 py-1.5 md:px-4 md:py-2 
                  } `}
                  >
                    <IoIosAdd className="md:hidden inline-flex text-xl md:text-2xl" />

                    <span className="hidden md:flex justify-center items-center">
                      {" "}
                      <span>
                        <IoIosAdd className="font-bold text-2xl" />
                      </span>{" "}
                      Add Task
                    </span>
                  </button>
                ) : null}
                <button
                  onClick={() => setOpenMenu(!isOpenMenu)}
                  className="text-base font-bold flex items-center gap-x-1 hover:bg-primary/40 px-2.5 md:px-5 py-2.5 rounded-full bg-primary text-sm font-bold text-white"
                >
                  <span>
                    <MdOutlineDashboard className="font-bold md:text-xl" />
                  </span>
                  <span className="hidden md:inline"> Board</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={isOpen || isOpenBoard || isDeleteBoard}
        handleClose={() => {
          setIsOpen(false), setDeleteBoard(false), setOpenBoard(false);
        }}
      >
        {isOpenBoard ? (
          <AddBoard active={active} handleClose={() => setOpenBoard(false)} />
        ) : isDeleteBoard ? (
          <DeleteItem
            handleClose={() => setDeleteBoard(false)}
            isDeleteBoard={isDeleteBoard}
            name={active.name}
          />
        ) : (
          <AddTask handleClose={() => setIsOpen(false)} />
        )}
      </Modal>
      {isOpenMenu && (
        <Popup
          style={{ top: 50, right: 24 }}
          handleOpenMenu={handleOpenMenu}
          items={[
            {
              title: "Edit Board",
              handler: editBoard,
            },
            {
              title: "Delete Board",
              handler: () => {
                setDeleteBoard(true), handleOpenMenu();
              },
            },
          ]}
        />
      )}
    </div>
  );
}
