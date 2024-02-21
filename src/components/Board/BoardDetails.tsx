import IconButton from "components/IconButton";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { AppState } from "types";
import { appData } from "redux/boardSlice";
import Modal from "components/Modal";
import { useState } from "react";
import EditBoard from "./EditBoard";
import DeleteItem from "components/DeleteItem";
import moment from "moment";

interface Props {
  handleClose: () => void;
}

export default function BoardDetails({ handleClose }: Props) {
  const data: AppState = useSelector(appData);
  const { active, workspace } = data;
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState("");
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  

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
        <div className="flex items-center px-3 mt-8 text-sm gap-x-10 ">
          <button>About</button>
          <button>Members</button>
        </div>
        <div className="border-[1px] border-gray/10 rounded-xl mt-5">
          {[
            {
              title: <p className="text-sm">{active.name}</p>,
              label: `Name`,
              handler: () => {
                setIsOpenEdit(true);
                setIsEdit("name");
              },
            },
            {
              title: (
                <p className="text-sm">
                  {active?.description
                    ? active?.description
                    : "Write a brief details about the board."}
                </p>
              ),
              label: `Description`,
              handler: () => {
                setIsOpenEdit(true);
                setIsEdit("description");
              },
            },
            {
              title: (
                <div className="text-sm ">
                  <p className="text-gray text-sm">Created by Mark on {moment(active.createdAt).format('MMMM Do YYYY')}</p>
                  {/* <p className=""></p> */}
                </div>
              ),
            },
            // {
            //   label: "",
            //   title: <p className="text-sm text-error">Leave Board</p>,
            //   handler: () => {
            //     setIsOpenDelete(true);
            //   },
            // },
            {
              label: "",
              title: <p className="text-sm text-error">Delete Board</p>,
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
                    ? "border-none rounded-b-xl"
                    : `border-b border-gray/10 ${index === 0 && "rounded-t-xl"}`
                } w-full border-x-0 border-t-0 border hover:bg-gray/20`}
              >
                <div className="justify-between flex items-center p-5">
                  <div className="text-left">
                    <span className="text-sm text-gray/80">{ele.label}</span>
                    {ele.title}
                  </div>
                  {ele.label ? (
                    <span
                      onClick={() => ele.handler()}
                      className="text-xs text-gray/80"
                    >
                      Edit
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
            handleClose={() => setIsOpenDelete(false)}
            boardname={active.name}
          />
        )}
      </Modal>
    </>
  );
}
