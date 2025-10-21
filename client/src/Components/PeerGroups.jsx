import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styling/PeerGroups.css";

export default function PeerGroups() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("join");
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", category: "Mental Issue" });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ✅ Fetch groups (all or filtered by user history)
  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await axios.get(`http://localhost:5600/api/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Error loading groups", err.response?.data || err.message);
      }
    }
    loadGroups();
  }, [token]);

  const handleChange = (e) => {
    setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
  };

  // ✅ Create a new group
  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name.trim()) {
      alert("Please enter a group name.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5600/api/groups",
        {
          name: newGroup.name,
          category: newGroup.category,
          condition: newGroup.category, // you can map to user's history if needed
          createdBy: userId
        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      setGroups((prev) => [...prev, res.data]);
      alert(`Group "${newGroup.name}" created ✅`);
      setNewGroup({ name: "", category: "Mental Issue" });
      setActiveTab("join");
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.error || "Failed to create group");
    }
  };

  // ✅ Join a group and navigate to ChatRoom
  const joinGroup = async (groupId) => {
  try {
    await axios.post(
      `http://localhost:5600/api/groups/${groupId}/join`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate(`/chat/${groupId}`); // opens ChatRoom.jsx
  } catch (err) {
    alert(err.response?.data?.error || "Failed to join group");
  }
};


  return (
    <div className="peer-groups-page">
      <h2>👥 Peer Groups</h2>
      <p>Find or create a safe space to connect with others 💙</p>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "join" ? "active" : ""}
          onClick={() => setActiveTab("join")}
        >
          🔎 Join a Group
        </button>
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create a Group
        </button>
      </div>

      {/* Join existing groups */}
      {activeTab === "join" && (
        <div className="group-list">
          {groups.length === 0 && <p>No groups found yet.</p>}
          {groups.map((g) => (
            <div key={g._id} className="group-card">
              <h3>{g.name}</h3>
              <p><strong>Category:</strong> {g.category}</p>
              <p><strong>Members:</strong> {g.members?.length || 0}</p>
              <button onClick={() => joinGroup(g._id)} className="join-btn">
                Join Group
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create a new group */}
      {activeTab === "create" && (
        <form onSubmit={createGroup} className="create-form">
          <input
            type="text"
            name="name"
            value={newGroup.name}
            placeholder="Group Name"
            onChange={handleChange}
          />
          <select
            name="category"
            value={newGroup.category}
            onChange={handleChange}
          >
            <option value="Mental Issue">Mental Issue</option>
            <option value="Interest">Interest</option>
          </select>
          <button type="submit">Create Group</button>
        </form>
      )}

      <button
        className="back-btn"
        onClick={() => navigate("/user-dashboard", { state: { openTab: "assistance" } })}
      >
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}
