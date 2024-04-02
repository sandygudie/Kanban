import { ReactElement, useEffect, useRef } from "react";

interface Props {
  items: {
    title: ReactElement | string;
    handler: () => void;
    status?: boolean;
  }[];
  className?: string;
  description?: ReactElement;
  handleClose: () => void;
}

function Popup({ items, className, handleClose, description }: Props) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (domRef.current && !domRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClose]);

  return (
    <div
      ref={domRef}
      className={`${className} z-10 absolute bg-secondary rounded-md shadow-3xl
      w-fit`}
    >
      <div className={`${description ? "w-[280px]" : "w-max"}`}>
        {description ? description : null}

        {items?.map((list, i) => {
          return (
            <button
              key={i}
              disabled={list.status === false}
              onClick={list.handler}
              className={`block w-full font-medium text-left hover:bg-gray-200 text-[13.5px] 
              ${
                description
                  ? ` py-3 px-4 text-[0.91rem] hover:bg-gray-200 ${
                      i === items.length - 1 && `rounded-b-md`
                    }`
                  : `py-1  ${i === 0 && `rounded-t-md`} ${
                      i === items.length - 1 && `rounded-b-md`
                    } px-3`
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
