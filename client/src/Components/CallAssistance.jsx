import { useState, useEffect } from "react";
import "../Styling/CallAssistance.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CallAssistance() {
  const [activeTab, setActiveTab] = useState("add");
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch contacts from backend
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await axios.get(`https://mental-health-software.onrender.com/api/${userId}/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data);
      } catch (err) {
        console.error("Error loading contacts:", err);
      }
    }
    fetchContacts();
  }, [userId, token]);

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  // ✅ Add contact
  const addContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return alert("Enter name & phone");

    try {
      const res = await axios.post(
        `https://mental-health-software.onrender.com/api/${userId}/contacts`,
        newContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(res.data);
      setNewContact({ name: "", phone: "" });
      setActiveTab("contacts");
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  // ✅ Delete contact
  const deleteContact = async (contactId) => {
    try {
      const res = await axios.delete(
        `https://mental-health-software.onrender.com/api/${userId}/contacts/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(res.data);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div className="call-page">
      <h2>📞 Call Assistance</h2>

      <div className="tabs">
        <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>➕ Add Contact</button>
        <button className={activeTab === "contacts" ? "active" : ""} onClick={() => setActiveTab("contacts")}>📇 My Contacts</button>
      </div>

      {activeTab === "add" && (
        <form onSubmit={addContact} className="add-contact-form">
          <input name="name" value={newContact.name} placeholder="Name" onChange={handleChange}/>
          <input name="phone" value={newContact.phone} placeholder="+911234567890" onChange={handleChange}/>
          <button type="submit">Save Contact</button>
        </form>
      )}

      {activeTab === "contacts" && (
        <ul className="contact-list">
          {contacts.length === 0 && <p>No contacts added yet.</p>}
          {contacts.map((c) => (
            <li key={c._id} className="contact-item">
              <strong>{c.name}</strong> – {c.phone}
              <div>
                <a href={`tel:${c.phone}`} className="call-btn">📞 Call</a>
                <button onClick={() => deleteContact(c._id)}>❌ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate("/user-dashboard", { state: { openTab: "assistance" } })}
        className="back-btn"
      >
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default CallAssistance;
