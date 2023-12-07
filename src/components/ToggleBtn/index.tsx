import { useState } from "react";

export default function Index() {
  const [theme, setTheme] = useState("dark");

  return (
    <div
      onClick={() => {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
          setTheme("light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          setTheme("dark");
        }
      }}
      className="rounded-full cursor-pointer bg-primary p-1 w-12"
    >
      <div
        className={`rounded-full bg-white p-2 w-[20px] h-[20px] transition ease-in-out duration-[0.4s]
      ${theme === "dark" ? "translate-x-5": ""}`}
      ></div>
    </div>
  );
}
