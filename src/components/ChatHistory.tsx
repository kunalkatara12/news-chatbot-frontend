import { useState, type Dispatch, type SetStateAction } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getLocalItem, setLocalItem } from "../utils/localStorage.utils";
import "../styles/ChatPage.scss";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiMessageCircle,
  FiClock,
} from "react-icons/fi";
import { useResetSessionChats } from "../hooks/chats";

export default function ChatHistory({
  isHistoryVisible,
  setIsHistoryVisible,
}: {
  isHistoryVisible: boolean;
  setIsHistoryVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { id: activeId } = useParams();
  const navigate = useNavigate();
  const previousSessions = getLocalItem("sessions");
  const savedUsername = getLocalItem("username") || "";
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>(
    previousSessions ? JSON.parse(previousSessions) : []
  );
  const { mutate: clearSession } = useResetSessionChats();

  const handleNewSession = () => {
    const newId = `${savedUsername}:${Date.now().toString()}`;
    const newSession = {
      id: newId,
      title: `Session ${newId.slice(-4)}`, // Shorter title
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    setLocalItem("sessions", JSON.stringify(updated));
    navigate(`/chat/${newId}`);
    setIsHistoryVisible(false); // Close on mobile after creating
  };

  const handleClearAllSessions = () => {
    const idToDelete = getLocalItem("username");
    if (!idToDelete) return;

    if (
      !confirm(
        "Are you sure you want to delete all sessions? This action cannot be undone."
      )
    ) {
      return;
    }

    clearSession(
      { id: idToDelete, all: true },
      {
        onSuccess: () => {
          setSessions([]);
          setLocalItem("sessions", JSON.stringify([]));
          navigate("/chat");
          setIsHistoryVisible(false);
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  const handleDeleteSession = (idToDelete: string) => {
    if (!idToDelete) return;

    if (!confirm("Delete this session? This action cannot be undone.")) {
      return;
    }

    clearSession(
      { id: idToDelete },
      {
        onSuccess: () => {
          const newSessions = sessions.filter((s) => s.id !== idToDelete);
          setSessions(newSessions);
          setLocalItem("sessions", JSON.stringify(newSessions));
          if (activeId === idToDelete) {
            navigate("/chat");
          }
          setIsHistoryVisible(false);
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  const getSessionTime = (sessionId: string) => {
    const timestamp = sessionId.split(":")[1];
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className={`chat-history ${isHistoryVisible ? "visible" : ""}`}>
      <div className="history-header">
        <div className="header-title">
          <FiMessageCircle className="header-icon" />
          <h3>Chat Sessions</h3>
        </div>
        <div className="header-actions">
          <button
            className="action-btn new-btn"
            onClick={handleNewSession}
            title="Start New Chat"
          >
            <FiPlus />
          </button>
          <button
            className="action-btn clear-btn"
            onClick={handleClearAllSessions}
            title="Clear All Sessions"
            disabled={sessions.length === 0}
          >
            <FiTrash2 />
          </button>
          <button
            className="action-btn close-btn"
            onClick={() => setIsHistoryVisible(false)}
            title="Close Sidebar"
          >
            <FiX />
          </button>
        </div>
      </div>

      <div className="sessions-container">
        {sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FiMessageCircle />
            </div>
            <p className="empty-title">No conversations yet</p>
            <p className="empty-subtitle">Start your first chat session!</p>
            <button className="start-chat-btn" onClick={handleNewSession}>
              <FiPlus />
              New Chat
            </button>
          </div>
        ) : (
          <div className="sessions-list">
            <div className="sessions-count">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </div>
            <ul>
              {sessions
                .sort((a, b) => {
                  const timeA = parseInt(a.id.split(":")[1] || "0");
                  const timeB = parseInt(b.id.split(":")[1] || "0");
                  return timeB - timeA; // Most recent first
                })
                .map((session) => (
                  <li
                    key={session.id}
                    className={`session-item ${
                      session.id === activeId ? "active" : ""
                    }`}
                  >
                    <Link
                      to={`/chat/${session.id}`}
                      className="session-link"
                      onClick={() => setIsHistoryVisible(false)}
                    >
                      <div className="session-content">
                        <div className="session-title">{session.title}</div>
                        <div className="session-meta">
                          <FiClock className="time-icon" />
                          <span className="session-time">
                            {getSessionTime(session.id)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`session-status ${
                          session.id === activeId ? "active" : ""
                        }`}
                      ></div>
                    </Link>
                    <button
                      className="delete-btn"
                      title="Delete session"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {savedUsername.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="user-details">
            <div className="username">{savedUsername || "User"}</div>
            <div className="user-status">Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}
