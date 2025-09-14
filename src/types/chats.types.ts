export type ChatsData = {
    from: "user" | "bot";
    text: string;
    isNew: boolean; // Optional field to indicate if the message is new
}