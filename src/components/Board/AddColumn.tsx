import { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput } from "components/InputField";
import { AppState, IBoard, IColumn, IWorkspaceProfile } from "types";
import { addColumn, appData } from "redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkDuplicatedColumn } from "utilis";
import { v4 as uuidv4 } from "uuid";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Loader } from "components/Spinner";
import { useCreateColumnMutation } from "redux/apiSlice";
import { IoIosAdd } from "react-icons/io";

interface Props {
  handleClose: () => void;
}

export default function AddColumn({ handleClose }: Props) {
  const [createColumn, { isLoading }] = useCreateColumnMutation();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const workspace: IWorkspaceProfile = data.workspace;
  const active: IBoard = data.active;

  const ColumnSchema = Yup.object().shape({
    columns: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
          tasks: Yup.array(),
        })
      )
      .min(1, "Add a column."),
  });

  const addColumnHandler = async (values: any,{resetForm}:any) => {
    const foundDuplicate = checkDuplicatedColumn(
      values.columns,
      active.columns
    );

    if (foundDuplicate === false) {
      try {
        const columnArray = values.columns.map((ele: IColumn) => {
          return ele.name;
        });
        const payload = {
          boardId: active._id,
          workspaceId: workspace.id,
         formData: { column: columnArray },
        };
        const response = await createColumn(payload).unwrap();

        if (response) {
          dispatch(addColumn(response.data));
        }
        handleClose();
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      }finally{
        resetForm()
      }
    } else {
      setError("Duplicated column name");
    }
  };

  return (
    <div>
      <h1 className="font-bold text-lg pb-2 px-4">Column(s)</h1>
      <div className="overflow-y-auto h-auto max-h-[30rem] px-4">
        <Formik
          initialValues={{ columns: [{ _id: uuidv4(), name: "", tasks: [] }] }}
          validationSchema={ColumnSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={
            addColumnHandler}
         
        >
          {({ values, errors, }) => (
            <Form>
              <div className="mb-6">
                {/* <label className="text-sm font-bold">Columns</label> */}
                <FieldArray
                  name="columns"
                  render={(arrayHelpers) => (
                    <div>
                      {values.columns.length > 0 &&
                        values.columns.map((task: any, index: number) => (
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
                        className="bg-primary/40 text-primary dark:bg-white dark:text-primary px mt-3 font-bold text-sm -2 py-3 w-full flex items-center justify-center rounded-full"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            _id: uuidv4(),
                            name: "",
                            tasks: [],
                          });
                        }}
                      >
                        <IoIosAdd  className="font-bold" size={20} />{" "} Add Column
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

              <div className="my-8 relative ">
                <button
                  aria-label="Board"
                  className="text-white bg-primary/70 hover:bg-primary h-12 px-2 py-3 w-full flex justify-center items-center flex-col font-bold dark:hover:text-white rounded-full"
                  type="submit"
                >
                  {isLoading ? <Loader /> : "Add Column(s)"}
                </button>
                {error.length ? (
                  <p className="text-error absolute text-xs flex items-center mt-2 gap-x-2">
                    <IoAlertCircleOutline />
                    {error}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
