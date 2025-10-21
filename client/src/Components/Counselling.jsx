import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatWithVolunteer from "../pages/ChatWithVolunteer";
import "../Styling/Counselling.css";

function Counseling() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);

  // ✅ adjust if you keep user info differently
  const user = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get("http://localhost:5600/api/volunteer");
        setVolunteers(res.data);
      } catch (err) {
        console.error("Error fetching volunteers:", err.response?.data || err.message);
      }
    };
    fetchVolunteers();
  }, []);

 const handleChatClick = (vol) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.email) return alert("User not logged in!");

  navigate("/chat-volunteer", {
    state: {
      userEmail: user.email,  // <--- must pass
      volunteerEmail: vol.email,
    },
  });
};


  return (
    <div className="counseling-page">
      <h2>👩‍⚕️ Professional Counseling</h2>
      <p>Select a volunteer to start a private chat or call.</p>

      <div className="professional-list">
        {volunteers.length === 0 && <p>No volunteers found yet.</p>}
        {volunteers.map((vol) => (
          <div key={vol._id} className="professional-card">
            <h3>{vol.fullName}</h3>
            {vol.skills && <p><strong>Skills:</strong> {vol.skills}</p>}
            {vol.bio && <p><strong>Bio:</strong> {vol.bio}</p>}
            <p><strong>Email:</strong> {vol.email}</p>
            {vol.mobile && <p><strong>Mobile:</strong> {vol.mobile}</p>}

            <div className="actions">
              {vol.mobile && (
                <a href={`tel:${vol.mobile}`} className="call-btn">
                  📞 Call
                </a>
              )}
              <button
                className="chat-btn"
                onClick={() => handleChatClick(vol)}
              >
                💬 Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="back-btn"
        onClick={() =>
          navigate("/user-dashboard", { state: { openTab: "assistance" } })
        }
      >
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default Counseling;
