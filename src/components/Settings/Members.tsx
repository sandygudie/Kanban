import Spinner from "components/Spinner";
import { useState } from "react";
import {
  useGetWorkspaceQuery,
  useRemoveWorkspaceMemberMutation,
} from "redux/apiSlice";
import { TitleCase } from "utilis";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import Popup from "components/Popup";
import Modal from "components/Modal";
import WorkspaceInvite from "components/WorkspaceInvite";

interface Props {
  workspaceId: string;
}
export default function Members({ workspaceId }: Props) {
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspaceId);
  const [removeMember, { isLoading: isRemovingMember }] =
    useRemoveWorkspaceMemberMutation();
  const [memberId, setMemberId] = useState("");
  const [isOption, setOption] = useState(false);

  const deletemember = async (userId: string) => {
    setMemberId(userId);
    try {
      const response = await removeMember({ workspaceId, userId });
      if (response) {
        setMemberId("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex items-center pb-2 justify-between border-b-[1px] border-gray/20">
          <h1 className="font-bold text-base ">Workspace Members</h1>
          <button onClick={()=>{ setIsOpenInvite(true)}} className="px-2 py-2 bg-success font-bold rounded-md">
            Invite members
          </button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="mt-6 bg-secondary px-8 py-2 rounded-md">
              {workspace?.data.members.map((ele: any) => {
                return (
                  <div
                    className="flex items-center justify-between text-sm"
                    key={ele?.userId}
                  >
                    <div className="">
                      {" "}
                      <p className="font-semibold">{ele.name}</p>{" "}
                      <p className="text-gray/70 text-sm">{ele.email}</p>
                    </div>
                    <div className="flex gap-x-3 items-center mt-4">
                      {" "}
                      <p className="font-bold pr-6">{TitleCase(ele.role)}</p>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setOption(true);
                          }}
                          className={`${
                            isOption && "bg-gray/50"
                          } border-2 border-gray/30 font-semibold rounded-md hover:bg-gray/50  py-1.5 px-2.5`}
                        >
                          {isRemovingMember && memberId === ele.userId ? (
                            <Spinner />
                          ) : (
                            <span className="flex gap-x-2 items-center">
                              {" "}
                              options
                              {!isOption ? (
                                <HiOutlineChevronUp />
                              ) : (
                                <HiOutlineChevronDown />
                              )}
                            </span>
                          )}
                        </button>
                        {isOption && (
                          <Popup
                            style={{ top: 40, right: 0 }}
                            handleOpenMenu={() => setOption(false)}
                            items={[
                              {
                                title: (
                                  <button className="py-2 font-bold text-[0.95rem]">
                                    Make Admin
                                  </button>
                                ),
                                handler: () => {
                                  setOption(false);
                                },
                              },
                              {
                                title: (
                                  <button className="py-2 font-bold text-error text-[0.95rem]">
                                    Remove from Team
                                  </button>
                                ),
                                handler: () => {
                                  deletemember(ele.userId), setOption(false);
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
              <h1 className="font-bold text-base border-b-[1px] border-gray/20 pb-2 ">
                Pending Members
              </h1>
              {workspace?.data.pendingMembers.length ? (
                workspace?.data.pendingMembers.map((ele: string) => {
                  return (
                    <div
                      className="flex bg-secondary p-8 rounded-md items-center justify-between mt-6 text-sm"
                      key={ele}
                    >
                      <p>{ele}</p>
                    </div>
                  );
                })
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
          workspaceId={workspace.id}
        />
      </Modal>
    </>
  );
}
