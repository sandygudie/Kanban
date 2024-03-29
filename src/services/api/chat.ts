import axios from "axios";
const baseURL = "http://localhost:4000";
export const getTaskChat = () => {
  axios.get(baseURL).then((response: any) => {
    console.log(response);
  });
};
