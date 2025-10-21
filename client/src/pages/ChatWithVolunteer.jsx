import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styling/ChatWithVolunteer.css"
import axios from "axios";

export default function ChatWithVolunteer() {
  const { state } = useLocation();
  const { volunteerEmail, userEmail } = state || {}; // pass userEmail from previous page
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!userEmail || !volunteerEmail) return;

    axios
      .get(`http://localhost:5600/api/chat/${userEmail}/${volunteerEmail}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [userEmail, volunteerEmail]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post("http://localhost:5600/api/chat/send", {
        userEmail,
        volunteerEmail,
        senderEmail: userEmail,
        message: text,
      });

      setMessages(res.data.messages);
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <h2>Chat with {volunteerEmail}</h2>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.senderEmail}:</strong> {m.message}
          </p>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
