import { ReactElement, useEffect, useRef } from "react";

interface Props {
  items: {
    title: ReactElement | string;
    handler: () => void;
    status?: boolean;
  }[];
  style: any;
  description?: ReactElement;
  handleClose: () => void;
}

function Popup({ items, style,  handleClose, description }: Props) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (domRef.current && !domRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [ handleClose]);

  return (
    <div
      ref={domRef}
      style={style}
      className={`z-10 absolute bg-offwhite dark:bg-secondary rounded-md shadow-3xl dark:shadow-gray/10 shadow-gray/60 
     text-white w-fit right-6 top-5`}
    >
      <div className={`${description ? "w-[280px]" : "w-max"}`}>
        {description ? description : null}

        {items.map((list, i) => {
          return (
            <button
              key={i}
              disabled={list.status === false}
              onClick={list.handler}
              className={`block w-full text-left font-semiBold dark:text-white text-black hover:bg-gray/20 text-[13.5px] 
              ${
                description
                  ? ` py-3 px-4 text-[0.91rem] dark:text-white/80 text-black hover:bg-gray/20 hover:text-white ${i === items.length-1  && `rounded-b-md`}`
                  : `py-1  ${i === 0 && `rounded-t-md`} ${i === items.length-1  && `rounded-b-md`} px-3`
              }  
               ${i < items.length - 1 && `border-b-[1px] border-gray/10`}
              `}
            >
              {list.title}
            </button>
          );
        })}

      </div>
    </div>
  );
}

export default Popup;
