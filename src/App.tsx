import React, { useEffect, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "components/Spinner";
import NotFound from "page/notFound";
import AuthLayout from "components/AuthLayout";
import ProtectedRoutes from "components/ProtectedRoutes";
import BoardLayout from "components/BoardLayout";
const Login = lazy(() => import("page/login"));
const ForgotPassword = lazy(() => import("page/forgotPassword"));
const ResetPassword = lazy(() => import("page/resetPassword"));
const Signup = lazy(() => import("page/signup"));
const VerifyEmail = lazy(() => import("page/verifyEmail"));
const Board = lazy(() => import("page/board"));
const NewWorkspace = lazy(() => import("page/workspace/newWorkspace"));
const AvailableWorkspace = lazy(() => import("page/workspace"));
const Home = lazy(() => import("page/home"));
const Settings = lazy(() => import("page/workspace/settings"));
const User = lazy(() => import("page/user"));
import Task from "page/task";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
        <Route
          element={
            <GoogleOAuthProvider clientId={clientId}>
              <AuthLayout />
            </GoogleOAuthProvider>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/email-verify/:confirmationCode"
            element={<VerifyEmail />}
          />
        </Route>

        <Route element={<BoardLayout />}>
          <Route
            path="/workspace/settings"
            element={
              <ProtectedRoutes>
                <Settings />{" "}
              </ProtectedRoutes>
            }
          />
          <Route
            path="/workspace/user"
            element={
              <ProtectedRoutes>
                <User />{" "}
              </ProtectedRoutes>
            }
          />
          <Route
            path="/workspace/:workspaceId"
            element={
              <ProtectedRoutes>
                <Board />{" "}
              </ProtectedRoutes>
            }
          />

          <Route
            path="/workspace/:workspaceId/:boardId/:taskId"
            element={
              <ProtectedRoutes>
                <Task />{" "}
              </ProtectedRoutes>
            }
          />
        </Route>

        <Route
          path="/workspace/new"
          element={
            <ProtectedRoutes>
              <NewWorkspace />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/workspaces"
          element={
            <ProtectedRoutes>
              <AvailableWorkspace />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
