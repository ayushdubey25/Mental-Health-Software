import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../Styling/ChatWithVolunteer.css";
import axios from "axios";

export default function ChatWithVolunteer() {
  // Receive emails from navigation state
  const { state } = useLocation();
  const { volunteerEmail, userEmail } = state || {};

  // Get login info from storage
  const localVolunteerEmail = localStorage.getItem("volunteerEmail");
  const localUserEmail = localStorage.getItem("email");
  // Decide current user: volunteer if present, else user
  let currentUserEmail = localVolunteerEmail || localUserEmail;
  
  // Defensive fallback prompt for demo/dev
  if (!currentUserEmail && state) {
    const maybeMe = prompt(
      `Who are you? Enter your email for this session:\nVolunteer: ${volunteerEmail}\nUser: ${userEmail}`
    );
    if (maybeMe && (maybeMe === volunteerEmail || maybeMe === userEmail)) {
      currentUserEmail = maybeMe;
      if (maybeMe === volunteerEmail)
        localStorage.setItem("volunteerEmail", maybeMe);
      else
        localStorage.setItem("email", maybeMe);
    }
  }

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userEmail || !volunteerEmail) return;
    axios.get(`https://mental-health-software.onrender.com/api/chat/${userEmail}/${volunteerEmail}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [userEmail, volunteerEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!currentUserEmail) {
      alert("Could not detect your email. Please log in again.");
      return;
    }
    try {
      const res = await axios.post("https://mental-health-software.onrender.com/api/chat/send", {
        userEmail,
        volunteerEmail,
        senderEmail: currentUserEmail,
        message: text,
      });
      setMessages(res.data.messages);
      setText("");
    } catch (err) {
      alert(
        err?.response?.data?.error ||
        "Could not send message. Try again, check your connection."
      );
      console.error("Error sending message:", err);
    }
  };

  const sendFile = async (selectedFile) => {
  const sendThisFile = selectedFile || file;
  if (!sendThisFile) return;
  if (!currentUserEmail) {
    alert("Could not detect your email. Please log in again.");
    return;
  }
  const formData = new FormData();
  formData.append("file", sendThisFile);
  formData.append("userEmail", userEmail);
  formData.append("volunteerEmail", volunteerEmail);
  formData.append("senderEmail", currentUserEmail);

  try {
    const res = await axios.post("https://mental-health-software.onrender.com/api/chat/send-file", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setMessages(res.data.messages);
    setFile(null);
  } catch (err) {
    alert("File upload failed. " + (err.response?.data?.error || ""));
  }
};

  return (
    <div className="chat-volunteer-room dashboard-fullscreen-chat">
      <div className="chat-volunteer-header">
        <span>Volunteer Chat</span>
        <span>{volunteerEmail}</span>
      </div>

      <div className="chat-volunteer-messages">
        {messages.map((m, i) => {
          const isMine = m.senderEmail === currentUserEmail;
          return (
            <div key={i} className={`message-row ${isMine ? "mine" : ""}`}>
              <div className={`message ${isMine ? "mine" : ""}`}>
                <span className="sender-name">{m.senderEmail}</span>
                {m.fileUrl ? (m.fileType && m.fileType.startsWith("image/") ?
                  <img src={m.fileUrl} alt="attachment" style={{ maxWidth: 120 }} /> :
                  <a href={m.fileUrl} target="_blank" rel="noreferrer">📄 {m.fileName}</a>
                ) : <div>{m.message}</div>}
                <div className="message-timestamp">
                  {m.timestamp &&
                    new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="composer">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
       <input
  type="file"
  onChange={e => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Immediately send file
      sendFile(e.target.files[0]);
      // Clear input so user can select the same file twice in a row
      e.target.value = null;
    }
  }}
/>

        <button onClick={sendMessage}>Send</button>
        
      </div>
    </div>
  );
}
