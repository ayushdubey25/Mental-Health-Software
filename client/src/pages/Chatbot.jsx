import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Styling/Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: ["💬 Hi! I’m your Mindful Buddy. How are you feeling today?"] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: [input.trim()] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const prompt = `You are a friendly mental-health support chatbot. 
      Respond with empathy, positive guidance, and comforting advice. 
      Include emojis and bullet points to make it visually soothing.
      User says: "${input.trim()}"`;

      const res = await axios.post(
        "https://mental-health-software.onrender.com/api/gemini/chat",
        { prompt }
      );

      const botBullets = res.data?.bullets || [
        "💙 I'm here for you. Could you share a bit more?"
      ];

      setMessages((prev) => [...prev, { role: "bot", text: botBullets }]);
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: ["❌ Sorry, I had trouble reaching the guidance service."] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-wrapper">
      <h2 className="chatbot-title">Mindful Buddy 💙</h2>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">
              {m.text.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg bot">
            <div className="bubble">Typing… 💭</div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Share your thoughts…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
