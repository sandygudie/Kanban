import axios from "axios";
const chatBaseURL = import.meta.env.VITE_API_BASEURL;


export const getTaskChat = async(taskId: string) => {
  const response =await axios.get(`${chatBaseURL}/api/v1/chat/${taskId}`);
 return response.data
};
