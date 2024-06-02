import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { SubtaskInput } from "components/InputField";
import { BiLink } from "react-icons/bi";
import { useUpdateSocialLinksMutation } from "redux/apiSlice";
import { Loader } from "components/Spinner";

interface Props {
  workspaceId: string;
  links: string[];
}

export default function Index({ workspaceId, links }: Props) {
  const [updateSocialLinks, { isLoading }] = useUpdateSocialLinksMutation();
  const LinkSchema = Yup.object().shape({
    socialLinks: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
        })
      )
      .min(1, "Add a link."),
  });

  const editSocials = async (values: any) => {
    const links = values.socialLinks.map((ele: any) => {
      return ele.name;
    });
    try {
      const payload = {
        workspaceId,
        links,
      };
      await updateSocialLinks(payload).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          socialLinks:
            links.length > 0
              ? links.map((ele) => {
                  return { name: ele };
                })
              : [{ name: "" }],
        }}
        validationSchema={LinkSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={editSocials}
        className=""
      >
        {({ values, errors }) => (
          <Form className="rounded-md p-6 md:p-10 bg-secondary h-full mt-20">
            <label className="font-semibold text-sm md:text-base">Social accounts</label>
            
            <FieldArray
              name="socialLinks"
              render={(arrayHelpers) => (
                <div className="mt-4">
                  {values.socialLinks &&
                    values.socialLinks.length > 0 &&
                    values.socialLinks.map((ele: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center w-auto gap-x-2"
                      >
                        <BiLink className="text-xl text-gray" />
                        <SubtaskInput
                          type="url"
                          index={index}
                          name={`socialLinks.${index}.name`}
                          arrayHelpers={arrayHelpers}
                          placeholder="social link"
                        />
                      </div>
                    ))}
                  <button
                    aria-label="Add"
                    className="bg-gray-200 hover:bg-gray/30 mt-3 font-bold text-xs py-2.5 px-3 w-max rounded-md"
                    type="button"
                    onClick={() => {
                      arrayHelpers.push({
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

            <div className="ml-auto mt-6 w-20">
              <button
                className="h-10 px-4 text-xs h-10 w-20 flex justify-center items-center flex-col bg-gray-300 hover:bg-gray/30 border border-gray/30 rounded-md font-bold"
                type="submit"
              >
                {isLoading ? <Loader /> : "Update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
