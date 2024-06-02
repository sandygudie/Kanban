import Bowser from "bowser";
import { AppState, IBoard, IColumn, ITask } from "types";
const data: IBoard[] = [];

export const loadState = () => {
  const initialState: AppState = {
    board: data,
    active: data.find((item: IBoard, index: number) => index === 0)!,
    workspace: {
      id: "",
      name: "",
      createdAt: null,
      profilePics: "",
      createdBy: "",
      description: "",
      socialLinks:[]
    },
    user: {
      id: "",
      name: "",
      profilePics: "",
      email: "",
    },
  };
  return initialState;
};

export const loadWorkspaceData = () => {
  try {
    const serializedState = localStorage.getItem("currentWorkspace");
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveloadWorkspaceData = (state: any) => {
  try {
    const serializesState = JSON.stringify(state);
    localStorage.setItem("currentWorkspace", serializesState);
  } catch (err) {
    return err;
  }
};

export const checkDuplicatedBoard = (name: string, arr: any[]) => {
  return arr.some((ele: any) => ele.name === name);
};

export const checkDuplicatedColumn = (
  values: any,
  activeColumns: IColumn[]
) => {
  const mergedArray = activeColumns.concat(values);
  const columns = mergedArray.map((ele) => {
    return ele.name.toUpperCase();
  });

  return columns.some(
    (ele: string, index: number) => columns.indexOf(ele) !== index
  );
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

export function TitleCase(str: string) {
  str.toLowerCase().split(" ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function DefaultImage(str: string) {
  str.toLowerCase().split(" ");
  return str.charAt(0).toUpperCase() + str.charAt(1).toUpperCase();
}

export const colorMarker = [
  "#FFEB3B",
  "#44c3c3",
  "#03A9F4",
  "#8bc34a",
  "#ed8936",
  "#9c27b0",
  "#8bc34a",
  "#3b61ff",
  "#03A9F4",
  "#9c23F0",
  "#ff387b",
  "#ed8936",
  "#44c3c3",
  "#9c27b0",
  "#ff380b",
  "#03A9F4",
  "#8Yc34a",
];

export const taskColorMarker = [
  "#44c3c3",
  "#9c27b0",
  "#ff380b",
  "#48bb78",
  "#9c27b0",
  "#e2afde",
  "#9c27b0",
  "90e0ef",
  "#8bc3fa",
  "#03A9F4",
  "#e2e1b9",
  "#99ddc8",
  "#8Yc34a",
  "#ffeb3b",
  "#F991CC",
  "#44c3c3",
  "#e3A9F4",
  "#8bc2Da",
  "#95bf74",
  "#e68996",
  "#ed8936",

  "#3b61ff",
  "#ed8936",
];

export const handleDeviceDetection = () => {
  const userAgent = Bowser.parse(window.navigator.userAgent);
  return userAgent.platform.type;
};

export const changeTheme = (theme: string) => {
  localStorage.setItem("theme", theme.toLowerCase());
  document
    .querySelector("html")
    ?.setAttribute("data-theme", theme.toLowerCase());
};

export const getCurrentTheme = () => {
  return localStorage.getItem("theme");
};
