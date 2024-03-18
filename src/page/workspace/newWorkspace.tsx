import { useState } from "react";
import Icon from "components/Icon";
import logoMobile from "../../assets/logo-mobile.svg";
import { App as AntDesign } from "antd";
import { Formik, Form, FormikErrors } from "formik";
import * as Yup from "yup";
import { TextInput } from "components/InputField";
import { Loader } from "components/Spinner";
import { useNavigate } from "react-router-dom";
import {
  saveloadWorkspaceData,
  loadWorkspaceData,
  checkDuplicatedBoard,
} from "utilis";
import {
  useCreateWorkspaceMutation,
  useGetAllWorkspacesQuery,
  useJoinWorkspaceMutation,
} from "redux/apiSlice";
import { IoAlertCircleOutline, IoPencilOutline } from "react-icons/io5";

const CreateWorkspaceForm = () => {
  const { message } = AntDesign.useApp();
  const { data: workspaces } = useGetAllWorkspacesQuery();
  const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const [selectedImage, setSelectedImage] = useState<any>();
  const [uploadError, setUploadError] = useState<any>();
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
  const navigate = useNavigate();

  const createWorkspaceSchema = Yup.object().shape({
    workspaceName: Yup.string()
      .required("Required")
      .test("len", "At least 5 - 25 characters", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 25;
      }),
    profilePics: Yup.string(),
  });

  const createNewWorksapce = async (values: any) => {
    console.log(values)
    const foundDuplicate = checkDuplicatedBoard(
      values.workspaceName,
      workspaces.data.workspace
    );

    if (foundDuplicate) {
      message.error({
        content: "Workspace name already exist.",
        className: "text-error",
      });

      return null;
    }
    const data = new FormData();
    data.append("file", values.profilePics);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);
    data.append("folder", "Kanban-images");

    try {
      const result = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const { url } = await result.json();
      const response = await createWorkspace({
        workspaceName: values.workspaceName,
        profilePics: url,
      }).unwrap();
      if (response) {
        saveloadWorkspaceData({
          workspaceId: response.data.workspaceId,
        });
        navigate(`/workspace/${response.data.workspaceId}`);
      }
    } catch (error: any) {
      setUploadError(error.message);
    }
  };
  return (
    <Formik
      initialValues={{ workspaceName: "", image: File }}
      validateOnChange={false}
      validationSchema={createWorkspaceSchema}
      validateOnBlur={false}
      onSubmit={(values) => createNewWorksapce(values)}
    >
      {({ setFieldValue, errors }: FormikErrors<{ image?: File }> | any) => (
        <Form>
          <div className="mt-6 mb-6">
            <TextInput
              label="Workspace Name"
              name="workspaceName"
              type="text"
              placeholder="E.g xyz"
            />
          </div>
          <div className="">
            <p className="mb-2 font-bold text-[15px]">
              Workspace logo{" "}
              <span className="text-gray/70 text-xs font-normal pl-1">
                (You can upload your company logo.){" "}
              </span>{" "}
            </p>
            <div className="relative flex items-end gap-x-4">
              <label
                className="text-white cursor-pointer h-full"
                htmlFor="file_input"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-[1px] overflow-hidden border-solid border-gray">
                  <img
                    className="h-28 w-28"
                    src={
                      selectedImage
                        ? selectedImage
                        : "https://res.cloudinary.com/dvpoiwd0t/image/upload/v1709633921/logo-placeholder_eaoawz.jpg"
                    }
                  />
                  <IoPencilOutline className="absolute -right-10 w-40 bottom-0 text-xl" />
                </div>
                <input
                  type="file"
                  id="file_input"
                  className="absolute top-20 text-sm invisible w-48"
                  name="profilePics"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => {
                    setUploadError("");
                    if (e.currentTarget.files) {
                      if (e.currentTarget.files[0].size > 100000) {
                        setUploadError("Image too large");
                      } else {
                        setFieldValue("profilePics", e.currentTarget.files[0]);
                        setSelectedImage(
                          URL.createObjectURL(e.currentTarget.files[0])
                        );
                      }
                    }
                  }}
                />
                {errors.image ||
                  (uploadError && (
                    <span
                      className="text-xs text-error absolute -bottom-5 flex items-center gap-x-2"
                      id="error"
                    >
                      <IoAlertCircleOutline size={16} />{" "}
                      {errors.image || uploadError}
                    </span>
                  ))}
              </label>

              <span className="text-gray/70 text-xs mb-6">
                <span className="block">* Supports: PNG,JPEG,JPG </span>
                <span className="block">* Max Size: 100KB </span>
              </span>
            </div>
          </div>

          <div className="my-10">
            <button
              className="px-2 flex-col flex items-center justify-center text-white bg-primary h-12 font-bold py-4 w-full rounded-full"
              type="submit"
            >
              {isLoading ? <Loader /> : "Continue"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

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
            {toggle ? <CreateWorkspaceForm /> : <JoinWorkspaceForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
