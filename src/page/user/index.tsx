import { appData, updateUserProfile } from "redux/boardSlice";
import { AppState } from "types";
import { ChangeEvent, useState } from "react";
import { IoPencilOutline } from "react-icons/io5";
import { DefaultImage } from "utilis";
import { useUpdateUserMutation } from "redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

export default function Index() {
  const toast = useToast();
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const [isEdit, setEdit] = useState("");
  const [editedText, setEditedText] = useState({ name: "", email: "" });
  const [selectedImage, setSelectedImage] = useState<any>();
  const { user } = data;
  const upload_preset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
  const [editUser] = useUpdateUserMutation();

  const editUserProfile = async (e: ChangeEvent<HTMLInputElement>) => {
    let res;
    if (e.target.name === "profilePics") {
      if(e.currentTarget.files && e.currentTarget.files[0].size >100000){
     
        toast({
          title: "image should be less than 100kb.",
          position: "top",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return null
      }
      setSelectedImage(e.currentTarget.files);
      const data = new FormData();
      data.append(
        "file",
        e.currentTarget.files ? e.currentTarget.files[0] : ""
      );
      data.append("upload_preset", upload_preset);
      data.append("cloud_name", cloud_name);
      data.append("folder", "Kanban-images");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      res = await response.json();
    } else {
      const { name, value } = e.target;
      setEditedText({ ...editedText, [name]: value });
    }

      try {
        const response = await editUser({
          userId: user.id,
          formData: {
            [e.target.name]: res?.url ? res?.url : e.target.value,
          },
        }).unwrap();

        if (response) {
          dispatch(
            updateUserProfile({
              [e.target.name]: res?.url ? res?.url : e.target.value,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }

  };

  return (
    <div className="h-full pt-12 px-20">
      <div className="h-full overflow-auto pb-24 settings_scroll">
        <h1 className="text-xl font-bold border-b-[1px] border-gray/10 pb-2">
          User Settings
        </h1>
        <div className="mt-14 h-auto">
          <div className="flex items-center justify-between my-4">
            <label className="text-gray/70 w-64">Name</label>
            <input
              name="name"
              value={editedText.name ? editedText.name : user.name}
              onMouseOver={() => {
                setEdit("name");
              }}
              onMouseOut={() => {
                setEdit("");
              }}
              onChange={(e) => editUserProfile(e)}
              className={`font-bold rounded-md w-full border-none focus:bg-gray/5 px-4 py-2 ${
                isEdit === "name" ? "bg-gray/5" : "border-gray/0"
              }`}
            />
          </div>
          <div className="flex items-center justify-between my-4">
            <label className="text-gray/70 w-64">Email</label>
            <input
              name="email"
              value={editedText.email ? editedText.email : user.email}
              onMouseOver={() => {
                setEdit("email");
              }}
              onMouseOut={() => {
                setEdit("");
              }}
              onChange={(e) => editUserProfile(e)}
              className={`font-bold rounded-md w-full border-none focus:bg-gray/5 px-4 py-2 ${
                isEdit === "email" ? "bg-gray/5 " : "border-gray/0"
              }`}
            />
          </div>
          <div className="flex items-start my-6">
            <label className="text-gray/70 w-64">Avatar</label>
            <div className="w-auto">
              <div className="relative">
                <label
                  className="text-white cursor-pointer h-full"
                  htmlFor="file_input"
                >
                  <div>
                    {user.profilePics || selectedImage ? (
                      <div className="relative w-32 h-auto rounded-full overflow-hidden border-[1px] border-solid border-gray/20 flex items-center justify-center flex-col">
                        <img
                        className="h-auto w-40"
                          src={
                            selectedImage
                              ? URL.createObjectURL(selectedImage[0])
                              : user.profilePics
                          }
                        />
                      </div>
                    ) : (
                      <span className="rounded-full h-24 w-24 border overflow-hidden flex items-center justify-center flex-col text-3xl font-bold">
                        {DefaultImage(user.name)}
                      </span>
                    )}
                    <IoPencilOutline className="absolute w-40 bottom-0 -left-2 text-xl" />
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
                        editUserProfile(e);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 bg-secondary rounded-md px-8 py-4">
          <h2 className="border-b-[1px] border-gray/10 pb-1 text-lg font-bold">
            Delete user
          </h2>
          <p className="text-gray/70 text-sm mt-3 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button className="text-white px-4 font-bold rounded-md text-sm bg-error py-2">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
