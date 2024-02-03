import makeApiCall from ".";
import { ILogin, ISignup } from "types/auth";

export async function login(payload: ILogin) {
  const response = await makeApiCall("auth/login", "post", payload);
  return response;
}
export async function signUp(payload: ISignup) {
  const response = await makeApiCall("auth/signup", "post", payload);
  return response;
}

export async function verifyEmail(confirmationCode: string) {
  const response = await makeApiCall(`auth/email-verify/${confirmationCode}`);
  return response;
}
