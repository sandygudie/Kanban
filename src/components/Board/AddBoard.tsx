import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput, TextInput } from "components/InputField";
import { AppState, IBoard, IColumn, IWorkspaceProfile } from "types";
import { appData, addBoard } from "redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkDuplicatedBoard, saveloadWorkspaceData } from "utilis";
import { useToast } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useCreateBoardMutation } from "redux/apiSlice";
import { Loader } from "components/Spinner";
interface Props {
  handleClose: () => void;
}
function AddBoard({ handleClose }: Props) {
  const [createBoard, { isLoading }] = useCreateBoardMutation();
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const board: IBoard[] = data.board;
  const workspace: IWorkspaceProfile = data.workspace;
  const toast = useToast();

  const BoardSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .test("len", "At least 5 characters and not more than 15", (val) => {
        if (val == undefined) {
          return false;
        }
        return val.length >= 5 && val.length <= 15;
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

  const addBoardHandler = async (values: IBoard | any) => {
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
          dispatch(addBoard({ _id: response.data.boardId, ... response.data.values }));
          saveloadWorkspaceData({
            workspaceId: workspace.id,
            activeBoard: response.data.boardId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: "Board name already exist.",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    handleClose();
  };

  return (
    <div>
      <h1 className="font-bold text-lg pb-2 px-4">New Board</h1>
      <div className="overflow-y-auto h-auto max-h-[30rem] px-4">
        <Formik
          initialValues={{ name: "", columns: [] }}
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
                <label className="text-sm font-bold">Columns</label>
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
                        className="bg-primary/40 text-primary dark:bg-white dark:text-primary px mt-3 font-bold text-sm -2 py-3 w-full rounded-full"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            _id: uuidv4(),
                            name: "",
                            tasks: [],
                          });
                        }}
                      >
                        + Add New Column
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

              <div className="my-8">
                <button
                  aria-label="Board"
                  className="px-2 text-white h-12 bg-primary/70 hover:bg-primary font-bold py-4 flex justify-center items-center flex-col w-full rounded-full"
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
