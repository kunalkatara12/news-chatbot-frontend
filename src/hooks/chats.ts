import { useMutation, useQuery } from "@tanstack/react-query";
import type { ChatsData } from "../types/chats.types";
import { chat, getSessionChats, resetSessionChats } from "../api/chats.api";

const useGetSessionChats = (id: string) => {
    return useQuery<ChatsData[]>({
        queryKey: ["getChats", id],
        queryFn: () => getSessionChats(id),
        retry: false,
        refetchOnMount: true,
    });
}
const useResetSessionChats = () => {
    return useMutation({
        mutationKey: ["resetChats"],
        mutationFn: ({ id, all }: { id: string, all?: boolean }) => resetSessionChats(id, all),
    });
}
const useChat = () => {
    return useMutation({
        mutationKey: ["chat"],
        mutationFn: ({ id, query }: { id: string, query: string }) => chat(id, query),
    });
}

export { useGetSessionChats, useResetSessionChats, useChat };