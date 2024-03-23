import { Checkbox } from "antd";
import { useState } from "react";
import { changeTheme } from "utilis";

export default function Theme() {
  const [theme, setTheme] = useState("");

  return (
    <div className="py-5 px-8 bg-secondary rounded-md">
      <h2 className="font-bold text-sm md:text-base mb-6">Theme Selection</h2>
      {[
        { id: 1, title: "Light" },
        { id: 2, title: "Dark" },
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
              <p className="font-medium !text-inherit"> {ele.title} </p>
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
}
