import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
import "../../Styling/HelpRegister.css";

function HelpRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    language: "",
    relationship: "",
    mobile: "",
    location: "",
    supportMode: "",
    email: "",
    password: "",
    remember: false,
  });

  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isLogin ? "/help/login" : "/help/register";

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");

    const user = data.user || data; // data.user for login, data for register
    if (!user?._id) throw new Error("No user in response");

    // ✅ Store full user object
    localStorage.setItem("user", JSON.stringify(user));

    if (isLogin) {
      localStorage.setItem("token", data.token); // if you have JWT
      localStorage.setItem("userId", user._id);
      alert("Logged in successfully ✅");
      navigate(`/user-dashboard`);
    } else {
      alert("Registration successful 💙 Please answer a few questions.");
      navigate("/help-intro", { state: { user } }); // pass full user object
    }
  } catch (err) {
    alert(err.message);
  }
};

 
  return (
    <div className="register-container">
      <h2>{isLogin ? "Login for Assistance 🔑" : "Register for Assistance 💙"}</h2>

      <form onSubmit={handleSubmit}> 
        {!isLogin && (
          <>
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />

            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="preferNot">Prefer not to say</option>
            </select>

            <select name="language" onChange={handleChange} required>
              <option value="">Language Preference</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="regional">Other</option>
            </select>

            <select name="relationship" onChange={handleChange}>
              <option value="">Relationship Status (optional)</option>
              <option value="single">Single</option>
              <option value="inRelationship">In Relationship</option>
              <option value="married">Married</option>
              <option value="other">Other</option>
            </select>

            <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
            <input type="text" name="location" placeholder="City/Region (optional)" onChange={handleChange} />

            <select name="supportMode" onChange={handleChange}>
              <option value="">Preferred Support Mode</option>
              <option value="chat">Chat</option>
              <option value="call">Call</option>
              <option value="peer">Peer Group</option>
            </select>
          </>
        )}

        {/* Common fields for Login & Register */}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <label className="remember">
          <input type="checkbox" name="remember" onChange={handleChange} /> Remember me
        </label>

        {!isLogin && (
          <label className="consent">
            <input type="checkbox" required /> I agree to the terms & privacy policy
          </label>
        )}

        <button type="submit" className="btn">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div className="toggle-section">
        {isLogin ? (
          <>
            <p onClick={() => setIsLogin(false)}>👉 New here? Register now</p>
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </>
        ) : (
          <p onClick={() => setIsLogin(true)}>👉 Already registered? Login here</p>
        )}
      </div>
    </div>
  );
}

export default HelpRegister;
