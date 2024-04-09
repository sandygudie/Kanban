import { Checkbox } from "antd";
import { useState } from "react";
import { TitleCase, changeTheme, getCurrentTheme } from "utilis";

export default function Theme() {
  const currentTheme = getCurrentTheme()
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "");

  return (
    <div className="py-5 px-8 bg-secondary rounded-md">
      <h2 className="font-medium text-sm md:text-base mb-6">Theme Selection</h2>
      {[
        { id: 1, title: "light" },
        { id: 2, title: "dark" }
      ].map((ele) => {
        return (
          <div className="my-4" key={ele.id}>
            <Checkbox
              checked={theme === ele.title}
              value={theme === ele.title}
              onChange={() => {
                setTheme(ele.title), changeTheme(ele.title);
              }}
            >
              <p className="font-medium !text-inherit"> {TitleCase(ele.title)}</p>
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
}
