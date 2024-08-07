import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { TextInput, TextArea, SubtaskInput } from "../InputField";
import { AppState, IColumn, ISubTask, ITask } from "types";
import { appData } from "redux/boardSlice";
import { useSelector } from "react-redux";
import { checkDuplicatedTask } from "utilis";
import { App as AntDesign } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useCreateTaskMutation, useEditTaskMutation } from "redux/apiSlice";
import { Loader } from "components/Spinner";
import { IoIosAdd } from "react-icons/io";
import { notificationfeed } from "utilis/notification";

interface Props {
  handleClose: () => void;
  tasks?: ITask;
  isOpenEdit?: boolean;
  index?: number;
  activeColumn?: IColumn;
  selectedColumn?: string;
  handleSelectedColumn?: (selectedColumn: string) => void;
}
export default function AddTask({
  handleClose,
  activeColumn,
  tasks,
  selectedColumn,
}: Props) {
  const { message } = AntDesign.useApp();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [editATask, { isLoading: isLoadingEdit }] = useEditTaskMutation();
  const data: AppState = useSelector(appData);
  const { active, workspace, user } = data;

  const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    description: Yup.string(),
    status: Yup.string(),
    subtasks: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required("Required"),
          isCompleted: Yup.boolean(),
        })
      )
      .min(1, "Add a substask."),
  });

  const addTaskHandler = async (values: ITask | any, { resetForm }: any) => {
    const foundDuplicate = checkDuplicatedTask(values, active);
    if (foundDuplicate === false) {
      try {
        const updatedSubstasks = values.subtasks.map((ele: ISubTask) => {
          return {
            title: ele.title,
            isCompleted: ele.isCompleted,
          };
        });
        const payload = {
          formdata: {
            title: values.title,
            description: values.description,
            subtasks: updatedSubstasks,
          },
          workspaceId: workspace.id,
          columnId: activeColumn?._id,
        };
        const response = await createTask(payload).unwrap();
        handleClose();
        await notificationfeed(
          user,
          workspace,
          `Task: ${values.title}`,
          `/workspace/${workspace.id}/${active._id}/${response.data.taskId}`
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      message.error({
        content: "Task name already exist.",
        className: "text-error",
      });
    }
    resetForm();
  };

  const editTaskHandler = async (values: ITask | any, { resetForm }: any) => {
    const foundDuplicate = checkDuplicatedTask(values, active);
    if (foundDuplicate === true && values._id !== tasks?._id) {
      message.error({
        content: "Task name already exist.",
        className: "text-error",
      });
    } else {
      try {
        const updatedSubstasks = values.subtasks.map((ele: ISubTask) => {
          return {
            title: ele.title,
            isCompleted: ele.isCompleted,
          };
        });

        const payload = {
          formdata: {
            title: values.title,
            description: values.description,
            subtasks: updatedSubstasks,
            status: selectedColumn,
          },
          workspaceId: workspace.id,
          columnId: tasks?.columnId,
          taskId: tasks?._id,
        };
        await editATask(payload).unwrap();
        await notificationfeed(
          user,
          workspace,
          `Task: ${tasks?.title}`,
          `/workspace/${workspace.id}/${active._id}/${tasks?._id}`,
          "updated"
        );
      } catch (error: any) {
        console.log(error);
      }
    }
    handleClose();
    resetForm();
  };

  return (
    <div>
      <h1 className="font-bold text-lg pb-6 px-4">
        {tasks ? (
          "Edit"
        ) : activeColumn ? (
          <span>
            Add{" "}
            <span className="text-primary text-lg">{activeColumn.name}</span>
          </span>
        ) : (
          "Add New"
        )}{" "}
        Task
      </h1>
      <div className="overflow-y-auto h-[30rem] pl-0 pr-4 md:px-4">
        <Formik
          initialValues={
            tasks
              ? {
                  _id: tasks._id,
                  title: tasks.title,
                  description: tasks.description,
                  status: selectedColumn ? selectedColumn : tasks.status,
                  subtasks: tasks.subtasks,
                  columnid: tasks.columnId,
                }
              : {
                  title: "",
                  description: "",
                  status: activeColumn?.name,
                  subtasks: [{ _id: uuidv4(), title: "", isCompleted: false }],
                }
          }
          validationSchema={TaskSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={tasks ? editTaskHandler : addTaskHandler}
        >
          {({ values, errors }) => (
            <Form className="pb-4">
              <div className="">
                <TextInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="E.g Pending design task"
                />
              </div>
              <div className="my-4">
                <TextArea
                  placeholder="E.g The hero page design is not completed"
                  name="description"
                  label="Description"
                />
              </div>

              <div className="">
                <label className="text-sm font-medium">Subtasks</label>
                <FieldArray
                  name="subtasks"
                  render={(arrayHelpers) => (
                    <div>
                      {values.subtasks.length > 0 &&
                        values.subtasks.map((task: ISubTask, index: number) => (
                          <SubtaskInput
                            key={task._id}
                            index={index}
                            name={`subtasks.${index}.title`}
                            arrayHelpers={arrayHelpers}
                            placeholder="E.g  Add company logo"
                          />
                        ))}
                      <button
                        aria-label="Add Subtasks"
                        className="bg-gray-200 hover:bg-gray/30 mt-3 font-bold text-xs py-2.5 px-4 w-max rounded-md flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            _id: uuidv4(),
                            title: "",
                            isCompleted: false,
                          });
                        }}
                      >
                        <IoIosAdd className="font-bold" size={20} /> Add
                        Subtasks
                      </button>

                      {values.subtasks.length >= 0 ? (
                        typeof errors.subtasks === "string" ? (
                          <div className="text-error text-xs">
                            {errors.subtasks}
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
                  aria-label="Create Task"
                  className="text-white bg-primary hover:hover:bg-primary-hover h-12 px-2 py-3 w-full flex justify-center items-center flex-col font-bold dark:hover:text-white rounded-full"
                  type="submit"
                >
                  {isLoading || isLoadingEdit ? (
                    <Loader />
                  ) : tasks ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
