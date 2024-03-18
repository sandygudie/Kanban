import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoutes({ children }: any) {
  // const navigate = useNavigate();
  // const [cookies] = useCookies(["access_token"]);
  const token = Cookies.get("access_token");
  console.log("cookies", token);
  useEffect(() => {
    const verifyCookie = async () => {
      if (!token) {
        // navigate("/login");
      }
    };
    verifyCookie();
  }, [token]);

  return children;
}
