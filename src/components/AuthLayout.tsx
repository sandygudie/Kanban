import { Link, Outlet } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-[#f7f7f7] h-screen text-black">
      <header className="px-4 lg:px-16 py-4">
        <Link className="inline-flex items-center gap-x-2" to="/">
          <img
            src="/track_black_logo.webp"
            className="w-6 h-auto"
            alt="mutiple-projects-image"
          />

          <span className="hidden mini:block font-bold text-3xl">Kanban</span>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
