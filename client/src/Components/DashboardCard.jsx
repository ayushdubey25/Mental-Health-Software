import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DashboardCard = ({ to, icon, title, description, colorClass }) => {
  return (
    <Link to={to} className={`dashboard-card ${colorClass}`}>
      <div className="card-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default DashboardCard;