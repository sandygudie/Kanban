import { Link, useLocation } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Loader } from "components/Spinner";
import { useCreateUserMutation } from "redux/authSlice";
import GoogleLogin from "components/GoogleLogin";

export default function Index() {
  const [signUp, { isLoading }] = useCreateUserMutation();
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

  return (
    <main className="h-full">
      <div className="h-full flex items-center flex-col">
        <div className="w-9/12 md:w-[60rem] mx-auto">
          <h1 className="font-semibold text-2xl md:pb-4 text-center">
            Register your account
          </h1>
          <div className=" relative">
            <div className="flex gap-x-20 items-center">
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="w-full md:w-[50%] mx-auto relative flex items-center py-10 mini:p-12 flex-col gap-y-4 justify-center rounded-[10px] md:border md:bg-white border-gray/40"
              >
                <div className="w-full">
                  <p className="pb-2 text-sm text-gray">With social account</p>
                  <GoogleLogin />
                </div>

                <div className="overflow-hidden flex items-center justify-center  w-11/12">
                  {" "}
                  <hr className="border-r-[1px] border-gray/20 border-solid w-full" />{" "}
                  <p className="text-sm text-gray font-medium w-36 text-center">OR</p>{" "}
                  <hr className="border-r-[1px] border-gray/20 border-solid w-full" />
                </div>
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
                    ) : signupError?.length > 0 ? (
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
                    className="bg-primary hover:bg-primary-hover flex justify-center items-center flex-col w-full h-12 font-medium rounded-md text-white p-3"
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
                      You have an account? Login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            {/* <div className="hidden md:block absolute right-20 top-36">
              <p className="pb-4 text-sm text-gray">With social account</p>
              <GoogleLogin />
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
