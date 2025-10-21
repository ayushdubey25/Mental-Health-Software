import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // 👈 import navigate
import { API_URL } from "../utils/api"
import "../Styling/HelpIntro.css";

function HelpIntro() {
  const navigate = useNavigate();
  const location = useLocation();
const userId = location.state?.userId || localStorage.getItem("userId");  // id passed from registration/login

  const [formData, setFormData] = useState({
    trauma: "",
    history: [],
    disorders: [],
    assistance: "",
    otherHistory: "",
    extraNotes: "",
  });

  // ✅ Save userId to localStorage so dashboard can fetch it later
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  }, [userId]);

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((i) => i !== value),
    }));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await fetch(`${API_URL}/users/${userId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});


      alert("Thank you for sharing 💙 We’ll connect you to the right support.");
      console.log("Submitting to:", `${API_URL}/help/intro/${userId}`, formData);

      // ✅ Dashboard can now read userId directly from localStorage
      navigate("/user-dashboard");
    } catch (err) {
      alert("Failed to save info: " + err.message);
    }
  };

  return (
    <div className="help-intro-container">
      <h2>💙 Welcome, You’re Safe Here</h2>
      <p className="intro-text">
        You are not alone. Things may feel difficult right now, but with support, 
        healing is possible. We’re here to walk this journey with you. 💫
      </p>

      <form onSubmit={handleSubmit}>
        <label>🕊️ Would you like to share any trauma you’ve experienced?</label>
        <textarea
          name="trauma"
          placeholder="Share if you feel comfortable..."
          onChange={handleChange}
        ></textarea>

        <label>🧠 Do you have any mental health history?</label>
        <div className="checkbox-group">
          {["Anxiety", "Depression", "PTSD", "Bipolar Disorder", "OCD", "None", "Other"].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                value={item}
                onChange={(e) => handleCheckboxChange(e, "history")}
              />
              {item}
            </label>
          ))}
        </div>

        {formData.history.includes("Other") && (
          <input
            type="text"
            name="otherHistory"
            placeholder="Please specify your condition"
            onChange={handleChange}
          />
        )}

        <label>💬 Anything else you’d like us to know before we proceed?</label>
        <textarea
          name="extraNotes"
          placeholder="Write your thoughts here..."
          onChange={handleChange}
        />

        <button type="submit" className="btn">Continue</button>
      </form>
    </div>
  );
}

export default HelpIntro;
