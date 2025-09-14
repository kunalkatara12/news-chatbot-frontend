import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import ChatHistory from "../components/ChatHistory";
import "../styles/ChatPage.scss";
import {
  FiMenu,
  FiMessageSquare,
  FiSend,
  // FiMic,
  // FiPaperclip,
} from "react-icons/fi";
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
      setMessages((prev) => [
        ...prev,
        { from: "user", text: query, isNew: false },
      ]);

      ask(
        { id, query },
        {
          onSuccess: (res) => {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: res, isNew: true },
            ]);
          },
          onError: (err) => console.error(err),
        }
      );

      setQuery("");
    } catch {
      console.log("error");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
        {/* Enhanced header with gradient */}
        <div className="chat-header">
          <button
            className="menu-toggle"
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          >
            <FiMenu />
          </button>
          <div className="header-content">
            <h2>
              {id ? (
                <>
                  <span className="session-label">Session</span>
                  <span className="session-id">
                    {id.split(":").pop()?.slice(-4) || "Unknown"}
                  </span>
                </>
              ) : (
                "No Session Selected"
              )}
            </h2>
            <div className="status-indicator">
              <div className={`status-dot ${id ? "active" : "inactive"}`}></div>
              <span className="status-text">
                {id ? "Connected" : "No session"}
              </span>
            </div>
          </div>
          <div className="header-actions">
            {/* Future actions can go here */}
          </div>
        </div>

        {id ? (
          <>
            <div className="chat-messages">
              {isPending ? (
                <div className="loading-container">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                  <p>Loading conversation...</p>
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`message-wrapper ${msg.from}`}>
                      <div className="avatar">
                        <div className="avatar-inner">
                          {msg.from === "user" ? "You" : "AI"}
                        </div>
                      </div>
                      <div className="message-content">
                        <div className="message-bubble">
                          {msg.from === "bot" && msg.isNew ? (
                            <TypingText
                              message={msg}
                              setMessages={setMessages}
                            />
                          ) : (
                            msg.text
                          )}
                        </div>
                        <div className="message-timestamp">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-chat-placeholder">
                  <div className="empty-icon-container">
                    <svg
                      className="empty-icon"
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
                  </div>
                  <h3>Ready to chat!</h3>
                  <p>
                    Start by typing a message below. I'm here to help with
                    anything you need.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input">
                <div className="input-wrapper">
                  <textarea
                    placeholder="Type your message here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={1}
                    style={{
                      height: "auto",
                      minHeight: "44px",
                      maxHeight: "120px",
                      resize: "none",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${Math.min(
                        target.scrollHeight,
                        120
                      )}px`;
                    }}
                  />
                  {/* <div className="input-actions">
                    <button className="attachment-btn" title="Attach file">
                      <FiPaperclip />
                    </button>
                    <button className="voice-btn" title="Voice message">
                      <FiMic />
                    </button>
                  </div> */}
                </div>
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={isAsking || !query.trim()}
                  title="Send message"
                >
                  {isAsking ? <div className="btn-spinner"></div> : <FiSend />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-chat-content">
            <div className="welcome-container">
              <div className="welcome-icon">
                <FiMessageSquare />
              </div>
              <h2>Welcome to ChatAI</h2>
              <p>
                Select an existing session from the sidebar or create a new one
                to start chatting.
              </p>
              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">💬</span>
                  <span>Natural conversations</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🧠</span>
                  <span>Intelligent responses</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Fast and reliable</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
