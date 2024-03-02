import {  useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { TextArea, TextInput } from "components/InputField";
import { Loader } from "components/Spinner";
import { useWorkspaceInviteMutation } from "redux/apiSlice";

import { useToast } from "@chakra-ui/react";
import { RiErrorWarningLine } from "react-icons/ri";

interface Props {
  handleClose: () => void;
  workspaceId: string;
}
export default function WorkspaceInvite({ handleClose, workspaceId }: Props) {
  const toast = useToast();
   const [sendInvite, { isLoading }] = useWorkspaceInviteMutation();
   const [error, setError] = useState("");

  const inviteSchema = Yup.object().shape({
    email: Yup.string().email().required().lowercase().trim().label("Email"),
    inviteNote: Yup.string(),
  });

  const sendInviteHandler = async (values: any) => {
    try {
      const response = await sendInvite({
        workspaceId: workspaceId,
        formData: values,
      }).unwrap();
      if (response) {
        toast({
          title: "Invite Sent!",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      handleClose()
    } catch (error:any) {
      setError(error.message)
    }
  };
  return (
    <div className="h-auto px-2 py-2">
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
          <div className="mb-6">
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="xyz@xyz.com"
            />
          </div>
          <div className="mb-6 relative">
            <TextArea
              label="Add Note(optional)"
              name="inviteNote"
              placeholder="Send invite note"
            />
            {error && <p className="text-error text-xs absolute -bottom-12 flex items-center gap-x-2">  <RiErrorWarningLine />{error}</p>}
          </div>
         

            <div className="flex items-center justify-end gap-x-4">
              <button
                aria-label="Save"
                className="py-2 px-3 text-sm md:w-[100px] text-white h-10 flex justify-center items-center flex-col hover:bg-success rounded-md bg-success/80 font-bold"
                type="submit"
              >
                {isLoading ? <Loader /> : "Send Invite"}
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
