import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput, TextInput } from "components/InputField";
import { AppState, IBoard, IColumn } from "types";
import { appData, addBoard } from "redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkDuplicatedBoard, saveloadWorkspaceData } from "utilis";
import { App as AntDesign } from "antd";
import { v4 as uuidv4 } from "uuid";
import { IoIosAdd } from "react-icons/io";
import { useCreateBoardMutation } from "redux/apiSlice";
import { Loader } from "components/Spinner";
import { notificationfeed } from "utilis/notification";

interface Props {
  handleClose: () => void;
}

function AddBoard({ handleClose }: Props) {
  const { message } = AntDesign.useApp();
  const [createBoard, { isLoading }] = useCreateBoardMutation();
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const { workspace, board, user } = data;

  const BoardSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .test("len", "At least 5 characters and not more than 25", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 25;
      }),
    columns: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
          tasks: Yup.array(),
        })
      )
      .min(1, "Add a column."),
  });

  const addBoardHandler = async (values: IBoard | any, { resetForm }: any) => {
    const foundDuplicate = checkDuplicatedBoard(values.name, board);
    const column = values.columns.map((ele: IColumn) => ele.name);
    const name = values.name;
    if (foundDuplicate === false) {
      try {
        const payload = {
          workspaceId: workspace.id,
          formData: { name, column },
        };
        const response = await createBoard(payload).unwrap();
        if (response) {
          dispatch(
            addBoard({ _id: response.data.boardId, ...response.data.values })
          );
          await notificationfeed(
            user,
            workspace,
            `Board: ${values.name}`,
            `/workspace/${workspace.id}`
          );
          saveloadWorkspaceData({
            workspaceId: workspace.id,
            activeBoard: response.data.boardId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      message.error({
        content: "Board name already exist.",
        className: "text-error",
      });
    }
    handleClose();
    resetForm();
  };

  return (
    <div>
      <h1 className="font-semibold text-lg pb-4">New Board</h1>
      <div className="overflow-y-auto h-auto max-h-[30rem]">
        <Formik
          initialValues={{
            name: "",
            columns: [
              {
                _id: uuidv4(),
                name: "",
                tasks: [],
              },
            ],
          }}
          validationSchema={BoardSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={addBoardHandler}
        >
          {({ values, errors }) => (
            <Form>
              <div className="mb-6">
                <TextInput
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="E.g  Development, Marketing"
                />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium">Columns</label>
                <FieldArray
                  name="columns"
                  render={(arrayHelpers) => (
                    <div>
                      {values.columns &&
                        values.columns.length > 0 &&
                        values.columns.map((task: IColumn, index: number) => (
                          <SubtaskInput
                            key={task._id}
                            index={index}
                            name={`columns.${index}.name`}
                            arrayHelpers={arrayHelpers}
                            placeholder="E.g Todo, Progress, Done"
                          />
                        ))}
                      <button
                        aria-label="Add Column"
                        className="bg-gray-200 hover:bg-gray/30 mt-3 font-bold text-xs py-2.5 px-4 w-max rounded-md flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            _id: uuidv4(),
                            name: "",
                            tasks: [],
                          });
                        }}
                      >
                        <IoIosAdd className="font-bold" size={20} /> Add Column
                      </button>

                      {values.columns.length >= 0 ? (
                        typeof errors.columns === "string" ? (
                          <div className="text-error text-xs">
                            {errors.columns}
                          </div>
                        ) : null
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="mt-10">
                <button
                  aria-label="Board"
                  className="px-2 text-white h-12 bg-primary hover:hover:bg-primary-hover font-bold py-4 flex justify-center items-center flex-col w-full rounded-full"
                  type="submit"
                >
                  {isLoading ? <Loader /> : "Create Board"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddBoard;
