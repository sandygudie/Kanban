import { Knock } from "@knocklabs/node";
import { IUser, IWorkspaceProfile } from "types";
const knockCLient = new Knock(import.meta.env.VITE_KNOCK_API_KEY);

export const notificationfeed = async (
  user: IUser,
  workspace: IWorkspaceProfile,
  item: string,
  url: string,
  action?: string
) => {
  const recipients = workspace.members?.map(
    (ele: { userId: string; name: string; profilePics: string }) => {
      return { id: ele.userId, name: ele.name };
    }
  );
  try {
    await knockCLient.workflows.trigger("notification", {
      data: {
        name: ` <span class="notification_feed_img"> ![Alt text](${user.profilePics} "a title") ${user.name}</span>`,
        action: `${
          action ? action : "created a new"
        } <strong style="text-decoration:underline;margin-left:3px"> ${item}</strong>`,
        url,
      },
      recipients: recipients,
      tenant: workspace.id,
    });
  } catch (err) {
    console.log(err);
  }
};
