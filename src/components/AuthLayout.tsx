import Icon from "components/Icon";
import { Link, Outlet } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-white h-screen text-black">
    <header className="px-4 lg:px-16 py-4">
      <Link className="hidden md:inline" to="/">
        <Icon type="kanban_logo" />
      </Link>
      <Link className="inline md:hidden" to="/">
        <Icon type="logo_mobile" />
      </Link>
    </header>
    <Outlet/>
    </div>
  )
}
