import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styling/AdminRegister.css";

const API_URL = "http://localhost:5600/api";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin/login`, {
        email: formData.email,
        password: formData.password
      });

      // Store token
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));

      alert(`Welcome ${res.data.admin.name}! ✅`);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      alert("Invalid admin credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <div className="register-header">
          <h1>Admin Login</h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Only authorized admins can access this portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div style={{
              padding: "10px",
              background: "#fee",
              color: "#c00",
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>Remember me!</span>
            </label>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-footer" style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          <p>Contact system administrator for access</p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
