import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Loader } from "components/Spinner";
import { handleDeviceDetection, loadWorkspaceData } from "utilis";
import { useLoginUserMutation } from "redux/authSlice";
import GoogleLogin from "components/GoogleLogin";
import { setToken } from "utilis/token";

export default function Index() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputError, setInputError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
    setInputError("");
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formData.email === "" && formData.password === "") {
      setInputError("error");
    } else if (formData.email === "") {
      setInputError("emailError");
    } else if (formData.password === "") {
      setInputError("passwordError");
    } else {
      try {
        const response = await login(formData).unwrap();
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
        setInputError("error");
        setLoginError(error.message);
      }
    }
  };

  return (
    <main className="h-full">
      <div className="h-full">
        <div className="w-full mini:w-9/12 md:w-[40%] mx-auto">
          <h1 className="font-semibold text-2xl pt-6 pb-4 md:pb-12 text-center">
            Login to your account
          </h1>
          <div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center py-10 px-4 sm:px-12 flex-col gap-y-4 justify-center rounded-lg md:border md:bg-white border-gray/40"
            >
              <div className="w-full">
                <GoogleLogin />
              </div>
              <p className="text-sm text-gray font-medium">OR</p>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                className={` ${
                  inputError === "error" || inputError === "emailError"
                    ? "border-error"
                    : "border"
                } py-3 px-4 rounded-lg w-full`}
                placeholder="Email Address"
                onChange={(e) => handleInputChange(e)}
              />
              <div className="relative w-full">
                <input
                  required
                  name="password"
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
                  className={` ${
                    inputError === "error" || inputError === "passwordError"
                      ? "border-error"
                      : "border"
                  } py-3 px-4 rounded-lg w-full`}
                  placeholder="Password"
                  onChange={(e) => handleInputChange(e)}
                />
                <button type="button" className="absolute top-4 right-5">
                  {showPassword ? (
                    <AiOutlineEye
                      className="text-xl"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="text-xl"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </button>
                <div className="pt-3 relative">
                  {loginError ? (
                    <p className="text-xs absolute flex items-center text-error gap-x-2">
                      {" "}
                      <IoAlertCircleOutline size={16} /> {loginError}{" "}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="w-full mt-2">
                <button
                  className="bg-primary hover:bg-primary-hover flex justify-center items-center flex-col h-12 w-full font-medium rounded-lg text-white p-3"
                  type="submit"
                >
                  {isLoading ? <Loader /> : "Continue with email"}
                </button>
                <div className="flex items-center justify-between pt-3">
                  <Link
                    className="text-xs text-gray underline  hover:text-gray"
                    to="/signup"
                  >
                    Create new account
                  </Link>
                  <Link
                    className="text-xs underline text-gray hover:text-gray"
                    to="/forgotpassword"
                  >
                    forgot password?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
