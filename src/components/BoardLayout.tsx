import { useEffect, useState } from "react";
import Header from "components/Header";
import { GoSidebarCollapse } from "react-icons/go";
import SideBar from "components/SideBar";
import { Outlet, useParams } from "react-router-dom";
import { useGetWorkspaceBoardsQuery } from "redux/apiSlice";
import BoardSkeleton from "components/BoardSkeleton";
import { loadWorkspaceData } from "utilis";
import Spinner from "./Spinner";

export default function Index() {
  const { workspaceId } = useParams();
  const [Id, setId] = useState("");
  const [isLoadingBoard, setLoadingBoard] = useState(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  useEffect(() => {
    if (workspaceId) {
      setId(workspaceId);
    } else {
      if (loadWorkspaceData === null && !workspaceId) {
        window.location.assign("/login");
      } else {
        const workspaceData = loadWorkspaceData();
        setId(workspaceData?.workspaceId);
      }
    }
    setLoadingBoard(false);
  }, [workspaceId]);

  const {
    data: workspaceDetails,
    isLoading,
    isSuccess,
    isError,
  } = useGetWorkspaceBoardsQuery(Id);

  return (
    <>
      {isLoading || isLoadingBoard ? (
        <BoardSkeleton />
      ) : isSuccess ? (
        <div className="w-full h-full relative">
          <Header />
          <div className="w-full h-screen">
            <div
              className={`absolute top-[65px] ${
                workspaceDetails.data.workspace.boards?.length
                  ? "h-screen"
                  : "h-full"
              }  w-full`}
            >
              <SideBar
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
              />
              <div
                className={`${
                  showSidebar ? "translate-x-[220px] w-[85vw]" : "translate-x-0"
                } max-w-screen-2xl h-full transition duration-700 ease-in-out pr-10`}
              >
                <Outlet />
              </div>
            </div>
          </div>
          <button
            aria-label="Visibilityoff"
            onClick={() => {
              setShowSidebar(true);
            }}
            className={` ${
              showSidebar ? "opacity-0 delay-100" : "opacity-100 delay-500"
            } cursor-pointer z-20 fixed top-16 text-white rounded-r-full bg-primary p-2 transition ease-in-out`}
          >
            {" "}
            <GoSidebarCollapse size={20} />{" "}
          </button>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center flex-col">
          <Spinner/>
        </div>
      ) : null}
    </>
  );
}
