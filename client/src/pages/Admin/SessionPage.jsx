// src/pages/SessionsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample data for demonstration
  const [sessions, setSessions] = useState([
    {
      id: 1,
      patient: 'John Doe',
      counsellor: 'Dr. Sarah Johnson',
      date: '2023-10-15',
      time: '10:00 AM',
      status: 'Scheduled'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      counsellor: 'Dr. Michael Chen',
      date: '2023-10-16',
      time: '2:30 PM',
      status: 'Completed'
    },
    {
      id: 3,
      patient: 'Robert Brown',
      counsellor: 'Dr. Emily Williams',
      date: '2023-10-17',
      time: '11:15 AM',
      status: 'Canceled'
    },
    {
      id: 4,
      patient: 'Maria Garcia',
      counsellor: 'Dr. Sarah Johnson',
      date: '2023-10-18',
      time: '4:00 PM',
      status: 'Scheduled'
    }
  ]);

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddNewSession = () => {
    navigate('/sessions/new');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    session.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.counsellor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#2196F3';
      case 'Completed': return '#4CAF50';
      case 'Canceled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.glassCard,
        ...(isLoaded ? styles.glassCardVisible : {})
      }}>
        <div style={styles.headerContainer}>
          <div>
            <h1 style={styles.header}>Sessions Management</h1>
            <p style={styles.subtitle}>View, add, or manage scheduled sessions.</p>
          </div>
          <button 
            style={styles.addButton}
            onClick={handleAddNewSession}
          >
            <span style={styles.plusIcon}>+</span>
            Add New Session
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search sessions by patient, counsellor, or status..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Patient</th>
                <th style={styles.tableHeader}>Counsellor</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Time</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => (
                  <tr 
                    key={session.id} 
                    style={{
                      ...styles.tableRow,
                      animationDelay: `${index * 0.1}s`
                    }}
                    className="fade-in-row"
                  >
                    <td style={styles.tableCell}>
                      <div style={styles.nameContainer}>
                        <div style={styles.avatar}>
                          {session.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        {session.patient}
                      </div>
                    </td>
                    <td style={styles.tableCell}>{session.counsellor}</td>
                    <td style={styles.tableCell}>{formatDate(session.date)}</td>
                    <td style={styles.tableCell}>{session.time}</td>
                    <td style={styles.tableCell}>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(session.status)
                        }}
                      >
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyMessage}>
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>📅</div>
                      <h3>No sessions found</h3>
                      <p>Try adjusting your search or add a new session to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// CSS styles with glassmorphism and animations
const styles = {
  container: {
    minHeight: '100vh',
    minWidth:'100vw',
    background: "url('/login-bg.jpg') no-repeat center center / cover",
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  glassCard: {
    background: 'rgba(202, 228, 246, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: '30px',
    marginTop: '1cm',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-out'
  },
  glassCardVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  header: {
    color: '#1f6c8aff',
    marginBottom: '5px',
    fontSize: '2.2rem',
    fontWeight: '700',
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: '#408dacff',
    fontSize: '1.1rem',
    margin: 0
  },
  addButton: {
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#3489aaff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    ':hover': {
      background: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
    }
  },
  plusIcon: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  searchContainer: {
    marginBottom: '25px'
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#050505ff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    '::placeholder': {
      color: '#080809ff',
    },
    ':focus': {
      background: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.4)'
    }
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#090b0cff',
  },
  tableHeader: {
    padding: '18px 15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '16px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.15)'
  },
  tableRow: {
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    opacity: 0,
    transform: 'translateX(-10px)',
    animation: 'fadeInRow 0.5s ease forwards',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  tableCell: {
    padding: '15px',
    fontSize: '15px'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '40px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  emptyIcon: {
    fontSize: '50px',
    marginBottom: '10px'
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('sessions-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'sessions-page-styles';
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInRow {
      from { 
        opacity: 0;
        transform: translateX(-10px);
      }
      to { 
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        align-items: stretch;
      }
      
      .add-button {
        align-self: flex-start;
      }
      
      table {
        font-size: 14px;
      }
      
      .table-cell {
        padding: 10px 8px;
      }
      
      .avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }
    }
    
    /* Scrollbar styling */
    .table-wrapper::-webkit-scrollbar {
      height: 8px;
    }
    
    .table-wrapper::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    .table-wrapper::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
    
    .table-wrapper::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inject global styles when component is imported
if (typeof document !== 'undefined') {
  injectGlobalStyles();
}

export default SessionsPage;