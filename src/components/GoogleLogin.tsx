import { useState } from "react";
import { Loader } from "components/Spinner";
import { useGoogleLoginMutation } from "redux/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { handleDeviceDetection, loadWorkspaceData } from "utilis";
import { useNavigate } from "react-router-dom";
import { setToken } from "utilis/token";
import { IoAlertCircleOutline } from "react-icons/io5";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [googleLogin, { isLoading: isGoogleLoginLoading }] =
    useGoogleLoginMutation();

  const loginWithGoggle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoginError("");
        const response = await googleLogin({
          token: tokenResponse.access_token,
        }).unwrap();
        const currentWorkspace = loadWorkspaceData();
        const { workspace, access_token } = response.data.userdetails;
        const deviceType = handleDeviceDetection();

        if (deviceType === "mobile") {
          setToken(access_token);
        }
        if (!workspace.length) {
          navigate("/workspace/new");
        } else if (workspace.length && !currentWorkspace) {
          navigate("/workspaces");
        } else {
          const exisitingWorkspace = workspace.includes(
            currentWorkspace.workspaceId
          );
          if (exisitingWorkspace) {
            navigate(`/workspace/${currentWorkspace.workspaceId}`);
          } else {
            localStorage.removeItem("currentWorkspace");
            navigate("/workspaces");
          }
        }
      } catch (error: any) {
        setLoginError(error.message);
      }
    },
  });
  return (
    <>
      <button
        type="button"
        onClick={() => loginWithGoggle()}
        className="bg-white w-full hover:border-primary text-sm font-semibold flex border border-gray/40 justify-center gap-x-4 md:gap-x-8 items-center rounded-full pl-4 pr-10 py-2"
      >
        <div className="w-10 h-10">
          <img
            src="./google_icon.webp"
            alt="Google logo"
            width="40"
            loading="eager"
            height="40"
          />
        </div>
        <div className="text-sm font-medium">
          {isGoogleLoginLoading ? (
            <div className="w-24">
              <Loader />
            </div>
          ) : (
            "Continue with Google"
          )}
        </div>
      </button>
      {loginError ? (
        <p className="text-xs flex items-center text-error gap-x-2">
          {" "}
          <IoAlertCircleOutline size={16} /> {loginError}{" "}
        </p>
      ) : null}
    </>
  );
}
