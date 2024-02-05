import makeApiCall from ".";
import { ICreateWorkspace, IJoinWorkspace } from "types/workspace";

export async function createWorkspace(payload: ICreateWorkspace) {
  const response = await makeApiCall("/workspace", "post", payload);
  return response;
}

export async function joinWorkspace(payload: IJoinWorkspace) {
  const response = await makeApiCall(
    "/workspace/join-workspace",
    "post",
    payload
  );
  return response;
}
