export interface IBoard {
  _id: string;
  name: string;
  columns: IColumn[];
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
  columnId:string
}

export interface ISubTask {
  _id: string;
  title: string;
  isCompleted: boolean;
}
export interface IWorkspaceProfile {
  id: string;
  name: string;
}

type AppState = {
  board: IBoard[];
  active: IBoard | any;
  workspace: IWorkspaceProfile;
};
