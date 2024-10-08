import { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput } from "components/InputField";
import { AppState, IColumn } from "types";
import { appData } from "redux/boardSlice";
import { useSelector } from "react-redux";
import { checkDuplicatedColumn } from "utilis";
import { v4 as uuidv4 } from "uuid";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Loader } from "components/Spinner/index";
import { useCreateColumnMutation } from "redux/apiSlice";
import { IoIosAdd } from "react-icons/io";
import { notificationfeed } from "utilis/notification";

interface Props {
  handleClose: () => void;
}

export default function AddColumn({ handleClose }: Props) {
  const [createColumn, { isLoading }] = useCreateColumnMutation();
  const [error, setError] = useState("");
  const data: AppState = useSelector(appData);

  const { workspace, active, user } = data;

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

  const addColumnHandler = async (values: any, { resetForm }: any) => {
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
        await createColumn(payload).unwrap();
        handleClose();
        await notificationfeed(
          user,
          workspace,
          `Column: ${columnArray.toString("")}`,
          `/workspace/${workspace.id}`
        );
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setError("")
        resetForm();
      }
    } else {
      setError("Duplicated column name");
    }
  };

  return (
    <div>
      <h1 className="font-medium text-lg pb-2">Column(s)</h1>
      <div className="overflow-y-auto h-auto max-h-[30rem]">
        <Formik
          initialValues={{ columns: [{ _id: uuidv4(), name: "", tasks: [] }] }}
          validationSchema={ColumnSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={addColumnHandler}
        >
          {({ values, errors }) => (
            <Form>
              <div className="mb-6">
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
                        className="bg-gray-200 hover:bg-gray/30 mt-3 font-bold text-xs py-2.5 px-4 w-max rounded-md flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            _id: uuidv4(),
                            name: "",
                            tasks: [],
                          }),
                          setError("")
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

              <div className="mt-10 relative">
                {error.length ? (
                  <p className="text-error absolute -top-8  text-xs flex items-center mt-2 gap-x-2">
                    <IoAlertCircleOutline />
                    {error}
                  </p>
                ) : (
                  ""
                )}
                <button
                  aria-label="Board"
                  className="text-white bg-primary hover:bg-primary-hover h-12 px-2 py-3 w-full flex justify-center items-center flex-col font-bold dark:hover:text-white rounded-full"
                  type="submit"
                >
                  {isLoading ? <Loader /> : "Create Column(s)"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
