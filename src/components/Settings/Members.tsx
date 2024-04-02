import Spinner from "components/Spinner";
import { useState } from "react";
import {
  useUpdateMemberRoleMutation,
  useGetWorkspaceQuery,
  useRemovePendingMemberMutation,
  useRemoveWorkspaceMemberMutation,
} from "redux/apiSlice";
import { DefaultImage, TitleCase } from "utilis";
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
          <h1 className="font-semibold text-sm md:text-base">
            Workspace Members
          </h1>
          <button
            onClick={() => {
              setIsOpenInvite(true);
            }}
            className="px-3 text-white text-sm md:text-sm py-2 bg-success/90 hover:bg-success font-semibold text-sm rounded-md"
          >
            Invite Members
          </button>
        </div>
        {isLoading ? (
          <div className="mt-4">
            {" "}
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mt-6 bg-secondary p-6 rounded-md">
              {workspace?.data.members.map((ele: any) => {
                return (
                  <div
                    className="mini:flex items-center mb-7 md:mb-4 justify-between text-sm"
                    key={ele?.userId}
                  >
                    <div className="sm:flex items-center gap-x-3">
                      <div className="py-1 font-bold text-[0.8rem]">
                        {ele.profilePics ? (
                          <img
                            className="w-6 h-6 rounded-full"
                            src={ele.profilePics}
                            alt="profile pic"
                          />
                        ) : (
                          <span className="h-[30px] w-[30px] text-sm p-1 overflow-hidden rounded-full border-[1px] flex items-center justify-center flex-col font-bold">
                            {DefaultImage(ele.name)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{ele.name}</p>{" "}
                        <p className="text-gray/80 font-medium text-sm">
                          {ele.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-1 justify-between items-center mt-4">
                      {" "}
                      <p className="font-bold mini:pr-4">
                        {TitleCase(ele?.role)}
                      </p>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setOption(ele?.userId);
                          }}
                          className={`${
                            isOption === ele?.userId && "bg-gray/50"
                          } border-2 border-gray/30 font-semibold flex flex-col justify-center items-center rounded-md hover:bg-gray-200 h-10 w-24 px-2.5`}
                        >
                          {isRemovingLoading ||
                          (isUpdateRoleLoading && memberId === ele.userId) ? (
                            <Spinner />
                          ) : (
                            <span className="flex gap-x-2 text-xs items-center">
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
                            className="top-[40px] right-0"
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
              <h1 className="font-semibold text-base border-b-[1px] border-gray/20 pb-2">
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
                <p className="text-gray/80 font-medium text-sm mt-3">
                  No pending request
                </p>
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
