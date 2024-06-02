import { Formik, Form, FormikErrors } from "formik";
import { App as AntDesign } from "antd";
import * as Yup from "yup";
import { TextInput } from "components/InputField";
import SocialLinks from "components/Settings/SocialLinks";
import { useState } from "react";
import Members from "components/Settings/Members";
import { AppState } from "types";
import { useDispatch, useSelector } from "react-redux";
import { appData, updateWorkspace } from "redux/boardSlice";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useUpdateWorkspaceProfileMutation } from "redux/apiSlice";
import { Loader } from "components/Spinner/index";
import Modal from "components/Modal";
import DeleteItem from "components/DeleteItem";
import IconButton from "components/IconButton";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Theme from "components/Settings/Theme";
import { TitleCase } from "utilis";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { message } = AntDesign.useApp();
  const data: AppState = useSelector(appData);
  const [uploadError, setUploadError] = useState<any>();
  const { workspace } = data;
  const [toggle, setToggle] = useState(location.state || "about");
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [editWorkspaceProfile, { isLoading }] =
    useUpdateWorkspaceProfileMutation();
  const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const linkitems = [
    {
      name: "about",
    },
    {
      name: "members",
    },
    {
      name: "theme",
    },
  ];
  const aboutSchema = Yup.object().shape({
    name: Yup.string()
      .required("")
      .test("len", "At least 5 characters and not more than 15", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 15;
      }),
    profilePics: Yup.string(),
  });

  const UpdateWorkSpace = async (values: any) => {
    let res;
    if (values.profilePics) {
      const data = new FormData();
      data.append("file", values.profilePics);
      data.append("upload_preset", upload_preset);
      data.append("cloud_name", cloud_name);
      data.append("folder", "Cloudinary-React");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      res = await response.json();
    }
    try {
      const payload = {
        workspaceId: workspace.id,
        formData:
          values.name && !values.profilePics
            ? { name: values.name }
            : values.profilePics && !values.name
            ? { profilePics: res?.url }
            : { name: values.name, profilePics: res?.url },
      };

      const result = await editWorkspaceProfile(payload).unwrap();
      if (result) {
        dispatch(updateWorkspace({ name: values.name }));
      }
    } catch (error: any) {
      message.error({
        content: error.message,
        className: "text-error",
      });
    }
  };

  return (
    <div className="h-full px-6 md:px-20 overflow-auto">
      <div className="h-full novisible-scroll overflow-auto">
        <div className="relative pt-12 mini:pt-6">
          <IconButton handleClick={() => navigate(-1)}>
            {" "}
            <HiOutlineChevronLeft />
          </IconButton>

          <div className="flex gap-x-4 items-center">
            <img
              src={workspace.profilePics}
              alt="image"
              className="border-solid object-contain h-12 md:h-20 w-12 md:w-20"
            />
            <div>
              <h1 className="font-bold sm:text-lg md:text-xl">
                {workspace.name} Workspace
              </h1>
              <p className="text-gray/80 font-medium text-xs">
                Created on {""}
                {dayjs(workspace.createdAt).format(`MMMM Do, YYYY`)}
              </p>
            </div>
          </div>
        </div>
        <div className="h-auto mt-14 md:mt-16 md:flex items-start">
          <div className="my-6 md:my-0">
            <div className="flex md:flex-col w-40 md:w-36 items-start gap-y-3">
              {linkitems.map((ele: any) => {
                return (
                  <button
                    onClick={() => setToggle(ele.name)}
                    key={ele.name}
                    className={`${
                      toggle.toLowerCase() === ele.name && "bg-gray-200"
                    } border-none px-4 py-2 md:text-base rounded-md font-semibold w-full text-left`}
                  >
                    {TitleCase(ele.name)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:w-9/12 novisible-scroll h-full md:pr-4 ml-auto">
            {toggle === "about" ? (
              <div className="pb-24">
                <Formik
                  initialValues={{
                    name: workspace.name,
                    image: File,
                  }}
                  validationSchema={aboutSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={UpdateWorkSpace}
                  className="h-full"
                >
                  {({
                    setFieldValue,
                    errors,
                  }: FormikErrors<{ image?: File }> | any) => (
                    <Form className="rounded-md p-6 md:px-10 md:pt-8 md:pb-10 bg-secondary">
                      <div className="mb-10">
                        <label className="font-semibold text-sm md:text-base">
                          Workspace Name{" "}
                          <p className="font-normal text-gray text-xs">
                            ( Your organization or company name.)
                          </p>
                        </label>
                        <TextInput
                          label=""
                          name="name"
                          type="text"
                          placeholder="E.g Development, Marketing"
                        />
                      </div>

                      <div className="">
                        <label className="font-semibold text-sm md:text-base">
                          Company logo{" "}
                          <p className="font-normal text-gray text-xs">
                            ( Upload an image that will show up in your sidebar
                            and notifications. )
                          </p>
                        </label>
                        <div className="relative">
                          <label
                            className="text-white relative block w-fit cursor-pointer h-full"
                            htmlFor="file_input"
                          >
                            <div className="relative mt-3 w-24 border-gray-100 border-[1px] h-auto">
                              <div className="w-24 absolute top-0 bg-gray opacity-0 hover:opacity-90 text-center font-bold text-xs h-full p-3">
                                Click to upload image
                              </div>
                              <img
                                className="w-30 h-auto object-contain"
                                src={
                                  selectedImage
                                    ? selectedImage
                                    : workspace.profilePics
                                }
                              />
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
                                    setFieldValue(
                                      "profilePics",
                                      e.currentTarget.files[0]
                                    );
                                    setSelectedImage(
                                      URL.createObjectURL(
                                        e.currentTarget.files[0]
                                      )
                                    );
                                  }
                                }
                              }}
                            />
                          </label>
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
                        </div>
                      </div>

                      <div className="mt-6 ml-auto w-20">
                        <button
                          className="h-10 px-4 text-xs h-10 w-20 flex bg-gray-300 justify-center items-center flex-col hover:bg-gray/40 border border-gray/30 rounded-md  font-bold"
                          type="submit"
                        >
                          {isLoading ? <Loader /> : "Update"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <SocialLinks
                  links={workspace.socialLinks}
                  workspaceId={workspace.id}
                />
                <div className="rounded-md px-8 py-7  bg-secondary md:mb-12 mt-12">
                  <button
                    onClick={() => {
                      setIsOpenDelete(true);
                    }}
                    className="bg-error p-3 rounded-lg hover:bg-[#e60023] text-white font-bold text-sm"
                  >
                    Delete Workspace
                  </button>
                </div>
              </div>
            ) : toggle.toLowerCase() === "members" ? (
              <Members workspaceId={workspace.id} />
            ) : (
              <Theme />
            )}
          </div>
        </div>
      </div>
      <Modal
        open={isOpenDelete}
        handleClose={() => {
          setIsOpenDelete(false);
        }}
      >
        <DeleteItem handleClose={() => setIsOpenDelete(false)} />
      </Modal>
    </div>
  );
}
