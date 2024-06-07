import { IBoard } from "types";

export interface ICreateWorkspace {
  workspaceName: string;
  image: File | any;
}

export interface IJoinWorkspace {
  workspaceName: string;
  inviteCode: string;
}

export interface IWorkspace {
  userDetails: {
    userid: string;
    username: string;
    profilePics: string;
    email: string;
  };
  workspace: {
    _id: string;
    name: string;
    description: string;
    boards: IBoard[];
    createdAt: Date;
    createdBy: string;
    inviteCode: string | null;
    members: [];
    pendingMembers: [];
    profilePics: string;
    socialLinks: [];
    updatedAt: Date;
    workspaceAdmin: string;
  };
}
