import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChangeEvent, useEffect, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import Spinner, { Loader } from "components/Spinner";
import { loadWorkspaceData } from "utilis";
import { useGoogleLoginMutation, useLoginUserMutation } from "redux/authSlice";
import { useGoogleLogin } from "@react-oauth/google";

export default function Index() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginUserMutation();
  const [loginGoggle, { isLoading: isGoogleLoginLoading }] =
  useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputError, setInputError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    localStorage.removeItem("currentWorkspace");
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
    setInputError("");
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (formData.email.length && formData.password === "") {
      setInputError("passwordError");
    } else if (formData.password.length && formData.email === "") {
      setInputError("emailError");
    } else {
      setInputError("");
    }
  };
  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await loginGoggle({
          token: tokenResponse.access_token,
        }).unwrap();
        console.log(result);
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const currentWorkspace = loadWorkspaceData();
    if (formData.email === "" && formData.password === "") {
      setInputError("error");
    } else if (formData.email === "") {
      setInputError("emailError");
    } else if (formData.password === "") {
      setInputError("passwordError");
    } else {
      try {
        const response = await login(formData).unwrap();
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
        setInputError("error");
        setLoginError(error.message);
      }
    }
  };

  return (
    <main className="h-full">
      <div className="h-full">
        <div className="md:w-4/12 mx-auto">
          <h1 className="font-semibold text-3xl pt-6 md:pb-12 text-center">
            Log In
          </h1>
          <div className="">
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center py-10 px-4 sm:px-12 md:shadow-xl flex-col gap-y-4 justify-center"
            >
              <div className="">
                <button
                  type="button"
                  onClick={() => googleLogin()}
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
                  <div className="text-sm">{ isGoogleLoginLoading? <Spinner/> :'Continue with Google'}</div>
                </button>
              </div>
              <p className="text-sm text-gray">OR</p>

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
              <div className="w-full mt-4">
                <button
                  className="bg-secondary-dark flex justify-center items-center flex-col h-12 w-full font-medium rounded-md text-white p-3"
                  type="submit"
                >
                  {isLoading ? <Loader /> : "Continue with email"}
                </button>
                <div className="flex items-center justify-between pt-3">
                  <Link className="text-xs text-gray underline  hover:text-gray" to="/signup">
                    Create account
                  </Link>
                  <Link
                    className="text-xs underline text-gray  hover:text-gray"
                    to="/forgot-password"
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
