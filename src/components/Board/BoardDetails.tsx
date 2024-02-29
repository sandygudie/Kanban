import moment from "moment";
import IconButton from "components/IconButton";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { AppState } from "types";
import { appData } from "redux/boardSlice";
import Modal from "components/Modal";
import { useState } from "react";
import EditBoard from "./EditBoard";
import DeleteItem from "components/DeleteItem";
import { CiEdit } from "react-icons/ci";

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
    {
      name: "Members",
      handler: () => {
        setToggle("Members");
      },
    },
  ];

  return (
    <>
      <div className="rounded-md p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-gray text-xl">#{active.name}</h1>
          <IconButton
            handleClick={() => {
              handleClose();
            }}
          >
            <IoClose className="font-bold text-2xl" />
          </IconButton>
        </div>

        <div className="flex items-center justify-start gap-x-6 mt-5 p-2 ">
          {linkitems.map((ele: any) => {
            return (
              <button
                onClick={() => setToggle(ele.name)}
                key={ele.name}
                className={`${
                  toggle === ele.name && "border-b-[1px] py-2 border-solid"
                } py-2 text-sm font-bold`}
              >
                {ele.name}
              </button>
            );
          })}
        </div>
        <div className="border-[1px] border-gray/10 rounded-md mt-1">
          {[
            {
              title: <p className="text-base py-4 font-bold">{active.name}</p>,
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
                    <p className="text-sm py-4 ">{active?.description}</p>
                  ) : (
                    <p className="text-sm py-4 text-gray/40">
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
                <div className="text-sm py-4">
                  <p className="text-gray text-xs">
                    Created by {workspace.createdBy} on{" "}
                    {moment(active.createdAt).format("MMM Do , YYYY")}
                  </p>
                </div>
              ),
            },

            {
              label: "",
              title: <p className="text-xs text-error py-4">Delete Board</p>,
              handler: () => {
                setIsOpenDelete(true); //admin
            
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
                    : `border-b border-gray/10 ${index === 0 && "rounded-t-md"}`
                } w-full border-x-0 border-t-0 border hover:bg-gray/20`}
              >
                <div className="justify-between flex items-center py-2 px-5">
                  <div className="text-left">
                    <span className="text-xs text-gray/80 ">{ele.label}</span>
                    {ele.title}
                  </div>
                  {ele.label ? (
                    <span onClick={() => ele.handler()}>
                      <CiEdit className="text-gray/80 text-lg" />
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
            handleClose={() => {setIsOpenDelete(false), handleClose()}}
            boardname={active.name}
          />
        )}
      </Modal>
    </>
  );
}
