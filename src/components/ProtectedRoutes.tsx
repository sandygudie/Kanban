import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ProtectedRoutes({ children }: any) {
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);
console.log(cookies)
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.access_token) {
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies.access_token, navigate]);

  return children;
}
