import Spinner from "components/Spinner";
import { useState } from "react";
import {
  useUpdateMemberRoleMutation,
  useGetWorkspaceQuery,
  useRemovePendingMemberMutation,
  useRemoveWorkspaceMemberMutation,
} from "redux/apiSlice";
import { TitleCase } from "utilis";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import Popup from "components/Popup";
import Modal from "components/Modal";
import WorkspaceInvite from "components/WorkspaceInvite";
import { App as AntDesign } from "antd";

interface Props {
  workspaceId: string;
}
export default function Members({ workspaceId }: Props) {
  const { message } = AntDesign.useApp();
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const [memberId, setMemberId] = useState("");
  const [pendingMemberId, setPendingMemberId] = useState("");
  const [isOption, setOption] = useState("");
  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspaceId);
  const [removeMember, { isLoading: isRemovingLoading }] =
    useRemoveWorkspaceMemberMutation();
  const [removePendingMember, { isLoading: isRemovingPendingLoading }] =
    useRemovePendingMemberMutation();
  const [updateRole, { isLoading: isUpdateRoleLoading }] =
    useUpdateMemberRoleMutation();

  const deletemember = async (userId: string) => {
    try {
      const response = await removeMember({ workspaceId, userId }).unwrap();
      if (response) {
        setMemberId("");
      }
    } catch (error: any) {
      message.error({
        content: error.message,
        className: "text-error",
      });
    }
  };

  const deletePendingmember = async (userEmail: string) => {
    setPendingMemberId(userEmail);
    try {
      const response = await removePendingMember({
        workspaceId,
        userEmail,
      }).unwrap();
      if (response) {
        setMemberId("");
      }
    } catch (error: any) {
      message.error({
        content: error.message,
        className: "text-error",
      });
    }
  };
  const assignMemberAdmin = async (userId: string) => {
    setMemberId(userId);
    try {
      const response = await updateRole({ workspaceId, userId }).unwrap();
      if (response) {
        setMemberId("");
      }
    } catch (error: any) {
      message.error({
        content: error.message,
        className: "text-error",
      });
    }
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex items-center pb-2 justify-between border-b-[1px] border-gray/20">
          <h1 className="font-bold text-sm md:text-base">Workspace Members</h1>
          <button
            onClick={() => {
              setIsOpenInvite(true);
            }}
            className="px-2 text-sm md:text-sm py-1.5 bg-success font-bold rounded-md"
          >
            Invite members
          </button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="mt-6 bg-secondary px-4 py-2 rounded-md">
              {workspace?.data.members.map((ele: any) => {
                return (
                  <div
                    className="md:flex items-center mt-2 justify-between text-sm"
                    key={ele?.userId}
                  >
                    <div className="">
                      {" "}
                      <p className="font-semibold">{ele.name}</p>{" "}
                      <p className="text-gray/70 text-sm">{ele.email}</p>
                    </div>
                    <div className="flex gap-x-3 justify-between items-center mt-4">
                      {" "}
                      <p className="font-bold pr-6">{TitleCase(ele?.role)}</p>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setOption(ele?.userId);
                          }}
                          className={`${
                            isOption === ele?.userId && "bg-gray/50"
                          } border-2 border-gray/30 font-semibold flex flex-col justify-center items-center rounded-md hover:bg-gray/50 h-10 w-24 px-2.5`}
                        >
                          {isRemovingLoading ||
                          (isUpdateRoleLoading && memberId === ele.userId) ? (
                            <Spinner />
                          ) : (
                            <span className="flex gap-x-2 items-center">
                              {" "}
                              Options
                              {isOption === ele?.userId ? (
                                <HiOutlineChevronDown />
                              ) : (
                                <HiOutlineChevronUp />
                              )}
                            </span>
                          )}
                        </button>
                        {isOption === ele?.userId && (
                          <Popup
                            style={{ top: 40, right: 0 }}
                            handleClose={() => setOption("")}
                            items={[
                              {
                                title: (
                                  <p className="py-2 font-bold text-[0.95rem] px-2">
                                    Make{" "}
                                    {ele.role === "admin" ? "Member" : "Admin"}
                                  </p>
                                ),
                                handler: () => {
                                  assignMemberAdmin(ele?.userId), setOption("");
                                },
                              },
                              {
                                title: (
                                  <p className="py-2 px-2  font-bold text-error text-[0.95rem]">
                                    Remove from Team
                                  </p>
                                ),
                                handler: () => {
                                  setMemberId(ele?.userId),
                                    deletemember(ele.userId),
                                    setOption("");
                                },
                              },
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-20">
              <h1 className="font-bold text-base border-b-[1px] border-gray/20 pb-2">
                Pending Members
              </h1>
              {workspace?.data.pendingMembers.length ? (
                workspace?.data.pendingMembers.map(
                  (ele: string, index: number) => {
                    return (
                      <div
                        className={`${
                          index % 2 && "bg-secondary"
                        } flex px-4 py-5 rounded-md items-center justify-between text-sm`}
                        key={ele}
                      >
                        <p>{ele}</p>
                        <button
                          onClick={() => {
                            deletePendingmember(ele);
                          }}
                          className="text-error flex flex-col items-center justify-center rounded-md font-bold h-10 w-24"
                        >
                          {isRemovingPendingLoading &&
                          pendingMemberId === ele ? (
                            <Spinner />
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-gray/50 text-sm mt-3">No pending request</p>
              )}
            </div>
          </>
        )}
      </div>
      <Modal
        open={isOpenInvite}
        handleClose={() => {
          setIsOpenInvite(false);
        }}
      >
        <WorkspaceInvite
          handleClose={() => {
            setIsOpenInvite(false);
          }}
          workspaceId={workspaceId}
        />
      </Modal>
    </>
  );
}
