import Spinner from "components/Spinner";
import { useState } from "react";
import {
  useGetWorkspaceQuery,
  useRemoveWorkspaceMemberMutation,
} from "redux/apiSlice";
import { TitleCase } from "utilis";

interface Props {
  workspaceId: string;
}
export default function Members({ workspaceId }: Props) {
  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspaceId);
  const [removeMember, { isLoading: isRemovingMember }] =
    useRemoveWorkspaceMemberMutation();
  const [memberId, setMemberId] = useState("");

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
    <div className="">
      <h1 className="font-bold text-base border-b-[1px] border-gray/20 pb-2 ">
        Workspace Members
      </h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="mt-6 bg-secondary p-8 rounded-md">
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
                    <p>{TitleCase(ele.role)}</p>
                    <button
                      onClick={() => {
                        deletemember(ele.userId);
                      }}
                      className="bg-error font-bold rounded-md w-20 h-8 text-xs p-2"
                    >
                      {isRemovingMember && memberId === ele.userId ? (
                        <Spinner />
                      ) : (
                        "Remove"
                      )}
                    </button>
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
  );
}
