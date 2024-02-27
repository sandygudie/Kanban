import { useSelector } from "react-redux";
import { AppState } from "../../types";
import { IoIosAdd } from "react-icons/io";
import { appData } from "redux/boardSlice";
import { useState } from "react";
import Modal from "components/Modal";
import AddBoard from "components/Board/AddBoard";
import ActiveBoard from "components/Board/ActiveBoard";

export default function Index() {
  const [isOpenBoard, setOpenBoard] = useState(false);
  const data: AppState = useSelector(appData);
  const { active } = data;

  return (
    <>
      {active ? (
        <ActiveBoard />
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="md:p-8 mx-auto text-center">
            <div className="w-52 md:w-72 mx-auto h-auto">
              <img
                src="/startproject.png"
                alt="start project"
                loading="eager"
                className=""
              />
            </div>
            <div className="">
              <h2 className="font-bold md:text-xl text-gray ">
                Create your first board
              </h2>
              <p className="mt-1 text-gray text-base mb-5">
                You don&apos;t have any board for this workspace
              </p>
              <button
                onClick={() => {
                  setOpenBoard(true);
                }}
                className="font-bold bg-primary rounded-full px-6 py-3 cursor-pointer text-white transition ease-in-out delay-100 duration-500 bg-blue-500 hover:-translate-y-1 hover:scale-110
      "
              >
                <div className="flex items-center justify-center gap-x-2">
                  <span>
                    <IoIosAdd />
                  </span>{" "}
                  Add Board
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal open={isOpenBoard} handleClose={() => setOpenBoard(false)}>
        <AddBoard handleClose={() => setOpenBoard(false)} />
      </Modal>
    </>
  );
}
