// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faEye, 
  faEdit, 
  faTrash, 
  faUserPlus,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');

  // Sample data for demonstration
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Patient',
      joinedDate: '2023-05-15',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Counsellor',
      joinedDate: '2023-04-22',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      role: 'Patient',
      joinedDate: '2023-06-30',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      role: 'Admin',
      joinedDate: '2023-01-10',
      status: 'Active'
    },
    {
      id: 5,
      name: 'James Wilson',
      email: 'james.w@example.com',
      role: 'Counsellor',
      joinedDate: '2023-03-18',
      status: 'Pending'
    }
  ]);

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddNewUser = () => {
    navigate('/users/new');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedRole === 'all' || user.role === selectedRole)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Inactive': return '#F44336';
      case 'Pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewUser = (userId) => {
    console.log(`View user with ID: ${userId}`);
    // Navigate to user detail page or show modal
  };

  const handleEditUser = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
    // Navigate to edit user page
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    // Show confirmation modal and delete user
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.glassCard,
        ...(isLoaded ? styles.glassCardVisible : {})
      }}>
        <div style={styles.headerContainer}>
          <div>
            <h1 style={styles.header}>Users Management</h1>
            <p style={styles.subtitle}>Manage all registered users on the platform.</p>
          </div>
          <button 
            style={styles.addButton}
            onClick={handleAddNewUser}
          >
            <FontAwesomeIcon icon={faUserPlus} style={styles.buttonIcon} />
            Add New User
          </button>
        </div>

        <div style={styles.controlsContainer}>
          <div style={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterContainer}>
            <FontAwesomeIcon icon={faFilter} style={styles.filterIcon} />
            <select 
              value={selectedRole} 
              onChange={handleRoleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Roles</option>
              <option value="Patient">Patient</option>
              <option value="Counsellor">Counsellor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Role</th>
                <th style={styles.tableHeader}>Joined Date</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    style={{
                      ...styles.tableRow,
                      animationDelay: `${index * 0.1}s`
                    }}
                    className="fade-in-row"
                  >
                    <td style={styles.tableCell}>
                      <div style={styles.nameContainer}>
                        <div style={styles.avatar}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.roleBadge,
                        ...(user.role === 'Admin' ? styles.adminBadge : {}),
                        ...(user.role === 'Counsellor' ? styles.counsellorBadge : {}),
                        ...(user.role === 'Patient' ? styles.patientBadge : {})
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{formatDate(user.joinedDate)}</td>
                    <td style={styles.tableCell}>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(user.status)
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button 
                          style={styles.actionButton}
                          onClick={() => handleViewUser(user.id)}
                          title="View User"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          style={{...styles.actionButton, ...styles.editButton}}
                          onClick={() => handleEditUser(user.id)}
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          style={{...styles.actionButton, ...styles.deleteButton}}
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyMessage}>
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>👥</div>
                      <h3>No users found</h3>
                      <p>Try adjusting your search or add a new user to get started.</p>
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
    width: '100vw',
    background: "url('/login-bg.jpg') no-repeat center center / cover",
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  glassCard: {
    marginTop: '1cm',
    background: 'rgba(181, 216, 237, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: '30px',
    opacity: 0,
    width: '100%',
    maxWidth: '1400px',
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-out',
    boxSizing: 'border-box'
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
    fontSize: '2.5rem',
    fontWeight: '700',
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: '#4a9ab9ff',
    fontSize: '1.2rem',
    margin: 0
  },
  addButton: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#2a8cb3ff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    ':hover': {
      background: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
    }
  },
  buttonIcon: {
    fontSize: '18px'
  },
  controlsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  searchContainer: {
    position: 'relative',
    flex: '1',
    minWidth: '300px'
  },
  searchIcon: {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#0a0d0fff',
    fontSize: '18px'
  },
  searchInput: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'black',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    '::placeholder': {
      color: '#0f1112ff',
    },
    ':focus': {
      background: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.4)'
    }
  },
  filterContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  filterIcon: {
    position: 'absolute',
    left: '18px',
    color: 'rgba(52, 135, 191, 1)',
    fontSize: '18px',
    zIndex: 1
  },
  filterSelect: {
    padding: '16px 16px 16px 50px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#141515ff',
    fontSize: '16px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    minWidth: '200px',
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
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxHeight: 'calc(100vh - 250px)',
    minHeight: '400px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#0e1011ff',
  },
  tableHeader: {
    padding: '20px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '16px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 10
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
    padding: '18px 16px',
    fontSize: '16px'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
    flexShrink: 0
  },
  roleBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  adminBadge: {
    backgroundColor: 'rgba(156, 39, 176, 0.3)'
  },
  counsellorBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)'
  },
  patientBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)'
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#2a8cb3ff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.1)'
    }
  },
  editButton: {
    ':hover': {
      background: 'rgba(255, 193, 7, 0.2)'
    }
  },
  deleteButton: {
    ':hover': {
      background: 'rgba(244, 67, 54, 0.2)'
    }
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '15px'
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('users-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'users-page-styles';
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
    
    /* Style for select dropdown */
    select option {
      background: rgba(110, 142, 251, 0.9);
      color: white;
    }
    
    /* Responsive styles */
    @media (max-width: 1024px) {
      .glass-card {
        margin: 10px;
        padding: 20px;
      }
      
      .header {
        font-size: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      .glass-card {
        border-radius: 15px;
        padding: 15px;
      }
      
      .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
      }
      
      .add-button {
        align-self: flex-start;
      }
      
      .controls-container {
        flex-direction: column;
        gap: 15px;
      }
      
      .search-container, .filter-container {
        min-width: 100%;
      }
      
      table {
        font-size: 14px;
      }
      
      .table-cell {
        padding: 12px 10px;
      }
      
      .avatar {
        width: 38px;
        height: 38px;
        font-size: 14px;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 8px;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        font-size: 1.8rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
      
      .add-button {
        padding: 12px 18px;
        font-size: 14px;
      }
      
      .search-input, .filter-select {
        padding: 14px 14px 14px 45px;
        font-size: 14px;
      }
    }
    
    /* Scrollbar styling */
    .table-wrapper::-webkit-scrollbar {
      height: 8px;
      width: 8px;
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

export default UsersPage;