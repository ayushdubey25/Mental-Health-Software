import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  faUsers,
  faUserDoctor,
  faCalendarCheck,
  faFileAlt,
  faChartLine,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// DashboardCard component
const DashboardCard = ({ to, icon, title, description, colorClass }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={to} 
      className={`dashboard-card ${colorClass}`}
      style={{
        ...styles.dashboardCard,
        ...(isHovered ? styles.dashboardCardHover : {}),
        ...(colorClass === 'blue' ? styles.blueCard : {}),
        ...(colorClass === 'green' ? styles.greenCard : {}),
        ...(colorClass === 'purple' ? styles.purpleCard : {}),
        ...(colorClass === 'teal' ? styles.tealCard : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        ...styles.cardIcon,
        ...(colorClass === 'blue' ? styles.blueIcon : {}),
        ...(colorClass === 'green' ? styles.greenIcon : {}),
        ...(colorClass === 'purple' ? styles.purpleIcon : {}),
        ...(colorClass === 'teal' ? styles.tealIcon : {})
      }}>
        <FontAwesomeIcon icon={icon} style={styles.icon} />
      </div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDescription}>{description}</p>
    </Link>
  );
};

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.glassCard,
        ...(isLoaded ? styles.glassCardVisible : {})
      }}>
        <div style={styles.dashboardHeader}>
          <h1 style={styles.header}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Select a section to manage.</p>
        </div>
        
        <div style={styles.dashboardGrid}>
          <DashboardCard
            to="/users"
            icon={faUsers}
            title="Users"
            description="Click to manage users."
            colorClass="blue"
          />
          <DashboardCard
            to="/counsellors"
            icon={faUserDoctor}
            title="Counsellors"
            description="Click to manage counsellors."
            colorClass="green"
          />
          <DashboardCard
            to="/sessions"
            icon={faCalendarCheck}
            title="Sessions"
            description="Click to manage sessions."
            colorClass="purple"
          />
          <DashboardCard
            to="/reports"
            icon={faChartLine}
            title="Reports"
            description="Click to manage reports."
            colorClass="teal"
          />
        </div>
        
        <footer style={styles.dashboardFooter}>
          <p style={styles.footerText}>Good mental health is great wealth</p>
        </footer>
      </div>
    </div>
  );
};

// CSS styles with glassmorphism and animations
const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    background: "url('/login-bg.jpg') no-repeat center center / cover",
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: '40px',
    width: '100%',
    maxWidth: '1200px',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-out'
  },
  glassCardVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  dashboardHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  header: {
    color: '#2a8cb3ff',
    marginBottom: '10px',
    fontSize: '2.5rem',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: 'rgba(38, 137, 207, 0.9)',
    fontSize: '1.1rem',
    margin: 0
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  dashboardCard: {
    background: 'rgba(18, 106, 213, 0.16)',
    borderRadius: '16px',
    padding: '25px',
    textDecoration: 'none',
    color: '#187ba2ff',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'rgba(255, 255, 255, 0.5)'
    }
  },
  dashboardCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    background: 'rgba(255, 255, 255, 0.2)'
  },
  cardIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    // background: 'rgba(169, 26, 116, 0.9)',
    fontSize: '28px',
    transition: 'all 0.3s ease'
  },
  icon: {
    // color: '#fff'
  },
  blueIcon: {
    background: 'rgba(43, 149, 242, 0.3)'
  },
  greenIcon: {
    background: 'rgba(26, 235, 33, 0.4)'
  },
  purpleIcon: {
    background: 'rgba(205, 74, 228, 0.3)'
  },
  tealIcon: {
    background: 'rgba(76, 221, 206, 0.4)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 10px 0'
  },
  cardDescription: {
    fontSize: '1rem',
    margin: 0,
    opacity: 0.9
  },
  dashboardFooter: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    margin: 0
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('dashboard-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'dashboard-page-styles';
  styleSheet.textContent = `
    /* Responsive styles */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .glass-card {
        padding: 25px;
      }
      
      .dashboard-header h1 {
        font-size: 2rem;
      }
    }
    
    /* Animation for card icons on hover */
    .dashboard-card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inject global styles when component is imported
if (typeof document !== 'undefined') {
  injectGlobalStyles();
}

export default DashboardPage;