import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  gsap.registerPlugin(ScrollTrigger);
  const hero = useRef(null);
  useGSAP(
    () => {
      gsap.from(".header", {
        duration: 0.5,
        opacity: 0,
        y: -50,
        ease: "back",
      });
      gsap.from(".title-left", {
        duration: 0.5,
        opacity: 0,
        delay: 0.5,

        y: 10,
      });
      gsap.from(".title-right", {
        duration: 0.8,
        delay: 0.8,
        opacity: 0,
        y: 20,
      });
      gsap.from(".description", {
        duration: 1,
        opacity: 0,
        delay: 1.2,
        y: 40,
      });
    },

    { scope: hero }
  );

  return (
    <div
      style={{ backgroundImage: `url("download.webp")` }}
      className="bg-no-repeat bg-cover w-full home-container bg-primary/10 h-screen text-black overflow-y-auto bg-white relative w-full"
    >
      <div ref={hero} className="">
        <header className="header flex items-center justify-between px-4 lg:px-16 py-4">
          <Link className="inline-flex items-center gap-x-2" to="/">
            <img
              src="/track_black_logo.webp"
              className="w-6 h-auto"
              alt="mutiple-projects-image"
            />
            <span className="font-bold text-3xl">Kanban</span>
          </Link>

          <div className="flex items-center ">
            <Link
              to="/login"
              className="hover:scale-110 p-2 rounded-lg font-normal transition ease-in-out delay-100 duration-300"
            >
              Log In
            </Link>
            <span> | </span>
            <Link
              to="/signup"
              className="hover:scale-110 p-2 rounded-lg font-normal transition ease-in-out delay-100 duration-300"
            >
              Sign Up
            </Link>
          </div>
        </header>

        <main className="h-full md:h-screen px-4 sm:px-8 lg:px-0 lg:w-3/6 mx-auto py-16 text-center">
          <h1 className="font-bold text-[2.5rem] md:text-6xl">
            <p className="title-left"> Effortlessly Manage </p>
            <p className="title-right">Your Projects.</p>
          </h1>
          <div className="description">
            <p className="md:px-8 lg:p-0 text-[20px] my-8 font-normal leading-[2.5rem]">
              <span className="font-bold text-2xl">Kanban</span> offers a visual
              view for teams to manage tasks, quickly shift priorities, track
              project progress, and stay on top of deadlines.
            </p>

            <div className="w-auto md:w-fit mx-auto relative">
              <form onSubmit={() => navigate("/signup", { state: email })}>
                <input
                  onChange={(e) => (e.target ? setEmail(e.target.value) : null)}
                  required
                  type="email"
                  placeholder="Email address"
                  className="rounded-full w-full border focus:border-black/70 border-black/40 placeholder:text-black/50 md:w-[30rem] h-12 px-6"
                />
                <button
                  type="submit"
                  className="mt-2 mini:mt-0 w-full mini:w-auto text-sm bg-black text-white mini:absolute top-0 right-0 transition ease-in-out delay-100 duration-300 hover:scale-110 text-black rounded-full px-4 h-12 font-medium"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </main>
        <footer className="py-3 w-full text-xs text-center text-black">
          Copyright <span>&copy;</span>
          {new Date().getFullYear()}. Sandy Goodnews
        </footer>
      </div>
    </div>
  );
}
