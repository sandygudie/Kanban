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
    <div className="bg-no-repeat bg-cover w-full novisible-scroll h-screen text-black overflow-y-auto bg-white relative w-full">
      <div ref={hero} className="">
        <header className="header fixed z-40 w-full bg-white flex items-center shadow-xl bg-inherit justify-between px-4 lg:px-8 py-4">
          <Link className="inline-flex items-center gap-x-2" to="/">
            <img
              src="/track_black_logo.webp"
              className="w-6 h-auto"
              alt="mutiple-projects-image"
            />
            <span className="hidden mini:block font-bold text-3xl">Kanban</span>
          </Link>

          <div className="flex items-center">
            <Link
              to="/login"
              className="p-2 border rounded-lg w-24 text-center border-primary font-semibold !text-primary"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="!text-white font-semibold w-24 text-center ml-4 p-2 rounded-lg bg-primary hover:bg-primary-hover"
            >
              Sign Up
            </Link>
          </div>
        </header>

        <main className="h-full overflow-auto pt-40 overflow-hidden md:pb-16 text-center">
          <section className="px-4 sm:px-8 lg:px-16 relative">
            {" "}
            <img
              src="./3.png"
              className=" w-[30rem] -top-40 -right-56 absolute"
            />
            <h1 className="font-bold text-[2.5rem] md:text-6xl">
              <p className="title-left"> Effortlessly Manage</p>
              <p className="title-right">Your Projects.</p>
            </h1>
            <div className="description">
              <p className="md:px-8 lg:p-0 lg:w-[50ch] mx-auto text-[24px] my-4 mini:my-8 font-normal leading-[2.5rem]">
                <span className="font-bold text-2xl">Kanban</span> offers a
                visual view for teams to manage tasks, quickly shift priorities,
                track project progress, and stay on top of deadlines.
              </p>

              <div className="w-auto md:w-fit mx-auto relative">
                <form onSubmit={() => navigate("/signup", { state: email })}>
                  <input
                    onChange={(e) =>
                      e.target ? setEmail(e.target.value) : null
                    }
                    required
                    type="email"
                    placeholder="Email address"
                    className="rounded-full w-full border focus:border-black/70 border-black/40 placeholder:text-black/50 md:w-[30rem] h-12 px-6"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-primary hover:bg-primary-hover mini:mt-0 w-full mini:w-auto text-sm text-white mini:absolute top-0 right-0 rounded-full px-4 h-12 font-semibold"
                  >
                    Get Started
                  </button>
                </form>
              </div>
            </div>
          </section>
          <div className="mini:py-12">
            <img src="./4.png" className="w-48 mini:w-64 mx-auto" />
          </div>
          <section className="sm:px-8 lg:px-16 ">
            <img
              className="rounded-lg md:rounded-2xl"
              src="./boardview.png"
              alt="kanban board"
            />
          </section>
          <section className="px-4 relative sm:px-8 lg:px-16 mt-12 md:pt-36 pb-24 flex items-center justify-between lg:justify-center flex-wrap">
            <img src="./2.png" className=" w-72 top-10 -left-20 absolute" />
            <div className="mini:w-[40%] z-20 md:w-1/3 text-left">
              <h2 className="text-4xl pb-4 font-bold">
                What is special about Kanban board?
              </h2>
              <p className="text-base md:w-4/5 text-gray">
                Kanban offers all the features your team need to build in an
                Agile development framework.{" "}
              </p>
            </div>
            <div className="mini:w-[60%] md:w-1/2 z-20">
              <div className="flex items-center rounded-t-lg gap-x-6 py-4 md:px-6">
                <img src="./collaboration.png" className="w-10" />
                <div className="text-left">
                  {" "}
                  <h3 className="text-lg pb-1 font-semibold ">
                    Real time collaboration
                  </h3>
                  <p className="text-base text-gray">
                    Enables team members to simultaneously update and manage
                    tasks, ensuring everyone has the latest information.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-6 py-4 md:px-6">
                <img src="./chat.png" className="w-10" />
                <div className="text-left">
                  <h3 className="text-lg pb-1 font-semibold ">Chat</h3>
                  <p className="text-base text-gray">
                    Instant communication among team members, allowing for quick
                    discussions, decision-making and resolving issues in
                    real-time.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-6 py-4 md:px-6">
                <img src="./layout.png" className="w-10" />
                <div className="text-left">
                  <h3 className="text-lg pb-1 font-semibold ">
                    Customized view
                  </h3>
                  <p className="text-base text-gray">
                    Tailor workspace to fit needs and preferences, include
                    layout and theme selection.
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-b-lg gap-x-6 py-4 md:px-6">
                <img src="simplified-board.png" className="w-10" />
                <div className="text-left">
                  <h3 className="text-lg pb-1 font-semibold">
                    Simplified Board view
                  </h3>
                  <p className="text-base text-gray">
                    Quick visual representation of tasks and their progress,
                    through columns representing different stages.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* <p>Track project of your work all in one place.</p> */}
          <section
            style={{ backgroundImage: `url("./2.svg")` }}
            className="bg-[#f1efff] py-64 cover bg-no-repeat bg-center relative text-white flex items-center justify-center flex-col"
          >
            <div className="z-40 text-center">
              {" "}
              <h2 className="text-3xl font-bold">Start working smarter.</h2>
              <p className="mb-4 text-base">
                Try it for free. No credit card required.
              </p>
              <a
                href="/signup"
                className="bg-primary hover:bg-primary-hover p-3 w-64 block rounded-lg mx-auto font-bold"
              >
                Get Started
              </a>
            </div>
          </section>
        </main>
        <footer className="py-3 w-full text-xs text-center text-black">
          Copyright <span>&copy;</span>
          {new Date().getFullYear()}. Sandy Goodnews
        </footer>
      </div>
    </div>
  );
}
