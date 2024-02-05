import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import { login } from "services/api/auth";
import { IoAlertCircleOutline } from "react-icons/io5";
import Spinner from "components/Spinner";

export default function Index() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
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
        setLoading(true);
        const response = await login(formData);
        if (response) {
          navigate("/workspace");
        }
      } catch (error: any) {
        setLoading(false);
        setInputError("error");
        setLoginError(error.message);
      }
    }
  };

  return (
    <main className="h-full">
      <div className="h-full">
        <div className="md:w-4/12 mx-auto">
          <h1 className="font-bold text-3xl pt-6 md:pb-12 text-center">
            Log In
          </h1>
          <div className="">
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center md:border border-solid py-10 px-4 sm:px-12 md:shadow-lg flex-col gap-y-4 justify-center "
            >
              <div className="">
                <button
                  onClick={() => {}}
                  className="bg-white text-sm shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-[0_3px_10px_rgb(0,0,0,0.40)] font-extraBold flex justify-between gap-x-8 items-center rounded-full pl-4 pr-10 py-2"
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
                  <p className="text-sm">Sign in with Google</p>
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
                {loginError ? (
                  <p className="text-sm absolute -bottom-7 flex items-center text-error gap-x-2">
                    {" "}
                    <IoAlertCircleOutline size={16} /> {loginError}{" "}
                  </p>
                ) : null}
              </div>
              <div className="w-full mt-6">
                <button
                  className="bg-primary flex justify-center h-12 w-full font-medium rounded-md text-white p-3"
                  type="submit"
                >
                  {loading ? <Spinner /> : "Continue with Email"}
                </button>
                <div className="flex items-center justify-between pt-3">
                  <Link
                    className="text-sm text-primary underline "
                    to="/signup"
                  >
                    Create account
                  </Link>
                  <Link className="text-sm underline text-gray" to="/">
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
