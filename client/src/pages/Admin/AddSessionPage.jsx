// src/pages/AddSessionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSessionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient: '',
    counsellor: '',
    date: '',
    time: '',
    status: 'Scheduled'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveSession = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert('New session saved!');
    navigate('/sessions');
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={styles.header}>Schedule a New Session</h1>
        <p style={styles.subtitle}>Enter the details for the new session below.</p>
        
        <form onSubmit={handleSaveSession} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="patient" style={styles.label}>Patient Name</label>
              <input 
                type="text" 
                id="patient" 
                placeholder="e.g., John Doe" 
                required 
                value={formData.patient}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="counsellor" style={styles.label}>Counsellor Name</label>
              <input 
                type="text" 
                id="counsellor" 
                placeholder="e.g., Dr. Alice Smith" 
                required 
                value={formData.counsellor}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="date" style={styles.label}>Date</label>
              <input 
                type="date" 
                id="date" 
                required 
                value={formData.date}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="time" style={styles.label}>Time</label>
              <input 
                type="time" 
                id="time" 
                required 
                value={formData.time}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="status" style={styles.label}>Status</label>
            <select 
              id="status" 
              value={formData.status}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              ...styles.saveButton,
              ...(isSubmitting ? styles.saveButtonLoading : {})
            }}
          >
            {isSubmitting ? (
              <>
                <span style={styles.spinner}></span>
                Saving...
              </>
            ) : (
              'Save Session'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// CSS styles with glassmorphism and animations
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
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
    maxWidth: '700px',
    animation: 'fadeIn 0.8s ease-out, slideUp 0.6s ease-out'
  },
  header: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '2.5rem',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1.1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '25px'
    }
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  label: {
    color: '#fff',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '1.1rem'
  },
  input: {
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)'
    },
    ':focus': {
      background: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-2px)'
    }
  },
  select: {
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    cursor: 'pointer',
    ':focus': {
      background: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-2px)'
    }
  },
  saveButton: {
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#6e8efb',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    ':hover': {
      background: '#fff',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
    },
    ':active': {
      transform: 'translateY(0)'
    }
  },
  saveButtonLoading: {
    opacity: '0.8',
    cursor: 'not-allowed'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(110, 142, 251, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#6e8efb',
    animation: 'spin 1s linear infinite'
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('session-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'session-page-styles';
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Responsive styles for form rows */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 25px;
      }
    }
    
    /* Style date and time inputs to match the theme */
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      opacity: 0.7;
      cursor: pointer;
    }
    
    input[type="date"]:focus::-webkit-calendar-picker-indicator,
    input[type="time"]:focus::-webkit-calendar-picker-indicator {
      opacity: 1;
    }
    
    /* Style for select dropdown */
    select option {
      background: rgba(110, 142, 251, 0.9);
      color: white;
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inject global styles when component is imported
if (typeof document !== 'undefined') {
  injectGlobalStyles();
}

export default AddSessionPage;