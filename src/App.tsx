import React, { useEffect,lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "components/Spinner";
import NotFound from "page/notFound";
import AuthLayout from "components/AuthLayout";
import ProtectedRoutes from "components/ProtectedRoutes";
const Login= lazy(() => import('page/login'));
const Signup= lazy(() => import('page/signup'));
const VerifyEmail= lazy(() => import('page/verifyEmail'));
const Dashboard = lazy(() => import('page/dashboard/dashboard'));
const Workspace= lazy(() => import('page/workspace/workspace'));
const Home = lazy(() => import('page/home'));

function App() {
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === null) {
      localStorage.setItem("theme", "dark");
    }
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-skin-fill">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/email-verify/:confirmationCode"
            element={<VerifyEmail />}
          />
        </Route>

        <Route
          path="/workspace"
          element={
            <ProtectedRoutes>
              <Workspace />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />{" "}
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
