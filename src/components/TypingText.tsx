import { useState, useEffect } from "react";
import type { ChatsData } from "src/types/chats.types";

export default function TypingText({
  message,
  setMessages,
}: {
  message: ChatsData;
  setMessages: React.Dispatch<React.SetStateAction<ChatsData[]>>;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed(""); // reset when text changes
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + message.text.charAt(i));
      i++;
      if (i >= message.text.length) {
        clearInterval(interval);
        // ✅ after typing is done, flip isNew to false (but don’t push duplicate)
        setMessages((prev) =>
          prev.map((m) => (m === message ? { ...m, isNew: false } : m))
        );
      }
    }, 25); // typing speed

    return () => clearInterval(interval);
  }, [message, setMessages]);

  return <span>{displayed}</span>;
}
