import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styling/AdminDashboard.css';

const API_URL = "https://mental-health-software.onrender.com/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    newUsersThisWeek: 0,
    newVolunteersThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <span className="stat-change positive">
              +{stats.newUsersThisWeek} this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon volunteers">🩺</div>
          <div className="stat-content">
            <h3>Total Counsellors</h3>
            <p className="stat-number">{stats.totalVolunteers}</p>
            <span className="stat-change positive">
              +{stats.newVolunteersThisWeek} this week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cases">📋</div>
          <div className="stat-content">
            <h3>Total Cases</h3>
            <p className="stat-number">{stats.totalCases}</p>
            <span className="stat-change neutral">
              {stats.activeCases} active
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div className="stat-content">
            <h3>Completed Cases</h3>
            <p className="stat-number">{stats.completedCases}</p>
            <span className="stat-change positive">
              {((stats.completedCases / stats.totalCases) * 100 || 0).toFixed(1)}% completion rate
            </span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/admin/users'}>
            <span className="action-icon">👥</span>
            <span>Manage Users</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/counsellors'}>
            <span className="action-icon">🩺</span>
            <span>Manage Counsellors</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/sessions'}>
            <span className="action-icon">📅</span>
            <span>Assign Cases</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/reports'}>
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
