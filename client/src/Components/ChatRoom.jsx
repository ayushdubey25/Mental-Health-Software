import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "../Styling/ChatRoom.css";

let socket;

export default function ChatRoom() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [membersCount, setMembersCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!groupId) return;

    const load = async () => {
      try {
        const [msgsRes, countRes] = await Promise.all([
          axios.get(`http://localhost:5600/api/groups/${groupId}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5600/api/groups/${groupId}/membersCount`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMessages(msgsRes.data || []);
        setMembersCount(countRes.data.count || 0);
      } catch (err) {
        console.error("Error loading chat data:", err.response?.data || err.message);
      }
    };

    load();

    // Connect socket
    socket = io("http://localhost:5600", { auth: { token } });

    socket.on("connect", () => {
      socket.emit("joinRoom", groupId);
    });

    socket.on("chatMessage", (message) => {
      setMessages((m) => [...m, message]);
      scrollToBottom();
    });

    return () => {
      if (socket) {
        socket.emit("leaveRoom", groupId);
        socket.disconnect();
        socket = null;
      }
    };
    // eslint-disable-next-line
  }, [groupId, token]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("chatMessage", { groupId, message: text, user: userId });
    setText("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-room">
      <header className="chat-header">
        <button onClick={() => navigate("/peer-groups")}>⬅️ Back</button>
        <h3>Group Chat</h3>
        <div className="members-count">Members: {membersCount}</div>
      </header>

      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.user === userId ? "mine" : ""}`}>
            <div className="text">{m.message || m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="composer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a supportive message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
