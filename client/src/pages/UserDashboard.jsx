import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmotionDetector from "../Components/EmotionDetector.jsx";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../Styling/UserDashboard.css";
import ChatWithVolunteer from "./ChatWithVolunteer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; 

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.openTab || "profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const [sensorData, setSensorData] = useState([]);
  const [collecting, setCollecting] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const intervalRef = useRef(null);

  // fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return setLoading(false);

    axios.get(`http://localhost:5600/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Profile editing handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Handle file upload logic here
    console.log("File selected:", e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await axios.put(`http://localhost:5600/api/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const startCollection = () => {
    if (intervalRef.current) return;
    setCollecting(true);
    intervalRef.current = true;
  };

  const stopCollection = () => {
    intervalRef.current = null;
    setCollecting(false);
  };

  const onEmotionResult = (res) => {
    console.log("UserDashboard received result:", res);
    setSensorData(prev => [
      ...prev.slice(-50),
      {
        time: res.time,
        heart: res.heart,
        temp: res.temp,
        happy: Number(res.happy),
        stress: Number(res.stress),
        anxiety: Number(res.anxiety),
        breathing: res.breathing,
        oxygen: res.oxygen,
        audioLevel: res.audioLevel
      }
    ]);
  };
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


  const downloadReportPDF = () => {
    if (!aiReport) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    let cursorY = 40;

    // Header
    doc.setFillColor("#4caf50");
    doc.rect(0, 0, pageWidth, 60, "F");
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.setFont(undefined, "bold");
    doc.text("AI Wellness Report", margin, cursorY + 20);

    cursorY += 80;

    // User info
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.setFont(undefined, "normal");

    const userName = user?.fullName || "Anonymous";
    const dateStr = new Date().toLocaleString();
    doc.text(`Name: ${userName}`, margin, cursorY);
    doc.text(`Generated On: ${dateStr}`, margin, cursorY + 20);
    doc.text(`Average Happiness: ${avgHappy}`, margin, cursorY + 40);
    doc.text(`Average Stress: ${avgStress}`, margin, cursorY + 60);

    cursorY += 100;

    // AI Insights
    doc.setFontSize(16);
    doc.setTextColor("#4caf50");
    doc.setFont(undefined, "bold");
    doc.text("AI Insights", margin, cursorY);

    cursorY += 20;

    // Body
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.setFont(undefined, "normal");

    const stripEmojis = (text) => text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, ""
    );

    const parseBold = (text) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part) => ({
        text: stripEmojis(part.replace(/\*\*/g, "")),
        bold: part.startsWith("**") && part.endsWith("**"),
      }));
    };

    const lines = aiReport.split("\n").flatMap((line) => parseBold(line));

    lines.forEach((line) => {
      if (cursorY > doc.internal.pageSize.height - 60) {
        doc.addPage();
        cursorY = margin;
      }
      doc.setFont(undefined, line.bold ? "bold" : "normal");
      doc.text(line.text, margin, cursorY);
      cursorY += 18;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor("#777777");
    doc.setFont(undefined, "normal");
    doc.text(
      "Generated by Mental Health Buddy",
      margin,
      doc.internal.pageSize.height - 30
    );

    doc.save(`AI_Report_${userName.replace(/\s+/g, "_")}.pdf`);
  };

  // Fixed calculations to handle null values
  const avgHeart = "Not measured"; // Since heart data is null
  const avgTemp = "Not measured";  // Since temp data is null
  const avgHappy = sensorData.length ? (sensorData.reduce((a,b)=>a + (Number(b.happy)||0),0)/sensorData.length).toFixed(1) : 0;
  const avgStress = sensorData.length ? (sensorData.reduce((a,b)=>a + (Number(b.stress)||0),0)/sensorData.length).toFixed(1) : 0;
  const avgAnxiety = sensorData.length ? (sensorData.reduce((a,b)=>a + (Number(b.anxiety)||0),0)/sensorData.length).toFixed(1) : 0;

  const generateAIReport = async () => {
    if (!sensorData.length) return alert("Collect some mood data first.");
    setReportLoading(true);
    setAiReport("");
    try {
      const payload = {
        avgHeart,
        avgTemp,
        avgHappy,
        avgStress,
        avgAnxiety,
        data: sensorData
      };
      console.log("Sending payload:", payload); // Debug log
      const res = await axios.post("http://localhost:5600/api/ai-report", payload);
      setAiReport(res.data.report);
    } catch (err) {
      console.error("AI Report Error:", err);
      alert("Unable to generate AI report.");
    } finally {
      setReportLoading(false);
    }
  };

 useEffect(() => {
    axios.get("http://localhost:5600/api/volunteer")
      .then(res => setVolunteers(res.data))
      .catch(err => {
        console.error("Unable to load volunteers:", err);
        setVolunteers([]);
      });
  }, []);


  if (loading) return <p className="dashboard-container">Loading profile…</p>;
  if (!user) return <p className="dashboard-container">No user found.</p>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("mood")}>Mood Statistics</button>
        <button onClick={() => setActiveTab("history")}>Medical History</button>
        <button onClick={() => setActiveTab("assistance")}>Assistance</button>
      </nav>

      <div className="dashboard-content">
        {activeTab === "profile" && (
          <div className="card profile-card">
            <h2>👤 Profile</h2>
            <div className="profile-details">
              <img
                src={
                  user.profileImage
                    ? `http://localhost:5600${user.profileImage}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="profile-img"
              />
              <div>
                {isEditing ? (
                  <>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <input name="fullName" value={user.fullName || ""} onChange={handleInputChange} />
                    <input type="number" name="age" value={user.age || ""} onChange={handleInputChange} />
                    <input name="gender" value={user.gender || ""} onChange={handleInputChange} />
                    <input type="email" name="email" value={user.email || ""} onChange={handleInputChange} />
                    <input name="location" value={user.location || ""} onChange={handleInputChange} />
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {user.fullName}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving…" : "💾 Save"}
              </button>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
            )}
          </div>
        )}

        {activeTab === "mood" && (
          <div className="card mood-card"> 
            <h2>📊 Mood & Real-Time Sensor</h2>
            
            <div style={{ marginBottom: "1rem" }}>
              <button onClick={startCollection} disabled={collecting}>▶️ Start</button>
              <button onClick={stopCollection} disabled={!collecting} style={{ marginLeft: "1rem" }}>⏹ Stop</button>
            </div>

            {collecting && (
              <div style={{ marginBottom: 12 }}>
                <EmotionDetector onResult={onEmotionResult} />
              </div>
            )}

            {["happy","stress","anxiety"].map((key,i)=>(
              <div key={key}>
                <h4 style={{color:'#2d3748'}}>{["🙂 Happiness","😟 Stress","😰 Anxiety"][i]}</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey={key} stroke="#4caf50" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}

            {!collecting && sensorData.length > 0 && (
              <div className="ai-report-section">
                <p style={{ marginTop: "1rem", color: '#2d3748' }}>
                  <strong>Average Happiness:</strong> {avgHappy} &nbsp;
                  <strong>Average Stress:</strong> {avgStress} &nbsp;
                  <strong>Average Anxiety:</strong> {avgAnxiety}
                </p>
                <button
                  className="ai-report-btn"
                  onClick={generateAIReport}
                  disabled={reportLoading}
                >
                  {reportLoading ? "Generating AI Report…" : "🤖 Generate AI Report"}
                </button>
                
                {reportLoading && (
                  <p className="report-loading">AI is analyzing your data…</p>
                )}
                
                {aiReport && (
                  <>
                    <div className="ai-report-box">
                      <h3>AI Wellness Report</h3>
                      <p>{aiReport}</p>
                    </div>
                    <button 
                      className="download-pdf-btn"
                      onClick={downloadReportPDF}
                    >
                      📄 Download PDF Report
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="card history-card">
            <h2>🧠 Medical History</h2>
            <div className="history-content">
              <div className="history-section">
                <div className="history-section-title">Conditions</div>
                {user.history && user.history.length > 0 ? (
                  <div className="conditions-list">
                    {user.history.map((condition, index) => (
                      <span key={index} className="condition-tag">{condition}</span>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No medical conditions recorded</div>
                )}
              </div>
              
              <div className="history-section">
                <div className="history-section-title">Additional Notes</div>
                {user.extraNotes ? (
                  <p className="notes-content">{user.extraNotes}</p>
                ) : (
                  <div className="empty-state">No additional notes provided</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "assistance" && (
          <div className="card assistance-card">
            <h2>🤝 Assistance Options</h2>
            <p>What kind of support do you need right now?</p>
            <div className="assistance-options">
              <button onClick={() => navigate("/call", { state: { from: "assistance" } })}>📞 Call</button>
              <button onClick={() => navigate("/counseling")}>👩‍⚕️ Professional Counseling</button>
              <button onClick={() => navigate("/peer-groups")}>👥 Peer Group</button>
              <button onClick={() => navigate("/emergency")}>🚨 Emergency Support</button>
              <button onClick={() => navigate("/calm-corner")}>🎵 Calm Corner</button>
            </div>

            <hr style={{ margin: "1.5rem 0" }} />

            <p>💬 Chat with a Volunteer</p>
            <p>Select a volunteer to start chatting:</p>
         
<div className="volunteer-list">
  {volunteers.map((v) => (
    <button
      key={v.email}
      // Navigate to chat-volunteer room, pass both emails!
      onClick={() =>
        navigate("/chat-volunteer", {
          state: {
            volunteerEmail: v.email,
            userEmail: user.email
          }
        })
      }
      className="volunteer-btn"
    >
      {v.fullName} ({v.skills || "N/A"})
    </button>
  ))}
</div>



           {selectedVolunteer && (
  <ChatWithVolunteer
    userEmail={user.email}
    volunteerEmail={selectedVolunteer.email}
  />
)}

          </div>
        )}
      </div>
    </div>
  );
}
