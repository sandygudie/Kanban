import { Link } from "react-router-dom";
export default function Index() {
  return (
    <main className="h-full">
      <div className="h-full">
        <div className="md:w-4/12 mx-auto">
          <h1 className="font-bold text-3xl pt-6 md:pb-12 text-center">
            Log In
          </h1>
          <div className="">
            <form className="w-full flex items-center md:border border-solid py-10 px-4 sm:px-12 md:shadow-lg flex-col gap-y-4 justify-center ">
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
                className="py-3 px-4 rounded-lg w-full"
                placeholder="Email Address"
              />
              <input
                className="py-3 px-4 rounded-lg w-full"
                placeholder="Password"
              />
              <div className="w-full mt-6">
                <button
                  className="bg-primary w-full font-medium rounded-md text-white p-3"
                  type="submit"
                >
                  Continue
                </button>
                <div className="flex items-center justify-between pt-3">
                <Link className="text-sm text-primary underline " to="/signup">
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
