import React, { useState } from "react";
import { Loader } from "components/Spinner";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useForgotPasswordMutation } from "redux/authSlice";

export default function Index() {
  const [forgotpassword, { isLoading, data: response }] =
    useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await forgotpassword({ email }).unwrap();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <main className="h-full flex items-center flex-col gap-y-4 justify-start md:justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-11/12 mini:w-4/6 md:w-1/2 relative py-10 rounded-[10px] mini:px-8 md:p-10 mini:border border-gray/40 md:bg-white"
      >
        <h1 className="font-semibold text-2xl text-center">Forgot password?</h1>
        <div className="w-5/6 mx-auto mt-8 mb-4 relative">
          <input
            type="email"
            minLength={5}
            autoComplete="off"
            required
            name="email"
            value={email}
            className="py-3 px-4 rounded-lg w-full "
            placeholder="Email Address"
            onChange={(e) => {
              setError(""), setEmail(e.target.value);
            }}
          />
          <div className="absolute -bottom-6">
            {error ? (
              <p className="text-xs flex justify-center items-center text-error gap-x-2 font-medium">
                {" "}
                <IoAlertCircleOutline size={16} /> {error}{" "}
              </p>
            ) : response ? (
              <p className="font-medium text-success">{response.message}</p>
            ) : null}
          </div>
        </div>

        <button
          className="mb-4 mt-12 bg-primary-dark hover:bg-primary flex justify-center items-center min-w-48 flex-col h-12 mini:w-3/5 mx-auto font-medium rounded-md text-white p-3"
          type="submit"
        >
          {isLoading ? <Loader /> : "Continue with email"}
        </button>
      </form>
    </main>
  );
}
