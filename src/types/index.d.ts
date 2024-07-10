export interface IBoard {
  _id: string;
  name: string;
  description: string;
  columns: IColumn[];
  createdAt: Date;
}

export interface IColumn {
  name: string;
  _id: string;
  tasks: ITask[];
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: string;
  subtasks: ISubTask[];
  columnId: string;
  createdAt: Date;
  assignLabels: [];
  assignTo: [];
  dueDate: string[];
  createdBy:string 
}

export interface ISubTask {
  _id: string;
  title: string;
  isCompleted: boolean;
}

export interface IWorkspaceProfile {
  id: string;
  name: string;
  createdAt: Date | any;
  profilePics:string
  createdBy:string
  description:string
  socialLinks:string[]
}

export interface IUser {
  id: string;
  name: string;
  email:string
  profilePics:string
}

type AppState = {
  board: IBoard[];
  active: IBoard | any;
  workspace: IWorkspaceProfile;
  user:IUser
};
