import { useState } from "react";
import Icon from "components/Icon";
import logoMobile from "../../assets/logo-mobile.svg";

import { Formik, Form} from "formik";
import * as Yup from "yup";
import { TextInput } from "components/InputField";
import { Loader } from "components/Spinner";
import { useNavigate } from "react-router-dom";
import {
  saveloadWorkspaceData,
  loadWorkspaceData,

} from "utilis";
import {

  useJoinWorkspaceMutation,
} from "redux/apiSlice";
import { IoAlertCircleOutline} from "react-icons/io5";
import Create from "components/Workspace/Create";


const JoinWorkspaceForm = () => {
  const [joinWorkspace, { isLoading }] = useJoinWorkspaceMutation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const joinWorkspaceSchema = Yup.object().shape({
    workspaceName: Yup.string().required("Required"),
    inviteCode: Yup.string().required("Required"),
  });

  const joinWorkspaceHandler = async (values: any) => {
    try {
      const response = await joinWorkspace(values).unwrap();

      if (response) {
        saveloadWorkspaceData({ workspaceId: response.data.workspaceId });
        navigate(`/workspace/${response.data.workspaceId}`);
      }
    } catch (error: any) {
      console.log(error);
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
            placeholder="Name"
          />
        </div>
        <div className="my-4">
          <TextInput
            label="Workspace Code"
            name="inviteCode"
            type="text"
            placeholder="Invite code"
          />
        </div>
        {error ? (
          <p className="text-sm text-error flex items-center gap-x-2">
            {" "}
            <IoAlertCircleOutline size={16} /> {error}
          </p>
        ) : null}
        <div className="my-8">
          <button
            aria-label="Board"
            className="px-2 flex-col flex items-center justify-center text-white bg-primary h-12 font-bold py-4 w-full rounded-full"
            type="submit"
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default function NewWorkspace() {
  const navigate = useNavigate();
  // const currentTheme = localStorage.getItem("theme")!;
  // const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  const [toggle, setToggle] = useState(true);
  const currentWorkspace = loadWorkspaceData();
  // const updateThemehandler = (theme: string) => setTheme(theme);

  return (
    <div className={`w-full h-full `}>
      <header className="bg-white h-[65px] dark:bg-secondary flex items-center w-full border-b-[1px] border-gray/20">
        <div
          className={`border-r-[1px] border-gray/20 h-[65px] flex-col justify-center item-center px-4 min-w-[14rem] cursor-pointer hidden md:flex`}
        >
          <Icon type="kanban_logo" />
        </div>
        <div className="block md:hidden border-gray/20 p-3 cursor-pointer">
          <img src={logoMobile} alt="logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center font-bold text-gray justify-between w-full pr-2 md:px-4">
          {currentWorkspace?.workspaceId ? (
            <button onClick={() => navigate(`/workspaces`)}>
              Available Workspace(s)
            </button>
          ) : (
            <p>No Workspace</p>
          )}
          {/* <ToggleBtn updateThemehandler={updateThemehandler} theme={theme} /> */}
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
          <div className="w-96 mx-6 md:mx-0 h-[34rem]">
            <div>
              <h1 className="text-white text-xl sm:text-3xl md:text-3xl font-bold ">
                Welcome to Kanban!
              </h1>
              <p className="text-gray mt-1 text-sm mb-5">
                Get started by creating or joining a workspace!
              </p>
            </div>
            <div className="flex items-center gap-x-4">
              <button
                className={`${
                  toggle ? "bg-gray-200 text-white" : "text-base"
                }  w-full rounded-full text-xs p-3 border-[1px] border-gray-100`}
                onClick={() => setToggle(true)}
              >
                Create Workspace
              </button>
              <button
                className={`${
                  !toggle ? "bg-gray-200 text-white" : "text-base "
                }  w-full rounded-full text-xs p-3 border-[1px] border-gray-100`}
                onClick={() => setToggle(false)}
              >
                Join Workspace
              </button>
            </div>
            {toggle ? <Create/> : <JoinWorkspaceForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
