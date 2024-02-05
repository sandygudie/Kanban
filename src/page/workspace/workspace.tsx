import { useState } from "react";
import Icon from "components/Icon";
import logoMobile from "../../assets/logo-mobile.svg";
import ToggleBtn from "components/ToggleBtn";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextArea } from "components/InputField";
import { createWorkspace, joinWorkspace } from "services/api/workspace";
import Spinner from "components/Spinner";
import { useNavigate } from "react-router-dom";

const CreateWorkspaceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const createWorkspaceSchema = Yup.object().shape({
    workspaceName: Yup.string()
      .required("Required")
      .test("len", "At least 5 - 25 characters", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 25;
      }),
    description: Yup.string(),
  });

  const createNewWorksapce = async (values: any) => {
    console.log(values);
    setLoading(true);
    try {
      const response = await createWorkspace(values);
      if (response) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <Formik
      initialValues={{ workspaceName: "", description: "" }}
      validateOnChange={false}
      validationSchema={createWorkspaceSchema}
      validateOnBlur={false}
      onSubmit={createNewWorksapce}
    >
      <Form>
        <div className="mt-6 mb-4">
          <TextInput
            label="Workspace Name"
            name="workspaceName"
            type="text"
            placeholder="E.g xyz"
          />
        </div>
        <div>
          <TextArea
            placeholder="E.g A brief description about the workspace (optional)"
            name="description"
            label="Description"
          />
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <div className="my-8">
          <button
            className=" px-2 flex justify-center text-white bg-primary h-14 font-bold py-4 w-full rounded-full"
            type="submit"
          >
            {loading ? <Spinner /> : "Continue"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

const JoinWorkspaceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const joinWorkspaceSchema = Yup.object().shape({
    workspaceName: Yup.string().required("Required"),
    inviteCode: Yup.string().required("Required"),
  });

  const joinWorkspaceHandler = async (values: any) => {
    console.log(values);
    setLoading(true);
    try {
      const response = await joinWorkspace(values);
      if (response) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <Formik
      initialValues={{ workspaceName: "", inviteCode: "" }}
      validateOnChange={false}
      validationSchema={joinWorkspaceSchema}
      validateOnBlur={false}
      onSubmit={joinWorkspaceHandler}
    >
      <Form>
        <div className="my-6">
          <TextInput
            label="Workspace Name"
            name="workspaceName"
            type="text"
            placeholder="Workspace name"
          />
        </div>
        <div className="my-6">
          <TextInput
            label="Workspace Code"
            name="inviteCode"
            type="text"
            placeholder="Workspace invite code"
          />
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <div className="my-8">
          <button
            aria-label="Board"
            className=" px-2 text-white bg-primary font-bold py-4 w-full text-sm rounded-full"
            type="submit"
          >
            {loading ? <Spinner /> : "Continue"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default function Workspace() {
  const currentTheme = localStorage.getItem("theme")!;
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const [toggle, setToggle] = useState(true);

  const updateThemehandler = (theme: string) => setTheme(theme);

  return (
    <div className={`w-full h-full `}>
      <header className="bg-white h-[65px] dark:bg-secondary flex items-center w-full border-b-[1px] border-gray/20">
        <div
          className={`border-r-[1px] border-gray/20 py-6 px-4 min-w-[14rem] cursor-pointer hidden md:block`}
        >
          <Icon type="kanban_logo" />
        </div>
        <div className="block md:hidden border-gray/20 p-3 cursor-pointer">
          <img src={logoMobile} alt="logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-between w-full pr-2 md:px-4">
          <h1 className="font-bold text-gray text-lg">
            {/* {profile.id.length > 0 ? "Workspace" : "No Workspace"}  */}
            No Workspace
          </h1>
          <ToggleBtn updateThemehandler={updateThemehandler} theme={theme} />
        </div>
      </header>
      <main className="h-screen overflow-auto">
        <div className="flex-wrap flex items-center relative h-full justify-evenly">
          <img
            src="/start-project.webp"
            alt="start project"
            loading="eager"
            className="hidden md:inline w-[25rem] h-auto"
          />
          <div className="w-96 mx-6 md:mx-0 h-[34rem] md:h-[30rem]">
            <div>
              <h1 className="text-primary text-xl sm:text-3xl md:text-3xl font-bold ">
                Welcome to Kanban!
              </h1>
              <p className="text-gray mt-1 text-sm mb-8">
                Get started by creating or joining a workspace!
              </p>
            </div>
            <div className="flex mt-2 items-center gap-x-6">
              <button
                className={`${
                  toggle ? "bg-primary text-white" : " bg-gray/30    text-base"
                }  w-full rounded-full text-xs md:text-sm p-2.5`}
                onClick={() => setToggle(true)}
              >
                Create Workspace
              </button>
              <button
                className={`${
                  !toggle ? "bg-primary text-white" : "text-base  bg-gray/30"
                }  w-full rounded-full text-xs md:text-sm p-2.5`}
                onClick={() => setToggle(false)}
              >
                Join Workspace
              </button>
            </div>
            {toggle ? <CreateWorkspaceForm /> : <JoinWorkspaceForm />}
            {/* */}
          </div>
        </div>
      </main>
    </div>
  );
}
