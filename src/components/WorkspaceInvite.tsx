import * as Yup from "yup";
import { Formik, Form } from "formik";
import { TextArea, TextInput } from "components/InputField";
import { Loader } from "components/Spinner";
import { useWorkspaceInviteMutation } from "redux/apiSlice";

interface Props {
  handleClose: () => void;
  workspaceId: string;
}
export default function WorkspaceInvite({ handleClose, workspaceId }: Props) {
  const [sendInvite, { isLoading }] = useWorkspaceInviteMutation();
  const inviteSchema = Yup.object().shape({
    email: Yup.string().email().required().lowercase().trim().label("Email"),
    inviteNote: Yup.string(),
  });

  const sendInviteHandler = async (values: any) => {
    try {
      await sendInvite({
        workspaceId: workspaceId,
        formData: values,
      }).unwrap();
    } catch (error) {
      console.log(error);
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
          <div className="mb-6">
            <TextArea
              label="Add Notes(optional)"
              name="inviteNote"
              placeholder="Add an invite note"
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-x-4">
            <button
              aria-label="Save"
              className="p-2 text-sm md:w-24 text-white h-10 flex justify-center items-center flex-col hover:bg-success rounded-md bg-success/80 font-bold"
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
