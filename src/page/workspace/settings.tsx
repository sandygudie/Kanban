import IconButton from "components/IconButton";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="p-16">
     <div className="flex gap-x-4 items-center">
   <IconButton handleClick={()=> navigate(-1)}> <BiArrowBack className="text-2xl"/></IconButton> <h1 className="font-bold text-3xl">Settings</h1>
     </div>
      <div className="mt-14">
        <button className="border-none">About</button>
      </div>
      <div></div>
    </div>
  );
}
