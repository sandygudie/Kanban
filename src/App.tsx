import React, { useEffect, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "page/notFound";
import AuthLayout from "components/AuthLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppLoader } from "components/Spinner";
import BoardLayout from "components/BoardLayout";
import Home from "page/home";
import Login from "page/login";
import Signup from "page/signup";
const ForgotPassword = lazy(() => import("page/forgotPassword"));
const ResetPassword = lazy(() => import("page/resetPassword"));
const VerifyEmail = lazy(() => import("page/verifyEmail"));
const Board = lazy(() => import("page/board"));
const NewWorkspace = lazy(() => import("page/workspace/newWorkspace"));
const AvailableWorkspace = lazy(() => import("page/workspace"));
const Settings = lazy(() => import("page/workspace/settings"));
const User = lazy(() => import("page/user"));
const Task = lazy(() => import("page/task"));


function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === null) {
      localStorage.setItem("theme", "dark");
    } else {
      document
        .querySelector("html")
        ?.setAttribute("data-theme", currentTheme.toLowerCase());
    }
  }, []);

  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-main">
          <AppLoader />
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
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:resetCode" element={<ResetPassword />} />
          <Route
            path="/email-verify/:confirmationCode"
            element={<VerifyEmail />}
          />
        </Route>
        <Route element={<BoardLayout />}>
          <Route path="/workspace/settings" element={<Settings />} />
          <Route path="/workspace/user" element={<User />} />
          <Route path="/workspace/:workspaceId" element={<Board />} />
          <Route
            path="/workspace/:workspaceId/:boardId/:taskId"
            element={<Task />}
          />
        </Route>
        <Route path="/workspace/new" element={<NewWorkspace />} />
        <Route path="/workspaces" element={<AvailableWorkspace />} />
        <Route path="*" element={<NotFound />} />
    
      </Routes>
    </React.Suspense>
  );
}

export default App;
