// src/pages/CounsellorsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CounsellorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for demonstration
  const [counsellors, setCounsellors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      expertise: 'Anxiety, Depression',
      availability: 'Mon, Wed, Fri (9am - 5pm)',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      expertise: 'Relationship Counseling, PTSD',
      availability: 'Tue, Thu, Sat (10am - 6pm)',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      expertise: 'Addiction, Trauma',
      availability: 'Mon, Tue, Wed (11am - 7pm)',
      status: 'On Leave'
    }
  ]);

  const handleAddNewCounsellor = () => {
    navigate('/counsellors/new');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCounsellors = counsellors.filter(counsellor =>
    counsellor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counsellor.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#4CAF50';
      case 'Busy': return '#FF9800';
      case 'On Leave': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.headerContainer}>
          <div>
            <h1 style={styles.header}>Counsellors Management</h1>
            <p style={styles.subtitle}>View, add, or manage counsellor profiles.</p>
          </div>
          <button 
            style={styles.addButton}
            onClick={handleAddNewCounsellor}
          >
            <span style={styles.plusIcon}>+</span>
            Add New Counsellor
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search counsellors by name or expertise..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Expertise</th>
                <th style={styles.tableHeader}>Availability</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCounsellors.length > 0 ? (
                filteredCounsellors.map(counsellor => (
                  <tr key={counsellor.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.nameContainer}>
                        <div style={styles.avatar}>
                          {counsellor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {counsellor.name}
                      </div>
                    </td>
                    <td style={styles.tableCell}>{counsellor.expertise}</td>
                    <td style={styles.tableCell}>{counsellor.availability}</td>
                    <td style={styles.tableCell}>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(counsellor.status)
                        }}
                      >
                        {counsellor.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.emptyMessage}>
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>👥</div>
                      <h3>No counsellors found</h3>
                      <p>Try adjusting your search or add a new counsellor to get started.</p>
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
    minWidth: '100vw',
    background: "url('/login-bg.jpg') no-repeat center center / cover",
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    marginTop: '1cm',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: '30px',
    animation: 'fadeIn 0.8s ease-out',
    width:'100vw',
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
    color: '#187ba2ff',
    marginBottom: '5px',
    fontSize: '2.2rem',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: '#338fb4ff',
    fontSize: '1.1rem',
    margin: 0
  },
  addButton: {
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(196, 218, 240, 0.9)',
    color: '#187ba2ff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    ':hover': {
      color: '#060b0cff',
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
    color: '#060707ff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)'
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
    color: '#050e11ff',
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
    color: '#030304ff',
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
    color: '#05090bff',
  },
  emptyIcon: {
    fontSize: '50px',
    marginBottom: '10px',
    color:'white'
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('counsellors-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'counsellors-page-styles';
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
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

export default CounsellorsPage;