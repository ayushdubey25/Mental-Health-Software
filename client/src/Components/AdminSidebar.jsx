import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUsers,
  faUserDoctor,
  faCalendarCheck,
  faChartLine,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../Styling/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({ name: "Admin", email: "admin@serenity.com" });

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    alert("Logged out successfully!");
    navigate("/admin/login");
  };

  const navItems = [
    { icon: faHouse, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: faUsers, label: 'Users', path: '/admin/users' },
    { icon: faUserDoctor, label: 'Counsellors', path: '/admin/counsellors' },
    { icon: faCalendarCheck, label: 'Sessions', path: '/admin/sessions' },
    { icon: faChartLine, label: 'Reports', path: '/admin/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serenity Admin</h2>
      </div>
      <div className="sidebar-profile">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHBvcnRyYWl0fHx8fHx8MTY5OTI2NzU0Mg&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Admin Profile"
        />
        <h3>{adminData.name}</h3>
        <p>{adminData.email}</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <FontAwesomeIcon icon={item.icon} className="icon" /> {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button 
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px"
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
