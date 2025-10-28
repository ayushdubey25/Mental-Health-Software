import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styling/Sessions.css';

const API_URL = "http://localhost:5600/api";

const Sessions = () => {
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    volunteerId: '',
    issue: '',
    severity: 'Medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [usersRes, volunteersRes, casesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, config),
        axios.get(`${API_URL}/admin/volunteers`, config),
        axios.get(`${API_URL}/admin/cases`, config)
      ]);
      
      setUsers(usersRes.data);
      setVolunteers(volunteersRes.data);
      setCases(casesRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.volunteerId || !formData.issue) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${API_URL}/admin/cases/assign`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Case assigned successfully!");
      setShowModal(false);
      setFormData({ userId: '', volunteerId: '', issue: '', severity: 'Medium' });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to assign case: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/admin/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(cases.filter(c => c._id !== caseId));
      alert("Case deleted successfully");
    } catch (err) {
      alert("Failed to delete case");
    }
  };

  if (loading) {
    return <div className="sessions-container">Loading...</div>;
  }

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1>Case Management</h1>
        <button className="assign-btn" onClick={() => setShowModal(true)}>
          + Assign New Case
        </button>
      </div>

      <div className="cases-grid">
        {cases.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No cases assigned yet. Click "Assign New Case" to get started.
          </p>
        ) : (
          cases.map(caseItem => (
            <div key={caseItem._id} className="case-card">
              <div className="case-header">
                <div className={`status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                  {caseItem.status}
                </div>
                <div className={`severity-badge ${caseItem.severity.toLowerCase()}`}>
                  {caseItem.severity}
                </div>
              </div>
              
              <h3>{caseItem.userName}</h3>
              
              <div className="case-details">
                <div className="detail-item">
                  <span className="label">User Email:</span>
                  <span>{caseItem.userEmail}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Volunteer:</span>
                  <span>{caseItem.volunteerId?.fullName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Contact:</span>
                  <span>{caseItem.userContact}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Issue:</span>
                  <span>{caseItem.issue}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Assigned:</span>
                  <span>{new Date(caseItem.assignedDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button 
                className="delete-case-btn"
                onClick={() => handleDelete(caseItem._id)}
              >
                Delete Case
              </button>
            </div>
          ))
        )}
      </div>

      {/* Assignment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Assign New Case</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select User *</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  required
                >
                  <option value="">-- Select User --</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Counsellor *</label>
                <select
                  value={formData.volunteerId}
                  onChange={(e) => setFormData({...formData, volunteerId: e.target.value})}
                  required
                >
                  <option value="">-- Select Counsellor --</option>
                  {volunteers.map(vol => (
                    <option key={vol._id} value={vol._id}>
                      {vol.fullName} - {vol.skills?.[0] || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Issue Description *</label>
                <textarea
                  value={formData.issue}
                  onChange={(e) => setFormData({...formData, issue: e.target.value})}
                  placeholder="Describe the user's concern..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Assign Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
