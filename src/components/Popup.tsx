import { useEffect, useRef } from "react";

interface Props {
  items: {
    title: string;
    handler: () => void;
  }[];
  handleOpenMenu: ()=>void;
}

function Popup({ items, handleOpenMenu }: Props) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (domRef.current && !domRef.current.contains(e.target)) {
        handleOpenMenu();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleOpenMenu]);

  return (
    <div
      ref={domRef}
      className="z-40 absolute py-2 text-sm shadow-xl dark:shadow-white/20 shadow-gray/50 
      dark:bg-secondary bg-white right-5 top-10 rounded-md"
    >
      <ul className="w-36">
        {items.map((list, i) => {
          return (
            <li
              key={i}
              onClick={list.handler}
              className={`hover:text-primary py-2 px-6
               cursor-pointer ${i < 1 && `border-b-[1px] border-gray/10`}`}
            >
              {list.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Popup;
