import axios from "axios";
import { IChat } from "types/chat";
const chatBaseURL = import.meta.env.VITE_CHAT_API;

export const getTaskChat = async(taskId: string):Promise<IChat> => {
  const response =await axios.get(`${chatBaseURL}/api/v1/chat/${taskId}`);
 return response.data
};
