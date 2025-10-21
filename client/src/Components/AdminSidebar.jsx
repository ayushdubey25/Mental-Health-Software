import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUsers,
  faUserDoctor,
  faCalendarCheck,
  faChartLine,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { icon: faHouse, label: 'Dashboard', path: '/' },
    { icon: faUsers, label: 'Users', path: '/users' },
    { icon: faUserDoctor, label: 'Counsellors', path: '/counsellors' },
    { icon: faCalendarCheck, label: 'Sessions', path: '/sessions' },
    { icon: faChartLine, label: 'Reports', path: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Serenity</h2>
      </div>
      <div className="sidebar-profile">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHBvcnRyYWl0fHx8fHx8MTY5OTI2NzU0Mg&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Admin Profile"
        />
        <h3>Admin Name</h3>
        <p>admin@serenity.com</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive && item.path !== '/' ? 'active' : '')}
              >
                <FontAwesomeIcon icon={item.icon} className="icon" /> {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;