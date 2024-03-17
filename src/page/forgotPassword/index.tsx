// import { Loader } from "components/Spinner";
import React, { useState } from "react";

export default function Index() {
  const [email, setEmail] = useState("");

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
          Forgot password?
        </h1>
       <div className="w-5/6 mx-auto my-8">
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
        <button
          className="mb-4 bg-secondary-dark flex justify-center items-center flex-col h-12 mini:w-3/5 mx-auto font-medium rounded-md text-white p-3"
          type="submit"
        >
          {"Continue with email"}
        </button>
      </form>
    </main>
  );
}
