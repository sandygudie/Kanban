import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "components/Spinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useResetPasswordMutation } from "redux/authSlice";

export default function Index() {
  const { resetCode }: any = useParams();
  const [resetpassword, { isLoading, data: response }] =
    useResetPasswordMutation();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [validatePassword, setValidatePassword] = useState<string[]>([]);
  const passwordValidation = ["An uppercase letter", "5 characters minimum"];
  const noSpacesCheck = /\s/g;
  const upperCaseCheck = /[A-Z]/;

  const handleChange = (e: any) => {
    setError("")
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
      try {
        await resetpassword({ resetCode, password }).unwrap();
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      }
    } else {
      setError("password does not match");
    }
  };

  return (
    <main className="h-full flex items-center flex-col gap-y-4 justify-start md:justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-11/12 mini:w-4/6 md:w-1/2 relative pb-10 mini:px-8 md:p-10 rounded-md mini:shadow-3xl"
      >
        <h1 className="font-semibold text-2xl py-3 text-center">
          Reset password?
        </h1>
        <div className="relative mt-6 mb-12 w-5/6 mx-auto">
          <input
            type={showPassword ? "text" : "password"}
            minLength={5}
            autoComplete="off"
            required
            name="name"
            value={password}
            className="py-3 px-4 rounded-lg w-full"
            placeholder=" New password"
            onChange={(e) => handleChange(e)}
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

          <div className="mt-2 text-[13px] absolute -bottom-10">
            {response?.message ? (
              <p className="text-success text-center font-medium">{response.message}</p>
            ) : error.length > 0 ? (
              <p className="text-error flex font-medium items-center gap-x-2">
                {" "}
                <IoAlertCircleOutline size={16} /> {error}
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
        <button
          className="mb-4 bg-secondary-dark min-w-48 flex justify-center items-center flex-col h-12 mini:w-3/5 mx-auto font-medium rounded-md text-white p-3"
          type="submit"
        >
          {isLoading ? <Loader /> : "Reset Password"}
        </button>
      </form>
    </main>
  );
}
