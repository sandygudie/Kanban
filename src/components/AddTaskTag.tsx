import { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  useAddTaskTagsMutation,
  useDeleteTaskTagsMutation,
} from "redux/apiSlice";
import { TextInput } from "./InputField";
import { IoIosAdd } from "react-icons/io";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Loader } from "./Spinner";
import { checkDuplicatedTag } from "utilis";
import { MdClose } from "react-icons/md";
interface Props {
  handleClose: () => void;
  taskId: string;
  taskTags: { name: string; color: string }[];
}

export default function AddTaskTag({ taskTags, taskId, handleClose }: Props) {
  const [addtag, { isLoading }] = useAddTaskTagsMutation();
  const [deleteATag] = useDeleteTaskTagsMutation();
  const [error, setError] = useState("");

  const TagSchema = Yup.object().shape({
    tags: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
          color: Yup.string().required("Required"),
        })
      )
      .min(1, "Add a tag."),
  });

  const addNewTag = async (values: any, { resetForm }: any) => {
    const foundDuplicate = checkDuplicatedTag(values.tags, taskTags);
    if (foundDuplicate === false) {
      try {
        const payload = {
          taskId: taskId,
          tag: values.tags,
        };
        await addtag(payload).unwrap();
        handleClose();
      } catch (error: any) {

        setError(error.message);
      } finally {
        resetForm();

      }
    } else {
      setError("Duplicated tag name");
    }
  };
  const deleteTaghandler = async (selectedtag: {
    name: string;
    color: string;
  }) => {
    try {
      const payload = {
        taskId: taskId,
        tag: selectedtag,
      };

      await deleteATag(payload).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="font-medium text-lg pb-2">Tag(s)</h1>
      <div className="overflow-y-auto h-auto max-h-[30rem]">
        {taskTags.length > 0 && (
          <div className="my-6 flex flex-wrap items-center gap-4">
            {taskTags.map((list: { name: string; color: string }) => {
              return (
                <button
                  style={{ backgroundColor: list.color }}
                  key={list.name}
                  className="py-1 px-3 font-semibold text-sm rounded-full flex items-center gap-x-2"
                >
                 {list.name}
                  <span
                    className="text-error hover:text-error"
                    onClick={() => {
                      deleteTaghandler(list);
                    }}
                  >
                    <MdClose size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <Formik
          initialValues={{ tags: [] }}
          validationSchema={TagSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={addNewTag}
        >
          {({ values, errors }) => (
            <Form>
              <div className="mb-6">
                <FieldArray
                  name="tags"
                  render={(arrayHelpers) => (
                    <div>
                      {values.tags.length > 0 &&
                        values.tags.map(
                          (
                            tag: { name: string; color: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex justify-between items-center gap-x-4"
                            >
                              {index < 1 ? (
                                <>
                                  <TextInput
                                    label="Name"
                                    name={`tags.${index}.name`}
                                    type="text"
                                    placeholder="E.g documentation"
                                    className="py-2"
                                  />
                                  <TextInput
                                    label="Color"
                                    name={`tags.${index}.color`}
                                    type="text"
                                    placeholder="E.g #0000"
                                    className="py-2"
                                  />
                                </>
                              ) : (
                                <>
                                  <TextInput
                                    label=""
                                    name={`tags.${index}.name`}
                                    type="text"
                                    placeholder="E.g documentation"
                                    className="py-2"
                                  />
                                  <TextInput
                                    label=""
                                    name={`tags.${index}.color`}
                                    type="text"
                                    placeholder="E.g #0000"
                                    className="py-2"
                                  />
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <MdClose
                                  className={`${
                                    index < 1 ? "mt-8" : "mt-2"
                                  } text-lg text-error/70 hover:text-error font-bold`}
                                />
                              </button>
                            </div>
                          )
                        )}
                      <button
                        aria-label="Add tag"
                        className="bg-gray-200 hover:bg-gray/30 mt-3 font-bold text-xs py-2.5 px-4 w-max rounded-md flex items-center justify-center"
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            name: "",
                            color: "",
                          });
                        }}
                      >
                        <IoIosAdd className="font-bold" size={20} /> Add tag
                      </button>

                      {values.tags.length >= 0 ? (
                        typeof errors.tags === "string" ? (
                          <div className="text-error text-xs flex items-center gap-x-2">
                            <IoAlertCircleOutline /> {errors.tags}
                          </div>
                        ) : null
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                />
              </div>
              {values.tags.length > 0 && (
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
                    aria-label="label"
                    className="text-white bg-primary hover:bg-primary-hover h-12 px-2 py-3 w-full flex justify-center items-center flex-col font-bold dark:hover:text-white rounded-full"
                    type="submit"
                  >
                    {isLoading ? <Loader /> : "Add Tag(s)"}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
