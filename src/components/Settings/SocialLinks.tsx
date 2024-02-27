import { v4 as uuidv4 } from "uuid";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput } from "components/InputField";
import { BiLink } from "react-icons/bi";

export default function Index() {
  const LinkSchema = Yup.object().shape({
    socialLinks: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
        })
      )
      .min(1, "Add a column."),
  });

  const editSocials = async (values: any) => {
    console.log(values);
  };
  return (
    <div>
      <Formik
        initialValues={{
          socialLinks: [{ name: "" }],
        }}
        validationSchema={LinkSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={editSocials}
        className=""
      >
        {({ values, errors }) => (
          <Form className="rounded-md p-10 bg-secondary h-full mt-20">
            <label className="text-sm font-bold ">Social accounts</label>
            <FieldArray
              name="socialLinks"
              render={(arrayHelpers) => (
                <div className="mt-4">
                  {values.socialLinks &&
                    values.socialLinks.length > 0 &&
                    values.socialLinks.map((ele: any, index: number) => (
                     <div key={index} className="flex items-center w-96 gap-x-2">
                        <BiLink className="text-xl text-gray"/>

                         <SubtaskInput
                        index={index}
                        name={`socialLinks.${index}.name`}
                        arrayHelpers={arrayHelpers}
                        placeholder="social link"
                      />
                     </div>
                    ))}
                  <button
                    aria-label="Add"
                    className="bg-primary/40 text-primary dark:bg-white dark:text-secondary mt-3 font-bold text-sm py-2 px-3 w-max rounded-md"
                    type="button"
                    onClick={() => {
                      arrayHelpers.push({
                        _id: uuidv4(),
                        name: "",
                      });
                    }}
                  >
                   Add Link
                  </button>

                  {values.socialLinks.length >= 0 ? (
                    typeof errors.socialLinks === "string" ? (
                      <div className="text-error text-xs">
                        {errors.socialLinks}
                      </div>
                    ) : null
                  ) : (
                    ""
                  )}
                </div>
              )}
            />

            <div className="ml-auto mt-6 md:w-20">
              <button
                className="py-2 px-4 text-xs text-white h-10 flex justify-center items-center flex-col hover:bg-secondary border border-gray/30 rounded-md bg-secondary/80 font-bold"
                type="submit"
              >
             Update
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
