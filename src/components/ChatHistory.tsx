import { useState, type Dispatch, type SetStateAction } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getLocalItem, setLocalItem } from "../utils/localStorage.utils";
import "../styles/ChatPage.scss";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
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
  };

  const handleClearAllSessions = () => {
    const idToDelete = getLocalItem("username");
    if (!idToDelete) return;
    clearSession(
      { id: idToDelete, all: true },
      {
        onSuccess: () => {
          setSessions([]);
          setLocalItem("sessions", JSON.stringify([]));
          navigate("/chat");
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  const handleDeleteSession = (idToDelete: string) => {
    if (!idToDelete) return;
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
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <div className={`chat-history ${isHistoryVisible ? "visible" : ""}`}>
      <div className="history-header">
        <h3>Sessions</h3>
        <div className="actions">
          <button
            className="new"
            onClick={handleNewSession}
            title="New Session"
          >
            <FiPlus />
          </button>
          <button
            className="clear"
            onClick={handleClearAllSessions}
            title="Clear All"
          >
            <FiTrash2 />
          </button>
          <button
            className="close-menu"
            onClick={() => setIsHistoryVisible(false)}
            title="Close Menu"
          >
            <FiX />
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="empty">No sessions yet. Start a new one!</p>
      ) : (
        <ul>
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`session-item ${s.id === activeId ? "active" : ""}`}
            >
              <Link to={`/chat/${s.id}`} className="title">
                {s.title}
              </Link>
              <button
                className="delete"
                title="Delete session"
                onClick={() => handleDeleteSession(s.id)}
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
