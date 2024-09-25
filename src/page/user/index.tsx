import { appData } from "redux/boardSlice";
import { AppState } from "types";
import { useState } from "react";
import { DefaultImage } from "utilis";
import { useUpdateUserMutation } from "redux/apiSlice";
import { useSelector } from "react-redux";
import { App as AntDesign } from "antd";
import IconButton from "components/IconButton";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Loader } from "components/Spinner";
import { Form, Formik } from "formik";

export default function Index() {
  const { message } = AntDesign.useApp();
  const navigate = useNavigate();
  const data: AppState = useSelector(appData);
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const { user } = data;
  const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const [editUser, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async (values: {
    name: string;
    email: string;
    profilePics: string;
  }) => {
    let res;
    if (selectedImage !== null && typeof values.profilePics !== "string") {
      const formData = new FormData();
      formData.append("file", values.profilePics);
      formData.append("upload_preset", upload_preset);
      formData.append("cloud_name", cloud_name);
      formData.append("folder", "Kanban-images");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      res = await response.json();
    }

    try {
      const response = await editUser({
        userId: user.id,
        userData: {
          ...values,
          profilePics: res?.url ? res?.url : values.profilePics,
        },
      }).unwrap();
      message.success({
        content: response.message,
        className: "text-success",
      });
      setSelectedImage(res?.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen px-6 md:px-20">
      <div className="h-full overflow-auto novisible-scroll pb-24">
        <div className="relative pt-12 mini:pt-6">
          {" "}
          <IconButton handleClick={() => navigate(-1)}>
            {" "}
            <HiOutlineChevronLeft />
          </IconButton>
          <h1 className="sm:text-lg font-bold border-b-[1px] border-gray/10 pb-2">
            User Settings
          </h1>
        </div>

        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            profilePics: user.profilePics,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, touched, setFieldValue, handleBlur }) => (
            <Form>
              <div className="h-auto">
                <p className="py-2 text-gray/80 text-xs">
                  Click on fields to edit
                </p>
                <div className="md:flex items-center justify-between my-4">
                  <label className="text-gray/80 font-medium md:w-64 text-sm">
                    Name
                  </label>
                  <input
                    name="name"
                    onBlur={handleBlur}
                    value={values.name}
                    type="text"
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    className={`font-semibold rounded-md w-full border-none bg-gray-200 px-4 py-3 hover:bg-gray-300`}
                  />
                </div>
                <div className="md:flex items-center justify-between my-4">
                  <label className="text-gray/80 font-medium text-sm md:w-64">
                    Email
                  </label>
                  <input
                    name="email"
                    value={values.email}
                    type="email"
                    onBlur={handleBlur}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    className={`font-semibold rounded-md w-full border-none bg-gray-200 px-4 py-3 hover:bg-gray-300`}
                  />
                </div>
                <div className="flex items-start my-6">
                  <label className="text-gray/80 font-medium md:w-64 text-sm ">
                    Avatar
                  </label>
                  <div className="w-fit">
                    <div className="relative">
                      <label
                        className="text-white cursor-pointer relative h-full"
                        htmlFor="file_input"
                      >
                        <div className="w-28 absolute top-0 bg-gray z-20 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-90 font-bold text-xs h-full p-5 text-center">
                          Click to upload image
                        </div>
                        <div>
                          {values.profilePics || selectedImage ? (
                            <div className="relative w-28 h-28 rounded-full overflow-hidden border-[1px] border-solid border-gray/20 flex items-center justify-center flex-col">
                              <img
                                className="w-28 h-28"
                                src={
                                  selectedImage &&
                                  typeof selectedImage === "string"
                                    ? selectedImage
                                    : user.profilePics
                                }
                              />
                            </div>
                          ) : (
                            <span className="rounded-full h-24 w-24 border overflow-hidden flex items-center justify-center flex-col text-3xl font-bold">
                              {DefaultImage(user.name)}
                            </span>
                          )}
                        </div>

                        <input
                          type="file"
                          size={100000}
                          id="file_input"
                          className="absolute top-20 text-sm invisible w-10"
                          name="profilePics"
                          accept=".jpg, .jpeg, .png"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              if (e.currentTarget.files[0].size > 100000) {
                                message.error({
                                  content: "image should be less than 100kb.",
                                  className: "text-error",
                                });

                                return null;
                              } else {
                                setFieldValue(
                                  "profilePics",
                                  e.currentTarget.files[0]
                                );
                                setSelectedImage(
                                  URL.createObjectURL(e.currentTarget.files[0])
                                );
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    disabled={!(touched.email || touched.name || selectedImage)}
                    className={`${
                      touched.email || touched.name || selectedImage
                        ? "opacity-100"
                        : "opacity-30"
                    } h-10 px-4 text-xs ml-auto w-20 flex bg-gray-300 justify-center items-center flex-col hover:bg-gray/40 border border-gray/30 rounded-md font-bold`}
                    type="submit"
                  >
                    {isLoading ? <Loader /> : "Update"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-12 md:mt-24 bg-gray-200 rounded-md py-4">
          <h2 className="border-b-[1px] border-gray/10 py-3 text-base font-bold px-4 md:px-8">
            Delete user
          </h2>
          <div className="px-4 md:px-8 pt-2 pb-5">
            <p className="text-gray/80 text-sm mb-8">
              Once you delete your account, there is no going back.
            </p>
            <button className="text-white px-4 font-bold rounded-md text-sm bg-error py-2">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
