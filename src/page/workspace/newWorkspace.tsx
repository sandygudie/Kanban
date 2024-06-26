import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "components/InputField";
import { Loader } from "components/Spinner/index";
import { useNavigate } from "react-router-dom";
import { getCurrentTheme, saveloadWorkspaceData } from "utilis";
import {
  useGetAllWorkspacesQuery,
  useJoinWorkspaceMutation,
} from "redux/apiSlice";
import { IoAlertCircleOutline } from "react-icons/io5";
import CreateWorkspace from "components/Workspace/Create";
import { IJoinWorkspace } from "types/workspace";

const JoinWorkspaceForm = () => {
  const [joinWorkspace, { isLoading }] = useJoinWorkspaceMutation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const joinWorkspaceSchema = Yup.object().shape({
    workspaceName: Yup.string().required("Required"),
    inviteCode: Yup.string().required("Required"),
  });

  const joinWorkspaceHandler = async (values:IJoinWorkspace) => {
    try {
      const response = await joinWorkspace(values).unwrap();
      if (response) {
        saveloadWorkspaceData({ workspaceId: response.data.workspaceId });
        navigate(`/workspace/${response.data.workspaceId}`);
      }
    } catch (error: any) {
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
            placeholder="Workspace Invite code"
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
            className="px-2 flex-col md:text-lg flex items-center justify-center text-white bg-primary hover:bg-primary-hover h-12 font-bold py-4 w-full rounded-full"
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
  const currentTheme = getCurrentTheme();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const { data: response, isLoading } = useGetAllWorkspacesQuery();

  return (
    <div className={`w-full h-full`}>
      <header className="h-[65px] flex items-center w-full border-b-[1px] border-gray/20">
        <div
          className={`border-r-[1px] border-gray/20 h-[65px] flex flex-col justify-center px-4 md:min-w-[14rem] cursor-pointer`}
        >
          <div className="inline-flex items-center gap-x-2">
            <img
              src={
                currentTheme === "dark"
                  ? "/track_logo.webp"
                  : "/track_black_logo.webp"
              }
              className="w-6 h-auto"
              alt="mutiple-projects-image"
            />
            <span className="hidden md:block font-bold text-2xl">Kanban</span>
          </div>
        </div>
        <div className="flex items-center font-bold justify-between w-full pl-2 md:px-4">
          {isLoading ? (
            <Loader />
          ) : response.data.workspace.length ? (
            <button
              className="md:text-lg"
              onClick={() => navigate(`/workspaces`)}
            >
              Available Workspace(s)
            </button>
          ) : (
            <p>No Workspace</p>
          )}
        </div>
      </header>
      <main className="h-screen overflow-auto">
        <div className="flex-wrap py-10 flex item-start md:items-center relative h-full justify-evenly overflow-auto">
          <img
            src="/start-project.webp"
            alt="start project"
            loading="eager"
            className="hidden md:inline w-[25rem] h-auto"
          />
          <div className="w-96 mx-6 md:mx-0 h-[34rem]">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">
                Welcome to Kanban!
              </h1>
              <p className="text-gray font-medium mt-1 text-sm mb-5">
                Get started by creating or joining a workspace!
              </p>
            </div>
            <div className="flex items-center gap-x-4 mt-6">
              <button
                className={`${
                  toggle ? "bg-gray/30" : "text-base"
                }  w-full rounded-full text-xs p-3 border-[1px] border-gray-100`}
                onClick={() => setToggle(true)}
              >
                Create Workspace
              </button>
              <button
                className={`${
                  !toggle ? "bg-gray/30" : "text-base "
                }  w-full rounded-full text-xs p-3 border-[1px] border-gray-100`}
                onClick={() => setToggle(false)}
              >
                Join Workspace
              </button>
            </div>
            {toggle ? <CreateWorkspace /> : <JoinWorkspaceForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
