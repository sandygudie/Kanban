import { Formik, Form, FormikErrors } from "formik";
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

      const result = await editWorkspaceProfile(payload);
      if (result) {
        dispatch(updateWorkspace({ name: values.name }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-full overflow-y-auto md:overflow-hidden relative pb-24 pt-16 px-6 md:px-20">
        <div className="flex gap-x-4 items-center relative">
          <div className="absolute -top-[30px] mini:-top-[35px]">
            {" "}
            <IconButton handleClick={() => navigate(-1)}>
              {" "}
              <HiOutlineChevronLeft />
            </IconButton>
          </div>
          <div>
            <img
              src={workspace.profilePics}
              alt="image"
              className=" border-solid object-contain h-12 md:h-20 w-12 md:w-20"
            />
          </div>
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
        <div className="h-full mt-14 md:mt-16">
          <div className="md:fixed my-6 md:my-0">
            <div className="flex md:flex-col w-40 md:w-36 items-start gap-y-3">
              {linkitems.map((ele: any) => {
                return (
                  <button
                    onClick={() => setToggle((ele.name))}
                    key={ele.name}
                    className={`${
                      toggle === ele.name && "bg-gray-200"
                    } border-none px-4 py-2 rounded-md text-sm font-medium w-full text-left`}
                  >
                    {TitleCase(ele.name)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:w-9/12 overflow-y-auto h-full pb-24 ml-auto">
            {toggle === "about" ? (
              <div>
                <div>
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
                          <TextInput
                            label="Workspace Name"
                            subLabel="(Your organization or company name.)"
                            name="name"
                            type="text"
                            placeholder="E.g Development, Marketing"
                          />
                         
                        </div>

                        <div className="">
                          <p className="mb-2 font-bold text-sm">Company logo</p>
                          <div className="relative">
                            <label
                              className="text-white relative block w-fit cursor-pointer h-full"
                              htmlFor="file_input"
                            >
                              <div className="relative w-24 h-auto">
                                <div className="w-24 absolute top-0 bg-gray/50 opacity-0 hover:opacity-90 text-center font-bold text-xs h-full p-4">
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
                                    if (
                                      e.currentTarget.files[0].size > 100000
                                    ) {
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
                            <span className="text-gray/70 text-xs">
                              Upload an image that will show up in your sidebar
                              and notifications.
                            </span>
                          </div>
                        </div>
                        <div className="mt-6">
                          <div className="ml-auto md:w-20">
                            <button
                              className="h-10 px-4 text-xs h-10 w-20 flex justify-center items-center flex-col hover:bg-gray/20 border border-gray/30 rounded-md bg-main font-bold"
                              type="submit"
                            >
                              {isLoading ? <Loader/> : "Update"}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
                <SocialLinks />
                <div className="rounded-md px-8 py-7 bg-secondary md:mb-12 mt-20">
                  <button
                    onClick={() => {
                      setIsOpenDelete(true);
                    }}
                    className="text-error font-bold text-sm"
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
    </>
  );
}
