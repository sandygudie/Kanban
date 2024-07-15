import { Knock } from "@knocklabs/node";
import { IUser } from "types";
const knockCLient = new Knock(import.meta.env.VITE_KNOCK_API_KEY);

export const notification = async (
  user: IUser,
  action: string,
  url: string,
  workspacerecipients: []
) => {
  const recipients = workspacerecipients?.map(
    (ele: { userId: string; name: string; profilePics: string }) => {
      return { id: ele.userId, name: ele.name };
    }
  );
  try {
   
    await knockCLient.workflows.trigger("notification", {
      data: {
        name: user.name,
        action,
        url,
      },
      recipients: recipients,
    });
  } catch (err) {
    console.log(err);
  }
};
