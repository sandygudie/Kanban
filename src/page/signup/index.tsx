import { Link, useLocation } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Spinner, { Loader } from "components/Spinner";
import { useCreateUserMutation, useGoogleLoginMutation } from "redux/authSlice";
import { useGoogleLogin } from "@react-oauth/google";

export default function Index() {
  const [signUp, { isLoading }] = useCreateUserMutation();
  const [googleSignUp, { isLoading: isGoogleLoginLoading }] =
    useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const location = useLocation();
  const [error, setError] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [validatePassword, setValidatePassword] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: location.state || "",
  });
  const passwordValidation = ["An uppercase letter", "5 characters minimum"];
  const noSpacesCheck = /\s/g;
  const upperCaseCheck = /[A-Z]/;
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupError("");
    setSignupSuccess("");

    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleChange = (e: any) => {
    setSignupError("");
    setSignupSuccess("");
    const tempPassword = e.target.value;

    if (tempPassword.length > 5) {
      if (!validatePassword.includes("5 characters minimum")) {
        setValidatePassword((prevState) => [
          ...prevState,
          "5 characters minimum",
        ]);
      }
    } else {
      setValidatePassword((prevState) => [
        ...prevState.filter((ele) => ele != "5 characters minimum"),
      ]);
    }
    if (upperCaseCheck.test(tempPassword)) {
      if (!validatePassword.includes("An uppercase letter")) {
        setValidatePassword((prevState) => [
          ...prevState,
          "An uppercase letter",
        ]);
      }
    } else {
      setValidatePassword((prevState) => [
        ...prevState.filter((ele) => ele != "An uppercase letter"),
      ]);
    }
    if (noSpacesCheck.test(tempPassword)) {
      if (!validatePassword.includes("No space")) {
        setValidatePassword((prevState) => [...prevState, "No space"]);
      }
    } else {
      setValidatePassword((prevState) => [
        ...prevState.filter((ele) => ele != "No space"),
      ]);
    }
    setPassword(tempPassword);
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      password.length > 5 &&
      !noSpacesCheck.test(password) &&
      upperCaseCheck.test(password)
    ) {
      setError(false);
      setPassword(password);
      const newFormdata = { ...formData, password };
      try {
        const response = await signUp(newFormdata).unwrap();
        setSignupSuccess(response.message);
      } catch (error: any) {
        setSignupError(error.message);
      }
    } else {
      setError(true);
    }
  };

  const signUpWithGoggle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleSignUp({
          token: tokenResponse.access_token,
        }).unwrap();
      } catch (error: any) {
        setSignupError(error.message);
      }
    },
  });

  return (
    <main className="h-full">
      <div className="h-full flex items-center flex-col">
        <div className="w-9/12  mini:w-[50rem] mx-auto">
          <h1 className="font-semibold text-3xl md:mt-8 md:pb-12 text-center">
            Sign Up
          </h1>
          <div className=" relative">
            <div className="flex gap-x-20 items-center">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="w-full md:w-1/2 relative flex items-center py-10 md:p-8 md:shadow-xl flex-col gap-y-4 justify-center"
              >
                <div className="block md:hidden">
                  <button
                    type="button"
                    onClick={() => signUpWithGoggle()}
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
                      {isGoogleLoginLoading ? (
                        <Spinner />
                      ) : (
                        "Sign up with Google"
                      )}
                    </div>
                  </button>
                </div>
                <p className="pb-4 md:hidden text-sm text-gray">OR</p>
                <input
                  type="text"
                  minLength={5}
                  autoComplete="off"
                  required
                  name="name"
                  value={formData.name}
                  className="py-3 px-4 rounded-lg w-full"
                  placeholder="What should we call you?"
                  onChange={(e) => handleInputChange(e)}
                />
                <input
                  required
                  type="email"
                  value={formData.email}
                  name="email"
                  className="py-3 px-4 rounded-lg w-full"
                  placeholder="Email Address"
                  onChange={(e) => handleInputChange(e)}
                />
                <div className="relative w-full">
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`${
                      error ? "border-error" : "border"
                    } border-[1px] py-3 px-4 rounded-lg w-full`}
                    placeholder="Password"
                    onChange={(e) => handleChange(e)}
                  />
                  <button type="button" className="absolute top-4 right-5">
                    {showPassword ? (
                      <AiOutlineEye
                        className="text-xl text-gray/80"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="text-xl text-gray/80"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </button>
                  <div className="mt-2 text-[13px] absolute">
                    {signupSuccess.length > 0 ? (
                      <p className="text-success text-center">
                        {signupSuccess}
                        <span> Check your inbox for verification link.</span>
                      </p>
                    ) : signupError.length > 0 ? (
                      <p className="text-error flex items-center gap-x-2">
                        {" "}
                        <IoAlertCircleOutline size={16} /> {signupError}
                      </p>
                    ) : (
                      <>
                        {password.length
                          ? passwordValidation.map((ele, index) => (
                              <p key={index}>
                                <span
                                  className={` ${
                                    validatePassword.includes(ele)
                                      ? "text-success"
                                      : "text-error"
                                  } text-[13px] flex items-center gap-x-2`}
                                >
                                  {validatePassword.includes(ele) ? (
                                    <IoCheckmarkCircleOutline size={16} />
                                  ) : (
                                    <IoAlertCircleOutline size={16} />
                                  )}
                                  {ele}
                                </span>
                              </p>
                            ))
                          : null}
                        {validatePassword.includes("No space") ? (
                          <p className="text-error text-[13px] flex items-center gap-x-2">
                            {" "}
                            <IoAlertCircleOutline size={16} />
                            No spaces
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full mt-10">
                  <button
                    className="bg-secondary-dark flex justify-center items-center flex-col w-full h-12 font-medium rounded-md text-white p-3"
                    type="submit"
                  >
                    {isLoading ? <Loader /> : "Continue with Email"}
                  </button>
                  <div className="text-right pt-2">
                    {" "}
                    <Link
                      className="text-xs underline text-gray hover:text-gray"
                      to="/login"
                    >
                      You have an account? log in
                    </Link>
                  </div>
                </div>
              </form>
              <hr className="border-r-[1px] border-gray/20 border-solid hidden md:block h-96" />
            </div>
            <div className="hidden md:block absolute right-0 top-36">
              <p className="pb-4 text-sm text-gray">With social account</p>
              <button
                type="button"
                onClick={() => signUpWithGoggle()}
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
                <p className="text-sm">Sign up with Google</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
