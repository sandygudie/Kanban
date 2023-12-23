import { ReactElement, useEffect, useRef } from "react";

interface Props {
  items: {
    title: string;
    handler: () => void;
  }[];
  style: any;
  description?: ReactElement;
  handleOpenMenu: () => void;
}

function Popup({ items, style, handleOpenMenu, description }: Props) {
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
      style={style}
      className={`  ${
        description ? "py-1" : "py-0"
      } absolute rounded-md  shadow-3xl dark:shadow-gray/20 shadow-gray/30 
      dark:bg-[#20212c] bg-offwhite text-white w-fit right-0 top-6 `}
    >
      <div className="w-max">
        {description ? description : null}
        <div className="">
          {items.map((list, i) => {
            return (
              <button
                key={i}
                onClick={list.handler}
                className={`dark:text-white text-gray block w-full text-left hover:bg-primary hover:text-white font-semiBold text-[0.95rem] ${
                  description ? "py-3 text-[0.9rem]" : "py-2 text-[0.8rem]"
                } px-6 
               ${i < items.length - 1 && `border-b-[1px] border-gray/20`}`}
              >
                {list.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Popup;
