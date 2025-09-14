import type { ChatsData } from "../types/chats.types";
import { _delete, _get, _post } from "../lib/axiosInstance";

const getSessionChats = async (id: string) => {
  try {
    const response = await _get<{ data: ChatsData[] }>(`/chat/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching session chats:", error);
    throw error;
  }
};

const resetSessionChats = async (id: string, all: boolean = false) => {
  try {
    const response = await _delete<{ success: true, message: string }>(`/chat/${id}`,{
      params: { all }
    });
    return response.data.message;
  } catch (error) {
    console.error("Error resetting session chats:", error);
    throw error;
  }
};
const chat = async (id: string, query: string) => {
  try {
    const response = await _post<{ data: string }>(`/chat/${id}`, { query });
    return response.data.data;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};

export { getSessionChats, resetSessionChats, chat };
