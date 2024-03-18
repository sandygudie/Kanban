import Spinner from "components/Spinner";
import { useGoogleLoginMutation } from "redux/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { loadWorkspaceData } from "utilis";
import { useNavigate } from "react-router-dom";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const [googleLogin, { isLoading: isGoogleLoginLoading }] =
    useGoogleLoginMutation();

  const loginWithGoggle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleLogin({
          token: tokenResponse.access_token,
        }).unwrap();
        const currentWorkspace = loadWorkspaceData();
        const { workspace } = response.userdetails;

        if (!workspace.length) {
          navigate("/workspace/new");
        } else if (workspace.length && !currentWorkspace) {
          navigate("/workspaces");
        } else {
          const exisitngWorkspace = workspace.includes(
            currentWorkspace.workspaceId
          );
          if (exisitngWorkspace) {
            navigate(`/workspace/${currentWorkspace.workspaceId}`);
          } else {
            localStorage.removeItem("currentWorkspace");
            navigate("/workspaces");
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    },
  });
  return (
    <button
      type="button"
      onClick={() => loginWithGoggle()}
      className="bg-white text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-[0_3px_10px_rgb(0,0,0,0.40)] font-extraBold flex justify-between gap-x-4 md:gap-x-8 items-center rounded-full pl-4 pr-10 py-2"
    >
      <div className="w-10 h-10">
        <img
          src="./google_icon.webp"
          alt="devlink logo"
          width="40"
          loading="eager"
          height="40"
        />
      </div>
      <div className="text-sm">
        {isGoogleLoginLoading ? <Spinner /> : "Continue with Google"}
      </div>
    </button>
  );
}
