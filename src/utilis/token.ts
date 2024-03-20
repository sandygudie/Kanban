export const TOKEN_KEY = "APP_TOKEN";
export const LOGOUT_KEY = "APP_LOGOUT";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}
