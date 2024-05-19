import axios from "axios";
const baseURL = "http://localhost:4000/api/v1";

export const getTaskChat = async(taskId: string) => {
  const response =await axios.get(`${baseURL}/chat/${taskId}`);
 return response.data
};
