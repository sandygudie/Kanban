import { useState } from "react";
import logoMobile from "../../assets/logo-mobile.svg";
import Icon from "components/Icon";
import ToggleBtn from "components/ToggleBtn";
import { Link, useNavigate,} from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { useGetAllWorkspacesQuery } from "redux/apiSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { saveloadWorkspaceData } from "utilis";

export default function Index() {
  const navigate = useNavigate();
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const updateThemehandler = (theme: string) => setTheme(theme);
  const { data: response, isLoading } = useGetAllWorkspacesQuery();

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
        ) : response.data.workspace.length > 0 ? (
          <div className="h-full ">
            <div className="mx-auto h-full mt-10 flex flex-col items-center justify-start">
              <div className="w-10/12 md:w-auto">
                <h1 className="text-center text-lg font-bold mb-8">
                  ({response.data.workspace.length} ) Available Workspace(s)
                </h1>
                {response.data.workspace.map((ele: any) => {
                  return (
                    <button
                      key={ele._id}
                      onClick={() => {
                        saveloadWorkspaceData({
                          workspaceId: ele._id,
                        });
                        navigate(`/workspace/${ele._id}`);
                        // window.location.href=`workspace/${ele._id}`
                      }}
                      className="px-3 py-5 mt-4 font-semiBold w-full md:w-[36rem] rounded-lg border-[1px] border-solid border-gray/60 flex hover:bg-primary/50 gap-x-4  items-center justify-between"
                    >
                      <div className="flex items-center gap-x-5">
                        <img
                          src="./workspace-placeholder.webp"
                          className="w-5 h-5"
                          alt=""
                        />
                        <div>
                          <h2 className="">{ele.name}</h2>
                        </div>
                      </div>
                      <div>
                        {ele.members.map((ele: any) => {
                          return (
                            <div key={ele.userId}>
                              <FaRegCircleUser />
                            </div>
                          );
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-center mt-24">
                <Link
                  className="bg-primary/70 hover:bg-primary text-white text-sm py-4 px-8 rounded-lg font-bold"
                  to="/workspace/new"
                >
                  {" "}
                  Add Workspace
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p>No Workspace</p>
        )}
      </div>
    </>
  );
}
