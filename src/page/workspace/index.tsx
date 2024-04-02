import { Link } from "react-router-dom";
import { useGetAllWorkspacesQuery } from "redux/apiSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { saveloadWorkspaceData } from "utilis";
import { BsPeople } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";

export default function Index() {
  const { data: response, isLoading } = useGetAllWorkspacesQuery();

  return (
    <>
      <div className={`w-full`}>
        {isLoading ? (
          <div className="mx-auto mt-10 flex mt-10 flex-col items-center justify-start">
            <SkeletonTheme height={12} borderRadius={10}>
              <h2 className="mb-10">
                {" "}
                <Skeleton width={200} height={10} />
              </h2>
              <div className="grid w-10/12 mx-auto mini:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
                <Skeleton height={120} className="w-full mini:w-[250px]" />
                <Skeleton height={120} className="w-full mini:w-[250px]" />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[250px]"
                />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[250px]"
                />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[250px]"
                />
              </div>
            </SkeletonTheme>
          </div>
        ) : (
          response?.data.workspace.length > 0 && (
            <div className="bg-main">
              <div className="mx-auto mt-10">
                <h1 className="text-center md:text-lg font-semibold mb-8">
                  ({response.data.workspace.length} ) Available Workspace(s)
                </h1>
                <div className="grid w-4/6 mini:w-10/12 mx-auto mini:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                  {response.data.workspace.map((ele: any) => {
                    return (
                      <button
                        key={ele._id}
                        onClick={() => {
                          saveloadWorkspaceData({
                            workspaceId: ele._id,
                          });
                          window.location.href = `workspace/${ele._id}`;
                        }}
                        className="px-5 py-4 mini:w-64 font-semibold rounded-md border-[1px] border-solid border-gray/20 bg-gray-100 hover:bg-gray/15 gap-x-4"
                      >
                        <div className="flex items-center gap-x-2">
                          <img
                            src={ele.profilePics}
                            className="w-8 h-auto"
                            alt=""
                          />
                          <div>
                            <h2 className="font-bold text-base">{ele.name}</h2>
                          </div>
                        </div>
                        <div className="font-semibold text-sm mt-4 text-left">
                          <p className="flex items-center gap-x-2">
                            <MdSpaceDashboard /> {ele.boards.length}{" "}
                            {ele.boards.length > 1 ? "boards" : "board"}
                          </p>
                          <p className="flex gap-x-2 items-center">
                            <BsPeople /> {ele.members.length}{" "}
                            {ele.members.length > 1 ? "members" : "member"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        )}
        <div
          className={`text-center mx-auto w-56 flex flex-col items-center justify-center ${
            response?.data.workspace.length > 0 ? "h-auto my-10" : "h-full"
          }`}
        >
          <Link
            className="bg-gray-200 hover:bg-gray-300 flex-col flex items-center justify-center text-sm h-12 px-8 rounded-lg font-bold"
            to="/workspace/new"
          >
            {" "}
            Add Workspace
          </Link>
        </div>
      </div>
    </>
  );
}
