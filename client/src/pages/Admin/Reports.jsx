import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styling/Reports.css';

const API_URL = "https://mental-health-software.onrender.com/api";

const Reports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    newUsersThisWeek: 0,
    newVolunteersThisWeek: 0
  });
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, casesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, config),
        axios.get(`${API_URL}/admin/cases`, config)
      ]);
      
      setStats(statsRes.data);
      setCases(casesRes.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Active': '#3b82f6',
      'On Hold': '#6b7280',
      'Completed': '#10b981',
      'Closed': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#f97316',
      'Critical': '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  if (loading) {
    return <div className="reports-container">Loading...</div>;
  }

  const completionRate = stats.totalCases > 0 
    ? ((stats.completedCases / stats.totalCases) * 100).toFixed(1) 
    : 0;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Platform performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#dbeafe' }}>
            <span style={{ fontSize: '32px' }}>👥</span>
          </div>
          <div className="summary-content">
            <h3>Total Users</h3>
            <p className="summary-number">{stats.totalUsers}</p>
            <span className="summary-subtitle">+{stats.newUsersThisWeek} this week</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#ddd6fe' }}>
            <span style={{ fontSize: '32px' }}>🩺</span>
          </div>
          <div className="summary-content">
            <h3>Total Counsellors</h3>
            <p className="summary-number">{stats.totalVolunteers}</p>
            <span className="summary-subtitle">+{stats.newVolunteersThisWeek} this week</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#fef3c7' }}>
            <span style={{ fontSize: '32px' }}>📋</span>
          </div>
          <div className="summary-content">
            <h3>Active Cases</h3>
            <p className="summary-number">{stats.activeCases}</p>
            <span className="summary-subtitle">Out of {stats.totalCases} total</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#d1fae5' }}>
            <span style={{ fontSize: '32px' }}>✅</span>
          </div>
          <div className="summary-content">
            <h3>Completion Rate</h3>
            <p className="summary-number">{completionRate}%</p>
            <span className="summary-subtitle">{stats.completedCases} completed cases</span>
          </div>
        </div>
      </div>

      {/* Case Status Distribution */}
      <div className="report-section">
        <h2>Case Status Distribution</h2>
        <div className="status-chart">
          {['Pending', 'Active', 'On Hold', 'Completed', 'Closed'].map(status => {
            const count = cases.filter(c => c.status === status).length;
            const percentage = stats.totalCases > 0 ? (count / stats.totalCases) * 100 : 0;
            
            return (
              <div key={status} className="status-bar-item">
                <div className="status-label">
                  <span>{status}</span>
                  <span className="status-count">{count}</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-bar-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                </div>
                <span className="status-percentage">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="report-section">
        <h2>Case Severity Distribution</h2>
        <div className="severity-grid">
          {['Low', 'Medium', 'High', 'Critical'].map(severity => {
            const count = cases.filter(c => c.severity === severity).length;
            const percentage = stats.totalCases > 0 ? (count / stats.totalCases) * 100 : 0;
            
            return (
              <div 
                key={severity} 
                className="severity-card"
                style={{ borderLeftColor: getSeverityColor(severity) }}
              >
                <h3>{severity}</h3>
                <p className="severity-count">{count} cases</p>
                <div className="severity-progress">
                  <div 
                    className="severity-progress-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getSeverityColor(severity)
                    }}
                  />
                </div>
                <span className="severity-percentage">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="report-section">
        <h2>Recent Cases</h2>
        <div className="cases-table-wrapper">
          <table className="cases-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Counsellor</th>
                <th>Issue</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {cases.slice(0, 10).map(caseItem => (
                <tr key={caseItem._id}>
                  <td>{caseItem.userName}</td>
                  <td>{caseItem.volunteerId?.fullName || 'N/A'}</td>
                  <td>{caseItem.issue.substring(0, 40)}...</td>
                  <td>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(caseItem.severity) }}
                    >
                      {caseItem.severity}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="status-badge-small"
                      style={{ backgroundColor: getStatusColor(caseItem.status) }}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td>{new Date(caseItem.assignedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
