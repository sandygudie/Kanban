

import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Loader } from "components/Spinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useResetPasswordMutation } from "redux/authSlice";

export default function Index() {
  const {resetCode }: any = useParams();
  const [resetpassword, { isLoading, data: response }] =
    useResetPasswordMutation();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await resetpassword({ password }).unwrap();
    } catch (error: any) {
      setError(error.message);
    }
  };
console.log(resetCode)
  return (
    <main className="h-full flex items-center flex-col gap-y-4 justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-11/12 mini:w-4/6 md:w-1/2 relative py-10 mini:px-8 md:p-10 mini:shadow-xl"
      >
        <h1 className="font-semibold text-2xl py-3 text-center">
          Reset password?
        </h1>
        <div className="relative my-6 w-5/6 mx-auto">
          <input
            type={showPassword.password ? "text" : "password"}
            minLength={5}
            autoComplete="off"
            required
            name="name"
            value={password}
            className="py-3 px-4 rounded-lg w-full"
            placeholder=" New password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="absolute top-4 right-5">
            {showPassword.password ? (
              <AiOutlineEye
                className="text-xl"
                onClick={() =>
                  setShowPassword((prevFormData) => ({
                    ...prevFormData,
                    password: false,
                  }))
                }
              />
            ) : (
              <AiOutlineEyeInvisible
                className="text-xl"
                onClick={() =>
                  setShowPassword((prevFormData) => ({
                    ...prevFormData,
                    password: true,
                  }))
                }
              />
            )}
          </button>
        </div>
        <div className="relative my-6 w-5/6 mx-auto">
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            minLength={5}
            autoComplete="off"
            required
            name="name"
            value={confirmPassword}
            className="py-3 px-4 rounded-lg w-full"
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" className="absolute top-4 right-5">
            {showPassword.confirmPassword ? (
              <AiOutlineEye
                className="text-xl"
                onClick={() =>
                  setShowPassword((prevFormData) => ({
                    ...prevFormData,
                    confirmPassword: false,
                  }))
                }
              />
            ) : (
              <AiOutlineEyeInvisible
                className="text-xl"
                onClick={() =>
                  setShowPassword((prevFormData) => ({
                    ...prevFormData,
                    confirmPassword: true,
                  }))
                }
              />
            )}
          </button>
        </div>
        <button
          className="my-8 bg-secondary-dark flex justify-center items-center flex-col h-12 mini:w-3/5 mx-auto font-medium rounded-md text-white p-3"
          type="submit"
        >
          {isLoading ? <Loader /> : "Reset Password"}
        </button>
        {error ? (
          <p className="text-xs flex items-center text-error gap-x-2">
            {" "}
            <IoAlertCircleOutline size={16} /> {error}{" "}
          </p>
        ) : response ? (
          <p className="font-medium ml-8 text-success">{response.message}</p>
        ) : null}
      </form>
    </main>
  );
}
