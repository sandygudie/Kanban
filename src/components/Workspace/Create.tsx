import { App as AntDesign } from "antd";
import { Formik, Form, FormikErrors } from "formik";
import { IoAlertCircleOutline, IoPencilOutline } from "react-icons/io5";
import {
  useCreateWorkspaceMutation,
  useGetAllWorkspacesQuery,
} from "redux/apiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { checkDuplicatedBoard, saveloadWorkspaceData } from "utilis";
import { TextInput } from "components/InputField";
import { Loader } from "components/Spinner";

export default function CreateWorkspace() {
  const { message } = AntDesign.useApp();
  const navigate = useNavigate();
  const { data: workspaces } = useGetAllWorkspacesQuery();
  const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const [selectedImage, setSelectedImage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<any>();
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
  

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
    setLoading(true)
    let res;
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
    if (values) {
     const form= new FormData();
      form.append("file", values.profilePics);
      form.append("upload_preset", upload_preset);
      form.append("cloud_name", cloud_name);
      form.append("folder", "Kanban-images");

      const result = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      res = await result.json();
    }
    try {
      const response = await createWorkspace({
        workspaceName: values.workspaceName,
        profilePics: res.url,
      }).unwrap();
      if (response) {
        saveloadWorkspaceData({
          workspaceId: response.data.workspaceId,
        });
        navigate(`/workspace/${response.data.workspaceId}`);
      }
      setLoading(false)
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
            <p className="mb-2 font-semibold text-[15px]">
              Workspace logo{" "}
              <span className="text-gray/80 text-xs font-normal pl-1">
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
              className="px-2 flex-col flex items-center justify-center md:text-lg text-white bg-primary hover:bg-primary-hover h-12 font-bold py-4 w-full rounded-full"
              type="submit"
            >
              {isLoading ||loading? <Loader /> : "Continue"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
