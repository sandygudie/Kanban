import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Spinner from "components/Spinner";
import NotFound from "page/notFound";
import Workspace from "page/workspace";
import Dashboard from "page/dashboard";
import Home from "page/home";
import Login from "page/login";
import Signup from "page/signup";
import VerifyEmail from "page/verifyEmail";
import AuthLayout from "components/AuthLayout";

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
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
