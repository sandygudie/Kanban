export interface ICreateWorkspace {
  workspaceName: string;
  image: File|any;
}

export interface IJoinWorkspace {
  workspaceName: string;
  inviteCode: string;
}

export interface IWorkspace {
  id:string;
  name:string
  description: string;
}
