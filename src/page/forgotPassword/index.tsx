import React, { useState } from "react";
import { Loader } from "components/Spinner";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useForgotPasswordMutation } from "redux/authSlice";

export default function Index() {
  const [forgotpassword, { isLoading, data:response }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  

  

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await forgotpassword({ email }).unwrap();
    } catch (error:any) {
      setError(error.message);
    }
  };

  return (
    <main className="h-full flex items-center flex-col gap-y-4 justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-11/12 mini:w-4/6 md:w-1/2 relative py-10 mini:px-8 md:p-10 mini:shadow-xl"
      >
        <h1 className="font-semibold text-2xl text-center">
          Forgot password?
        </h1>
        <div className="w-5/6 mx-auto mt-8 mb-4">
          <input
            type="email"
            minLength={5}
            autoComplete="off"
            required
            name="email"
            value={email}
            className="py-3 px-4 rounded-lg w-full "
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error? <p className="text-xs flex justify-center items-center mb-4 text-error gap-x-2 font-medium">
          {" "}
          <IoAlertCircleOutline size={16} /> {error}{" "}
        </p>: response?<p className="font-medium ml-8 text-success">{response.message}</p>: null}
        <button
          className="mb-4 bg-secondary-dark flex justify-center items-center min-w-48 flex-col h-12 mini:w-3/5 mx-auto font-medium rounded-md text-white p-3"
          type="submit"
        >
          {isLoading ? <Loader /> : "Continue with email"}
        </button>
       
      </form>
    </main>
  );
}



//react hooks for google and password checks