import { useState } from "react";
import "../styles/WelcomePage.scss";
import { getLocalItem, setLocalItem } from "../utils/localStorage.utils";
import { useNavigate } from "react-router";

export default function WelcomePage() {
  const savedName = getLocalItem("name") || "";
  const savedUsername = getLocalItem("username") || "";
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState(savedName);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!savedName.length && !savedUsername.length && name.trim()) {
      setLocalItem("name", name);
      setLocalItem("username", crypto.randomUUID());
      setSubmittedName(name);
    }
    navigate("/chat");
  };

  return (
    <div className="welcome-container">
      {!submittedName ? (
        <div className="card">
          <div className="header">
            <h1>Welcome</h1>
            <p>Please tell us your name to get started</p>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter your full name"
            />
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      ) : (
        <div className="card success-state">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1>
            Welcome, <span>{submittedName}</span>!
          </h1>
          <p>We're glad to have you here.</p>
          <button className="reset-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
