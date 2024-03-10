
import { Link, Outlet } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-white h-screen text-black">
    <header className="px-4 lg:px-16 py-4">
    <Link className="inline-flex items-center gap-x-2" to="/">
            <img
              src="logo.webp"
              className="w-8 h-8"
              alt="mutiple-projects-image"
            />
            <span className="font-bold text-2xl">TRACK</span>
          </Link>
    </header>
    <Outlet/>
    </div>
  )
}
