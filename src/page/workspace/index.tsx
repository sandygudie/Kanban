import { Link } from "react-router-dom";
import { useGetAllWorkspacesQuery } from "redux/apiSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getCurrentTheme, saveloadWorkspaceData } from "utilis";
import { BsPeople } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";

export default function Index() {
  const currentTheme = getCurrentTheme();
  const { data: response, isLoading } = useGetAllWorkspacesQuery();

  return (
    <>
      <div className={`w-full h-screen overflow-auto`}>
        <header className="bg-secondary h-[65px] z-20 flex items-center w-full border-b-[1px] border-gray/20">
          <div
            className={`border-r-[1px] border-gray/20 h-[65px] flex flex-col justify-center px-4 md:min-w-[14rem] cursor-pointer`}
          >
            <div className="inline-flex items-center gap-x-2">
              <img
                src={
                  currentTheme === "dark"
                    ? "/track_logo.webp"
                    : "/track_black_logo.webp"
                }
                className="w-6 h-auto"
                alt="mutiple-projects-image"
              />

              <span className="hidden md:block font-bold text-2xl">Kanban</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full pr-2 px-4">
            <h1 className="font-bold mini:text-lg">
              {response?.data?.workspace.length > 0
                ? "Workspace(s)"
                : "No Workspace"}
            </h1>
          </div>
        </header>
        {isLoading ? (
          <div className="mx-auto mt-10 overflow-auto flex mt-10 flex-col items-center justify-start">
            <SkeletonTheme height={12} borderRadius={10}>
              <h2 className="mb-10">
                {" "}
                <Skeleton width={200} height={10} />
              </h2>
              <div className="grid w-10/12 mx-auto mini:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
                <Skeleton height={120} className="w-full mini:w-[300px]" />
                <Skeleton height={120} className="w-full mini:w-[300px]" />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[300px]"
                />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[300px]"
                />
                <Skeleton
                  height={120}
                  className="hidden mini:block mini:w-[300px]"
                />
              </div>
            </SkeletonTheme>
          </div>
        ) : (
          response?.data.workspace.length > 0 && (
            <div className="bg-main h-full">
              <div className="mx-auto mt-4 mini:mt-16">
                <h1 className="text-center mini:text-lg font-semibold mb-8">
                  ({response.data.workspace.length} ) Available Workspace(s)
                </h1>

                <div className="grid w-5/6 mini:w-10/12 mx-auto mini:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
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
                        className="px-5 py-4 w-6/6 font-semibold rounded-md border-[1px] border-solid border-gray/20 bg-gray-100 hover:bg-gray/15 gap-x-4"
                      >
                        <div className="flex items-center gap-x-2">
                          <img
                            src={ele.profilePics}
                            className="w-8 h-auto"
                            alt=""
                          />
                          <div>
                            <h2 className="font-bold text-sm mini:text-base">
                              {ele.name}
                            </h2>
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
