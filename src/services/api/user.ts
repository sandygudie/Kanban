import makeApiCall from ".";

export async function getUserWorkspaces() {
    const response = await makeApiCall("/user");
    // console.log(response)
    return response;
  }