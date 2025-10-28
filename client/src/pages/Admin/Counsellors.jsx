import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styling/Counsellors.css';

const API_URL = "https://mental-health-software.onrender.com/api";

const Counsellors = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/volunteers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(res.data);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      alert("Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (volunteerId) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/admin/volunteers/${volunteerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(volunteers.filter(v => v._id !== volunteerId));
      alert("Volunteer deleted successfully");
    } catch (err) {
      alert("Failed to delete volunteer");
    }
  };

  const filteredVolunteers = volunteers.filter(vol =>
    vol.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vol.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="counsellors-container">Loading...</div>;
  }

  return (
    <div className="counsellors-container">
      <div className="counsellors-header">
        <h1>Counsellors Management</h1>
        <p>Total Counsellors: {volunteers.length}</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search counsellors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="counsellors-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map(vol => (
              <tr key={vol._id}>
                <td>{vol.fullName}</td>
                <td>{vol.email}</td>
                <td>{vol.age}</td>
                <td>{vol.gender}</td>
                <td>{vol.mobile}</td>
                <td>{vol.skills?.slice(0, 2).join(', ') || 'N/A'}</td>
                <td>{vol.availability} hrs/week</td>
                <td>{new Date(vol.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(vol._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Counsellors;
