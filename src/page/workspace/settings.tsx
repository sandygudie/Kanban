import { Formik, Form, FormikErrors } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { TextInput } from "components/InputField";
import SocialLinks from "components/Settings/SocialLinks";
import { useState } from "react";
import Members from "components/Settings/Members";
import { AppState } from "types";
import { useSelector } from "react-redux";
import { appData } from "redux/boardSlice";


import { IoPencilOutline } from "react-icons/io5";

export default function Index() {

  const data: AppState = useSelector(appData);
  const { workspace } = data;
  const [toggle, setToggle] = useState("About");
  const [selectedImage, setSelectedImage] = useState<any>();

  const linkitems = [
    {
      name: "About",
      handler: () => {
        setToggle("About");
      },
    },
    {
      name: "Members",
      handler: () => {
        setToggle("Members");
      },
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

  const editProfile = async (values: any) => {
    console.log(values);
  };

  return (
    <div className="h-full">
      <div className="flex gap-x-4 items-center">
        <div>
          <img
            src={
              workspace.profilepics
                ? workspace.profilepics
                : "/workspace-placeholder.webp"
            }
            alt="image"
            className="rounded-full border-solid p-3 h-20 w-20"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl">{workspace.name} Workspace</h1>
          <p className="text-gray/50 text-xs">
            Created on {moment(workspace.createdAt).format("MMMM Do YYYY")}{" "}
          </p>
        </div>
      </div>
      <div className="h-full mt-16">
        <div className="fixed">
          <div className="flex flex-col w-40 items-start gap-y-3">
            {linkitems.map((ele: any) => {
              return (
                <button
                  onClick={() => setToggle(ele.name)}
                  key={ele.name}
                  className={`${
                    toggle === ele.name && "bg-secondary"
                  } border-none px-4 py-2 rounded-md text-sm font-bold w-full`}
                >
                  {ele.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-9/12 settings_scroll overflow-y-auto h-full pb-24 ml-auto pr-6">
          {toggle === "About" ? (
            <div>
              <div>
                <Formik
                  initialValues={{
                    name: "",
                    image: File,
                  }}
                  validationSchema={aboutSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={editProfile}
                  className="h-full"
                >
                  {({
                    setFieldValue,
                    errors,
                  }: FormikErrors<{ image?: File }> | any) => (
                    <Form className="rounded-md p-10 bg-secondary">
                      <div className="mb-6">
                        <TextInput
                          label="Workspace Name"
                          name="name"
                          type="text"
                          placeholder="E.g Development, Marketing"
                        />
                        <span className="text-gray/70 text-xs">
                          Your organization or company name.
                        </span>
                      </div>

                      <div className="">
                        <p className="mb-2 font-bold text-sm">Company logo</p>
                        <div className="relative">
                          <label
                            className="text-white cursor-pointer h-full"
                            htmlFor="file_input"
                          >
                            <div className="relative w-36 h-36 rounded-md border-[1px] border-solid border-gray">
                              <img
                                src={
                                  selectedImage
                                    ? selectedImage
                                    : "/workspace-placeholder.webp"
                                }
                                className="p-2 "
                              />
                              <IoPencilOutline className="absolute -right-20 w-40 bottom-0 text-xl" />
                            </div>

                            <input
                              type="file"
                              id="file_input"
                              className="absolute top-20 text-sm invisible w-48"
                              name="image"
                              accept="image/png, .svg"
                              onChange={(e) => {
                                if (e.currentTarget.files) {
                                  setFieldValue(
                                    "image",
                                    e.currentTarget.files[0]
                                  );
                                  setSelectedImage(
                                    URL.createObjectURL(
                                      e.currentTarget.files[0]
                                    )
                                  );
                                }
                              }}
                            />
                          </label>
                          {errors.image && (
                            <>
                              <br />
                              <span id="error">{errors.image}</span>
                              <br />
                            </>
                          )}
                          <span className="text-gray/70 text-xs">
                            Upload an image or pick an emoji. It will show up in
                            your sidebar and notifications.
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="ml-auto md:w-20">
                          <button
                            className="py-2 px-4 text-xs text-white h-10 flex justify-center items-center flex-col hover:bg-secondary border border-gray/30 rounded-md bg-secondary/80 font-bold"
                            type="submit"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              <SocialLinks />
              <div className="rounded-md px-8 py-7 bg-secondary mb-12 mt-20">
                <button className="text-error font-bold text-sm">
                  Delete Workspace
                </button>
              </div>
            </div>
          ) : (
            <Members workspaceId={workspace.id} />
          )}
        </div>
      </div>
    </div>
  );
}
