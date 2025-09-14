import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import ChatHistory from "../components/ChatHistory";
import "../styles/ChatPage.scss";
import { FiMenu, FiMessageSquare } from "react-icons/fi";
import type { ChatsData } from "../types/chats.types";
import { useChat, useGetSessionChats } from "../hooks/chats";
import TypingText from "../components/TypingText";

export default function ChatPage() {
  const { id } = useParams();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [messages, setMessages] = useState<ChatsData[]>([]);
  const [query, setQuery] = useState("");
  const { data, isPending } = useGetSessionChats(id!);
  const { mutate: ask, isPending: isAsking } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const handleSend = async () => {
    if (!id || !query.trim()) return;
    try {
      setMessages((prev) => [...prev, { from: "user", text: query, isNew: false }]);

      ask(
        { id, query },
        {
          onSuccess: (res) => {
            setMessages((prev) => [...prev, { from: "bot", text: res , isNew: true}]);
          },
          onError: (err) => console.error(err),
        }
      );

      setQuery("");
    } catch {
      console.log("error");
    }
  };

  return (
    <div className="chat-container">
      {isHistoryVisible && (
        <div
          className="mobile-overlay"
          onClick={() => setIsHistoryVisible(false)}
        />
      )}

      <ChatHistory
        isHistoryVisible={isHistoryVisible}
        setIsHistoryVisible={setIsHistoryVisible}
      />

      <div className={`chat-main ${id ? "" : "empty"}`}>
        {/* 🔹 Improved header */}
        <div className="chat-header">
          <button
            className="menu-toggle"
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          >
            <FiMenu />
          </button>
          <h2>Chat Session: {id || "No Session"}</h2>
          <div className="header-actions">{/* future icons here */}</div>
        </div>

        {id ? (
          <>
            <div className="chat-messages">
              {isPending ? (
                <div className="loading">Loading...</div>
              ) : messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div key={i} className={`message-wrapper ${msg.from}`}>
                    <div className="avatar">
                      {msg.from === "user" ? "U" : "B"}
                    </div>
                    <div className="message">
                      {msg.from === "bot" && msg.isNew ? (
                        <TypingText message={msg} setMessages={setMessages} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-chat-placeholder">
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h2>No Messages Yet</h2>
                  <p>Send a message to start the conversation below!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} disabled={isAsking}>
                {isAsking ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-chat-content">
            <FiMessageSquare />
            <h2>Start a Conversation</h2>
            <p>Select a session from the sidebar or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
