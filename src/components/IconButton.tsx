import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  handleClick: () => void;
}
export default function IconButton({ children, handleClick }: Props) {
  return <button type="button" className="hover:text-gray" onClick={handleClick}>{children}</button>;
}
