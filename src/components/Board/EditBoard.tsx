import { IBoard, IUser, IWorkspaceProfile } from "types";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { TextInput } from "components/InputField";
import { Loader } from "components/Spinner";
import { useEditBoardMutation } from "redux/apiSlice";
import { notificationfeed } from "utilis/notification";


interface Props {
  handleValueChange: (newValue: string) => void;
  handleClose: () => void;
  activeBoard: IBoard;
  isEdit: string;
  newValue: string;
  user:IUser,
  workspace:IWorkspaceProfile
}

export default function EditBoard({
  handleClose,
  activeBoard,
  workspace,
  isEdit,
  newValue,
  handleValueChange,
  user
}: Props) {
  const [editABoard, { isLoading }] = useEditBoardMutation();


  const nameSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .test("len", "At least 5 characters and not more than 15", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 15;
      }),
  });

  const descriptionSchema = Yup.object().shape({
    description: Yup.string(),
  });

  const editBoardHandler = async (values: any) => {

    try {
    await editABoard({
        boardId: activeBoard._id,
        workspaceId: workspace.id,
        formData:
          isEdit === "description"
            ? { description: values.description }
            : { name: values.name },
      }).unwrap();
      handleClose();
      await notificationfeed(
        user,
        workspace,
        `Board: ${values.name}`,
        `/`,
        "updated"

      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-auto px-2 py-2">
      <Formik
        initialValues={
          isEdit === "description"
            ? {
                _id: activeBoard._id,
                description: activeBoard?.description,
              }
            : {
                _id: activeBoard._id,
                name: activeBoard.name,
              }
        }
        validationSchema={
          isEdit === "description" ? descriptionSchema : nameSchema
        }
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={editBoardHandler}
      >
        {({ setFieldValue }) => (
          <Form>
            {isEdit === "description" ? (
              <div className="mb-6">
                <h2 className="font-medium text-lg ">Board Description</h2>
                <TextInput
                  value={newValue}
                  onChange={(e: { target: { value: string } }) => {
                    setFieldValue("description", e.target.value),
                      handleValueChange(e.target.value);
                  }}
                  label=""
                  name="description"
                  placeholder="Tell us more about the board."
                />
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="font-medium text-lg">Board Name</h2>
                <TextInput
                  value={newValue}
                  onChange={(e: { target: { value: string } }) => {
                    setFieldValue("name", e.target.value),
                      handleValueChange(e.target.value);
                  }}
                  label=""
                  name="name"
                  type="text"
                  placeholder="E.g  Development, Marketing"
                />
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-x-4">
              <button
                aria-label="Save"
                className="p-2 text-sm w-24 text-white h-10 flex justify-center items-center flex-col hover:bg-success rounded-md bg-success/90 font-bold"
                type="submit"
              >
                {isLoading ? <Loader /> : "Save"}
              </button>
              <button
                aria-label="cancel"
                onClick={handleClose}
                className="p-2 text-sm w-24 font-bold border-[1px] border-gray/30 hover:bg-gray/10 h-10 duration-300  rounded-md"
                type="button"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
