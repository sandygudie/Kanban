export interface ICreateWorkspace {
  email: string;
  description: string;
}

export interface IJoinWorkspace {
  email: string;
  description: string;
}

export interface IWorkspace {
  id:string;
  name:string
  description: string;
}
