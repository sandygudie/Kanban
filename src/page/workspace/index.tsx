import { useEffect, useState } from "react";
import logoMobile from "../../assets/logo-mobile.svg";
import Icon from "components/Icon";
import ToggleBtn from "components/ToggleBtn";
import { Link } from "react-router-dom";
import { useGetAllWorkspacesQuery } from "redux/apiSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { saveloadWorkspaceData } from "utilis";
import { BsPeople } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";

export default function Index() {
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const updateThemehandler = (theme: string) => setTheme(theme);
  const { data: response, isLoading, isSuccess } = useGetAllWorkspacesQuery();

  useEffect(() => {
    if (isSuccess && response?.data?.workspace.length < 1) {
      // window.location.href = `/login`;
    }
  }, [isSuccess, response]);

  return (
    <>
      <div className={`w-full h-screen`}>
        <header className="bg-white h-[65px] dark:bg-secondary flex items-center w-full border-b-[1px] border-gray/20">
          <div
            className={`border-r-[1px] border-gray/20 h-[65px] md:flex flex-col justify-center px-4 min-w-[14rem] cursor-pointer hidden `}
          >
            <Icon type="kanban_logo" />
          </div>
          <div className="block md:hidden border-gray/20 p-3 cursor-pointer">
            <img src={logoMobile} alt="logo" className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-between w-full pr-2 md:px-4">
            <h1 className="font-bold text-gray/50 text-lg">
              {response?.data?.workspace.length > 0
                ? "Workspace(s)"
                : "No Workspace"}
            </h1>
            <ToggleBtn updateThemehandler={updateThemehandler} theme={theme} />
          </div>
        </header>
        {isLoading ? (
          <div className="mx-auto md:w-[36rem] h-full mt-10 flex mt-10 flex-col items-center justify-start">
            <SkeletonTheme
              height={12}
              borderRadius={30}
              baseColor="#2b2c36"
              highlightColor="#20212c"
            >
              <h2 className="mb-10">
                {" "}
                <Skeleton width={200} height={10} />
              </h2>
              <div className="flex items-center gap-x-4 mt-2">
                <Skeleton width={400} height={10} />
                <Skeleton width={100} height={10} />
              </div>
            </SkeletonTheme>
          </div>
        ) : (
          response.data.workspace.length > 0 && (
            <div className="h-full ">
              <div className="mx-auto h-full mt-10 flex flex-col items-center justify-start">
                <h1 className="text-center text-lg font-semibold mb-8">
                  ({response.data.workspace.length} ) Available Workspace(s)
                </h1>
                <div className="block md:grid px-8 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                  {response.data.workspace.map((ele: any) => {
                    return (
                      <button
                        key={ele._id}
                        onClick={() => {
                          saveloadWorkspaceData({
                            workspaceId: ele._id,
                          });
                          // navigate(`/workspace/${ele._id}`);
                          window.location.href = `workspace/${ele._id}`;
                        }}
                        className="px-5 py-4 w-60 font-semibold rounded-md border-[1px] border-solid border-gray/20 hover:bg-primary/50 gap-x-4"
                      >
                        <div className="flex items-center gap-x-5">
                          <img
                            src={ele.profilePics}
                            className="w-8 h-8"
                            alt=""
                          />
                          <div>
                            <h2 className="font-bold">{ele.name}</h2>
                          </div>
                        </div>
                        <div className="font-semibold text-sm mt-4 text-left text-white/50">
                          <p className="flex items-center gap-x-2">
                            <MdSpaceDashboard /> {ele.boards.length} boards
                          </p>
                          <p className="flex gap-x-2 items-center">
                            <BsPeople /> {ele.members.length} members
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
        <div className="text-center h-full mx-auto w-56 flex flex-col items-center justify-center">
          <Link
            className="bg-primary/70  hover:bg-primary text-white flex-col flex items-center justify-center text-sm py-4 px-8 rounded-lg font-bold"
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
