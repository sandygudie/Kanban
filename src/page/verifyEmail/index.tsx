import { useEffect, useState } from "react";
import { verifyEmail } from "services/api/auth";
import { Link, useParams } from "react-router-dom";
import Spinner from "components/Spinner";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Index() {
  const [isVerify, setVerify] = useState("");
  const [error, setError] = useState(false);
  const { confirmationCode }: any = useParams();

  useEffect(() => {
    emailVerify();
  }, []);

  const emailVerify = async () => {
    try {
      const response = await verifyEmail(confirmationCode);
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
          <p className="mb-8 text-primary text-lg text-semibold">{isVerify}</p>
          <Link className="p-4 rounded-lg bg-black text-white" to="/workspace">
            Continue{" "}
          </Link>
        </div>
      ) : error ? (
        <div className="text-center">
          <RiErrorWarningFill className="text-7xl text-error  mx-auto" />
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
