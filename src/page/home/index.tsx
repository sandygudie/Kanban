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
              alt="kanban logo"
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
              src="./curve.png"
              className=" w-[30rem] -top-40 -right-56 absolute"
              alt="curve shape"
            />
            <h1 className="font-bold text-[2.5rem] md:text-6xl">
              <p className="title-left"> Effortlessly Manage</p>
              <p className="title-right">Your Projects.</p>
            </h1>
            <div className="description">
              <p className="mini:px-8 lg:p-0 lg:w-[50ch] mx-auto text-[24px] my-4 mini:my-8 font-normal text-gray-400 leading-[2.5rem]">
                <span className="font-bold text-2xl text-black">Kanban</span>{" "}
                offers a visual view for teams to manage tasks, quickly shift
                priorities, track project progress, and stay on top of
                deadlines.
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
            <img
              src="./cirlce_flame.png"
              className="w-48 md:w-64 mx-auto"
              alt="cirlce flame"
            />
          </div>
          <section className="sm:px-8 lg:px-16">
            <img
              className="rounded-lg md:rounded-2xl w-auto h-auto"
              src="./boardview.png"
              alt="kanban board"
            />
          </section>
          <section className="relative">
            <img
              src="./dot_splash.png"
              className="w-48 md:w-72 top-10 -left-20 absolute"
              alt="dot splash"
            />

            <div className="flex items-center justify-between p-8 mini:p-24 flex-col md:flex-row">
              <img
                src="./question_icon.png"
                className="hidden md:block w-36 md:w-64"
                alt="question mark"
              />
              <div className="text-left md:w-1/2 z-20">
                <h2 className="text-[2.125rem] text-gray-500 pb-2 font-bold">
                  Why Kanban Board?
                </h2>
                <div>
                  <p className="text-gray-400 text-lg leading-loose">
                    Kanban offers all the features your team need to build in an
                    Agile development framework. </p>
                    <p>
                      We helps your teams to{" "}
                      <span className="font-bold text-[#7a72bd]">
                        organize tasks
                      </span>
                      ,{" "}
                      <span className="font-bold text-[#7a72bd]">
                        streamline workflows
                      </span>
                      , and{" "}
                      <span className="font-bold text-[#7a72bd]">
                        improve efficiency
                      </span>
                      .
                    </p>
                 
                </div>
              </div>
            </div>
            <div className="text-center text-3xl font-bold pl-8 py-12">
              What you get
            </div>
            <div className="flex items-center text-center justify-center md:justify-between p-8 md:p-24 bg-[#f1efff66] flex-row-reverse flex-wrap">
              <img
                src="./real_time_collaboration.png"
                className="w-20 md:w-64"
                alt="people sitting around the clock"
              />
              <div className="text-left md:w-1/2">
                {" "}
                <h3 className="text-2xl md:text-[2.125rem] text-gray-500 pb-4 font-bold">
                  Real-Time Collaboration
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Changes made by any team member are instantly visible to
                  others, ensuring everyone is working with the most up-to-date
                  information.
                  <p className="pt-2 hidden md:block">
                    Multiple users can edit tasks, add comments, and update
                    status simultaneously without conflicts or delays.
                  </p>
                </p>
              </div>
            </div>
            <div className="flex items-center text-center justify-center md:justify-between p-8 md:p-24 flex-wrap">
              <img
                src="./chat.png"
                className="w-20 md:w-64"
                alt="messaging box"
              />
              <div className="text-left md:w-1/2">
                <h3 className="text-2xl md:text-[2.125rem] text-gray-500 pb-4 font-bold">
                  Real-Time Communication
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Built-in chat functionalities for team members to discuss
                  tasks, share ideas, and resolve issues in real-time. Team
                  members can leave comments on tasks and use mentions to notify
                  specific colleagues, making communication more
                  context-specific and targeted.
                  <p className="pt-2 hidden md:block">
                    {" "}
                    Instant communication among team members, allowing for quick
                    discussions, decision-making and resolving issues in
                    real-time.
                  </p>
                </p>
              </div>
            </div>
            <div className="flex items-center text-center justify-center md:justify-between p-8 md:p-24 bg-[#f1efff66] flex-row-reverse flex-wrap">
              <img src="./layout.png" className="w-20 md:w-64" alt="layout" />
              <div className="text-left md:w-1/2">
                <h3 className="text-2xl md:text-[2.125rem] text-gray-500 pb-4 font-bold">
                  Interactive Workspace Management
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Tailor workspace to fit needs and preferences, include layout
                  and theme selection.
                  <p className="pt-2 hidden md:block">
                    {" "}
                    The Drag-and-drop features for tasks allow for quick
                    reorganization and reassignment, reflecting changes
                    instantly. Customizable Workflows allows for adjusting
                    workflows on the fly to reflect changing project
                    requirements and priorities.
                  </p>
                </p>
              </div>
            </div>
            <div className="flex items-center text-center justify-center md:justify-between p-8 md:p-24 flex-wrap">
              <img
                src="simplified-board.png"
                className="w-20 md:w-64"
                alt="Ipad view"
              />
              <div className="text-left md:w-1/2">
                <h3 className="text-2xl md:text-[2.125rem] text-gray-500 pb-4 font-bold">
                  Simplified Board View
                </h3>
                <p className="text-gray-400  text-lg leading-relaxed">
                  Quick visual representation of tasks and their progress,
                  through columns representing different stages.
                  <p className="pt-2 hidden md:block">
                    Compact, easily accessible menu for navigation to different
                    sections or views
                  </p>
                </p>
              </div>
            </div>
          </section>

          <section
            style={{ backgroundImage: `url("./puple_bg_curved.svg")` }}
            className="bg-[#f1efff] py-64 cover bg-no-repeat bg-center relative text-white flex items-center justify-center flex-col"
          >
            <div className="z-40 text-center">
              {" "}
              <h3 className="text-3xl font-bold">Start working smarter.</h3>
              <p className="mb-4 text-base">
                Try it for free. No credit card required.
              </p>
              <a
                href="/signup"
                className="bg-primary hover:bg-primary-hover p-3 w-64 block rounded-lg mx-auto font-bold"
              >
                Sign Up for free
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
