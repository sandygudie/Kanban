import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "components/Spinner";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useVerifyEmailMutation } from "redux/authSlice";

export default function Index() {
  const [isVerify, setVerify] = useState("");
  const [error, setError] = useState(false);
  const { confirmationCode }: any = useParams();
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    emailVerify();
  }, []);

  const emailVerify = async () => {
    try {
      const response = await verifyEmail(confirmationCode).unwrap();
      setVerify(response.message);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <div className="flex bg-white text-black items-center justify-center h-[36rem]">
      {isVerify ? (
        <div>
          <IoIosCheckmarkCircleOutline className="text-8xl  mx-auto text-primary" />
          <p className="mb-8 text-secondary text-xl font-semiBold">
            {isVerify}
          </p>
          <Link
            className="p-4 rounded-lg w-full block text-center font-bold bg-black text-white"
            to="/workspace/new"
          >
            Continue{" "}
          </Link>
        </div>
      ) : error ? (
        <div className="text-center">
          <RiErrorWarningFill className="text-8xl text-error  mx-auto" />
          <p className="text-xl font-semiBold text-error mb-8">{error}</p>
          <Link className="text-black font-medium underline" to="/signup">
            {" "}
            Create an account{" "}
          </Link>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
