import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { TextArea, TextInput } from "components/InputField";
import { Loader } from "components/Spinner/index";
import { useWorkspaceInviteMutation } from "redux/apiSlice";
import { App as AntDesign } from "antd";
import { RiErrorWarningLine } from "react-icons/ri";

interface Props {
  handleClose: () => void;
  workspaceId: string;
}
export default function WorkspaceInvite({ handleClose, workspaceId }: Props) {
  const { message } = AntDesign.useApp();
  const [sendInvite, { isLoading }] = useWorkspaceInviteMutation();
  const [error, setError] = useState("");

  const inviteSchema = Yup.object().shape({
    email: Yup.string().email().required().lowercase().trim().label("Email"),
    inviteNote: Yup.string(),
  });

  const sendInviteHandler = async (values: any, { resetForm }: any) => {
    try {
      const response = await sendInvite({
        workspaceId: workspaceId,
        formData: values,
      }).unwrap();
      if (response) {
        message.success({
          content: "Invite Sent!",
          className: "text-success",
        });
      }
      handleClose();
    } catch (error: any) {
      setError(error.message);
    }
    resetForm();
  };
  return (
    <div className="h-auto px-2 pb-4">
      <h1 className="font-medium text-lg pb-4">Invite Request</h1>
      <Formik
        initialValues={{
          email: "",
          inviteNote: "",
        }}
        validationSchema={inviteSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={sendInviteHandler}
      >
        <Form>
          <div className="mb-5">
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="xyz@xyz.com"
            />
          </div>
          <div className="mb-5 relative">
            <TextArea
              label="Add Note(optional)"
              name="inviteNote"
              placeholder="Send invite note"
            />
            {error && (
              <p className="text-error text-xs absolute -bottom-12 flex items-center gap-x-1">
                {" "}
                <RiErrorWarningLine />
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-x-4">
            <button
              aria-label="Save"
              className="py-2 px-3 text-sm md:w-[100px] text-white h-10 flex justify-center items-center flex-col hover:bg-success rounded-md bg-success/90 font-bold"
              type="submit"
            >
              {isLoading ? <Loader /> : "Send"}
            </button>
            <button
              aria-label="cancel"
              onClick={handleClose}
              className="p-2 text-sm md:w-24 font-bold border-[1px] border-gray/30 hover:bg-gray/10 h-10 duration-300  rounded-md"
              type="button"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
