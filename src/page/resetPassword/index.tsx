// import { Loader } from "components/Spinner";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Index() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <main className="h-full flex items-center flex-col gap-y-4 justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-11/12 mini:w-4/6 md:w-1/2 relative md:border border-solid py-10 mini:px-8 md:p-10 mini:shadow-lg"
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
          {"Reset Password"}
        </button>
      </form>
    </main>
  );
}
