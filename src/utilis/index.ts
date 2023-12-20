// import data from "data";
import { AppState, IBoard, ITask } from "types";
const data: IBoard[] = [];
export const loadState = () => {
  const initialState: AppState = {
    board: data,
    active: data.find((item: IBoard, index: number) => index === 0)!,
    profile: { id: "", name: "", email: "" },
  };
  
  try {
    const serializedState = localStorage.getItem("boarddata");
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState).boarddata;
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializesState = JSON.stringify(state);
    localStorage.setItem("boarddata", serializesState);
  } catch (err) {
    return err;
  }
};

export const checkDuplicatedBoard = (values: IBoard, board: IBoard[]) => {
  return board.some((el: IBoard) => el.name === values.name);
};

export const checkDuplicatedTask = (values: ITask, active: IBoard) => {
  let foundTask;

  active.columns.find((item) =>
    item.name === values.status
      ? item.tasks.find((t: ITask) =>
          t.title === values.title ? (foundTask = t) : null
        )
      : null
  );
  return foundTask !== undefined ? true : false;
};

export const randomColor = () => {
  const randomNumber = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomNumber}`;
};
