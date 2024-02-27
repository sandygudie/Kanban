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
  assignTo: string;
  deadline: string | Date;
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
  profilepics:string
  createdBy:string
}

type AppState = {
  board: IBoard[];
  active: IBoard | any;
  workspace: IWorkspaceProfile;
};
