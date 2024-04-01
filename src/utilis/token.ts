export const TOKEN_KEY = "APP_TOKEN";
export const LOGOUT_KEY = "APP_LOGOUT";
import axios from "axios";

export function getToken() {
  if (typeof window !== "undefined") {
  return localStorage.getItem(TOKEN_KEY);
  }
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  }
}
