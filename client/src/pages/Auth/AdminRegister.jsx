import React, { useState } from "react";
import "../../Styling/AdminRegister.css";

const AdminRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    mobile: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Admin Login:", formData.email, formData.password);
      alert("Admin logged in successfully! ✅");
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match ❌");
        return;
      }
      console.log("Admin Registered:", formData);
      alert("Admin registered successfully! ✅");
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <div className="register-header">
          <h1>{isLogin ? "Admin Login" : "Admin Registration"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="role"
                  placeholder="Role / Organization"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number (optional)"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

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

          <button type="submit" className="register-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="register-footer">
          {isLogin ? (
            <>
              <p className="toggle-link" onClick={() => setIsLogin(false)}>
                New Admin? Register here
              </p>
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </>
          ) : (
            <p className="toggle-link" onClick={() => setIsLogin(true)}>
              Already registered? Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;