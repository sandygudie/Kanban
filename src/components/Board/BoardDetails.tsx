import { useSelector } from "react-redux";
import { AppState } from "types";
import { appData } from "redux/boardSlice";
import Modal from "components/Modal";
import { useState } from "react";
import EditBoard from "./EditBoard";
import DeleteItem from "components/DeleteItem";
import { CiEdit } from "react-icons/ci";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
dayjs.extend(advancedFormat);

interface Props {
  handleClose: () => void;
}

export default function BoardDetails({ handleClose }: Props) {
  const data: AppState = useSelector(appData);
  const { active, workspace } = data;
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState("");
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [toggle, setToggle] = useState("About");

  const linkitems = [
    {
      name: "About",
      handler: () => {
        setToggle("About");
      },
    },
  ];

  return (
    <>
      <div className="rounded-md pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl">#{active.name}</h1>
        </div>

        <div className="flex items-center justify-start gap-x-6 p-2 pb-4">
          {linkitems.map((ele: any) => {
            return (
              <button
                onClick={() => setToggle(ele.name)}
                key={ele.name}
                className={`${
                  toggle === ele.name && "border-b-[1px]  border-solid"
                } text-sm font-bold`}
              >
                {ele.name}
              </button>
            );
          })}
        </div>
        <div className="border-[1px] border-gray/10 rounded-md mt-1">
          {[
            {
              title: (
                <p className="text-base py-4 font-medium">{active.name}</p>
              ),
              label: `Name`,
              handler: () => {
                setIsOpenEdit(true);
                setIsEdit("name");
              },
            },
            {
              title: (
                <>
                  {active?.description ? (
                    <p className=" font-medium py-4">{active?.description}</p>
                  ) : (
                    <p className="text-sm py-4 text-gray/80">
                      ** A brief details about the board.
                    </p>
                  )}
                </>
              ),
              label: `Description`,
              handler: () => {
                setIsOpenEdit(true);
                setIsEdit("description");
              },
            },
            {
              title: (
                <p className="text-gray/90 text-sm py-5">
                  Created by {workspace.createdBy} on{" "}
                  {dayjs(active.createdAt).format("MMMM Do, YYYY")}
                </p>
              ),
            },

            {
              label: "",
              title: (
                <p className="text-sm font-bold text-error py-4">
                  Delete Board
                </p>
              ),
              handler: () => {
                setIsOpenDelete(true);
              },
            },
          ].map((ele, index) => {
            return (
              <button
                key={index}
                onClick={() => (ele.label === "" ? ele.handler() : "")}
                className={`${
                  index > 2
                    ? "border-none rounded-b-md"
                    : `border-b border-gray/15 ${index === 0 && "rounded-t-md"}`
                } w-full border-x-0 border-t-0 hover:bg-gray-100`}
              >
                <div className="justify-between flex items-center py-2 px-5">
                  <div className="text-left">
                    <span className="text-gray/80 font-medium text-sm ">
                      {ele.label}
                    </span>
                    {ele.title}
                  </div>
                  {ele.label ? (
                    <span onClick={() => ele.handler()}>
                      <CiEdit className="text-lg" />
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Modal
        open={isOpenEdit || isOpenDelete}
        handleClose={() => {
          setIsOpenEdit(false), setIsOpenDelete(false);
        }}
      >
        {isOpenEdit ? (
          <EditBoard
            activeBoard={active}
            workspaceId={workspace.id}
            isEdit={isEdit}
            handleClose={() => setIsOpenEdit(false)}
          />
        ) : (
          <DeleteItem
            handleClose={() => {
              setIsOpenDelete(false), handleClose();
            }}
            boardname={active.name}
          />
        )}
      </Modal>
    </>
  );
}
