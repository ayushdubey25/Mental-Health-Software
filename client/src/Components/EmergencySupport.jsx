import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// If also using face mesh, leave your EmotionDetector import below as needed

export default function EmergencySupport({ user }) {
  const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();

  // Fetch all volunteers (with their emergencyAvailability)
  useEffect(() => {
    axios.get("https://mental-health-software.onrender.com/api/volunteer")
      .then(res => setVolunteers(res.data))
      .catch(err => {
        console.error("Unable to load volunteers:", err);
        setVolunteers([]);
      });
  }, []);

  // --- Helper: Filter available volunteers for current time ---
  function isVolunteerAvailableNow(vol) {
    if (!vol.emergencyAvailability || !Array.isArray(vol.emergencyAvailability)) return false;
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return vol.emergencyAvailability.some(slot =>
      slot.day === currentDay &&
      slot.start &&
      slot.end &&
      convert(slot.start) <= minutesNow &&
      convert(slot.end) > minutesNow
    );
    function convert(t) {
      const [h, m] = t.split(':').map(Number);
      return h*60+(m||0);
    }
  }

  return (
    <div className="emergency-support-card">
      <h2>🚨 Emergency Volunteer Support</h2>
      <p>Contact a volunteer who is available right now for immediate support:</p>
      <div className="emergency-volunteer-list">
        {volunteers.filter(isVolunteerAvailableNow).length === 0 ? (
          <p style={{color:'gray'}}>No volunteers available for emergency right now.</p>
        ) : (
          volunteers
            .filter(isVolunteerAvailableNow)
            .map(v => (
              <div key={v.email} className="emergency-volunteer-row" style={{marginBottom:"18px"}}>
                <span style={{fontWeight:"bold"}}>{v.fullName} ({v.mobile})</span>
                {" | "}
                <button
                  style={{marginRight:8}}
                  onClick={() => window.open(`tel:${v.mobile}`)}
                  title="Call now"
                >📞 Call</button>
                <button
                  onClick={() => navigate("/chat-volunteer", { state: { volunteerEmail: v.email, userEmail: user.email } })}
                  title="Chat now"
                >💬 Chat</button>
                <div style={{fontSize:"0.92em", color:"#3a7"}}>
                  {v.emergencyAvailability
                    .filter(slot => slot.day === new Date().toLocaleString('en-US', { weekday: 'long' }))
                    .map((slot, idx) => (
                      <span key={idx}>Available until {slot.end}</span>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
      {/* Optionally display detection UI or info here */}
    </div>
  );
}
