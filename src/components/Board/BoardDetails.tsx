import { useSelector } from "react-redux";
import { AppState } from "types";
import { appData } from "redux/boardSlice";
import Modal from "components/Modal";
import { useEffect, useState } from "react";
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
  const { active, workspace ,user} = data;
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState("");
  const [newValue, setNewValue] = useState("");
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

  useEffect(() => {
    setNewValue(
      isEdit === "description"
        ? active?.description || ""
        : isEdit === "name"
        ? active.name
        : ""
    );
  }, [active, isEdit, setNewValue]);

  const handleValueChange = (value: string) => {
    setNewValue(value);
  };

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
                <p className="text-base font-normal text-white/70">
                  {active.name}
                </p>
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
                    <p className="text-base text-white/70 font-normal">
                      {active?.description}
                    </p>
                  ) : (
                    <p className="text-sm text-white/30">
                      ** Add a brief details about the board **
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
                <p className="text-base text-white/70 font-normal">
                  {workspace.createdBy} on{" "}
                  {dayjs(active.createdAt).format("MMMM Do, YYYY")}
                </p>
              ),
              label: `Created by`,
            },

            {
              title: (
                <button
                  onClick={() => {
                    setIsOpenDelete(true);
                  }}
                  className="text-error w-fit py-2 px-3 font-bold text-base"
                >
                  Delete Board
                </button>
              ),
            },
          ].map((ele, index) => {
            return (
              <div
                key={index}
                className={`${
                  index > 2
                    ? "border-none rounded-b-md"
                    : `border-b border-gray/15 ${index === 0 && "rounded-t-md"}`
                } w-full border-x-0 border-t-0 hover:bg-gray-100`}
              >
                <div className="justify-between flex items-center py-4 px-5">
                  <div className="text-left">
                    <span className="text-white/90 font-semibold">
                      {ele.label}
                    </span>
                    {ele.title}
                  </div>
                  {ele.label && ele.handler ? (
                    <button onClick={() => ele.handler()}>
                      <CiEdit className="text-lg text-gray/60" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        open={isOpenEdit || isOpenDelete}
        handleClose={() => {
          setIsOpenEdit(false),
            setNewValue(""),
            setIsEdit(""),
            setIsOpenDelete(false);
        }}
      >
        {isOpenEdit ? (
          <EditBoard
          user={user}
            handleValueChange={handleValueChange}
            activeBoard={active}
            workspace={workspace}
            isEdit={isEdit}
            handleClose={() => {
              setIsOpenEdit(false), setIsEdit(""), setNewValue("");
            }}
            newValue={newValue}
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
