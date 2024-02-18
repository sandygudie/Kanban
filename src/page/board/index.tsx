import {  useState } from "react";
import Header from "components/Header";
import { GoSidebarCollapse } from "react-icons/go";
import SideBar from "components/SideBar";
import Board from "components/Board";
import { useParams } from "react-router-dom";
import { useGetWorkspaceBoardQuery } from "redux/apiSlice";
import BoardSkeleton from "components/BoardSkeleton";

export default function Index() {
  const { workspaceId } = useParams();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const {
    data: workspaceDetails,
    isLoading,
    isSuccess,
    isError,
  } = useGetWorkspaceBoardQuery(workspaceId!);

 
  return (
    <>
      {isLoading ? (
        <BoardSkeleton />
      ) : isSuccess ? (
        <div className="w-full h-full relative">
          <Header />
          <div className="w-full h-screen">
            <div
              className={`absolute top-[65px] ${
                workspaceDetails.data.boards?.length
                  ? "h-[90vh] overflow-auto"
                  : "h-full"
              }  w-full`}
            >
              {/* {workspaceDetails.data.boards?.length ?( */}
              <SideBar
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
              />
              {/* ):null} */}
              <Board showSidebar={showSidebar} />
            </div>
          </div>

          <button
            aria-label="Visibilityoff"
            onClick={() => {
              setShowSidebar(true);
            }}
            className={` ${
              showSidebar ? "opacity-0 delay-100 " : "opacity-100 delay-500"
            } cursor-pointer z-20 fixed top-16 text-white rounded-r-full bg-primary p-2 transition ease-in-out`}
          >
            {" "}
            <GoSidebarCollapse size={20} />{" "}
          </button>
        </div>
      ) : isError ? (
        <div className="">
          <p className="text-error text-sm">Error fetching workspace...</p>
          <button>Try Again</button>
        </div>
      ) : null}
    </>
  );
}
