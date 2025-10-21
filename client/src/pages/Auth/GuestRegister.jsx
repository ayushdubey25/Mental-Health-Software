import { useState } from "react";
import "../../Styling/GuestRegister.css";

function GuestAuth() {
  const [formData, setFormData] = useState({
    nickname: "",
    ageRange: "",
    language: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [isLogin, setIsLogin] = useState(true); // toggle login/register

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Guest Login:", formData.nickname, formData.password);
      alert("Logged in as Guest ✅");
      // TODO: Guest login API
    } else {
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match ❌");
        return;
      }
      console.log("Guest Registered:", formData);
      alert("Guest account created 🎉");
      // TODO: Guest register API
    }
  };

  return (
    <div className="guest-container">
      <h2>{isLogin ? "Guest Login 🎟️" : "Guest Registration ✨"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Common fields */}
        <input
          type="text"
          name="nickname"
          placeholder="Nickname / Display Name"
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <select name="ageRange" onChange={handleChange}>
              <option value="">Age Range (optional)</option>
              <option value="teen">13-19 (Teen)</option>
              <option value="adult">20-40 (Adult)</option>
              <option value="senior">40+ (Senior)</option>
            </select>

            <select name="language" onChange={handleChange}>
              <option value="">Language Preference</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="regional">Other</option>
            </select>

            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              onChange={handleChange}
            />
          </>
        )}

        {/* Password (optional) */}
        <input
          type="password"
          name="password"
          placeholder="Password (optional)"
          onChange={handleChange}
        />

        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
        )}

        <label className="remember">
          <input type="checkbox" name="remember" onChange={handleChange} /> Remember me
        </label>

        <button type="submit" className="btn">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div className="toggle-section">
        {isLogin ? (
          <>
            <p onClick={() => setIsLogin(false)}>👉 New guest? Register here</p>
            {formData.password && (
              <a href="/forgot-password" className="forgot-link">
                Forgot Password?
              </a>
            )}
          </>
        ) : (
          <p onClick={() => setIsLogin(true)}>👉 Already registered? Login</p>
        )}
      </div>
    </div>
  );
}

export default GuestAuth;
