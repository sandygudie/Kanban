import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoutes({ children }: any) {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!token) {
        navigate("/login");
      }
    };
    verifyCookie();
  }, [navigate, token]);

  return children;
}
