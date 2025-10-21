import React, { useState, useEffect } from 'react';
// --- 1. Import necessary components from Chart.js library ---
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- 2. Register the components you will use ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    counsellors: 0,
    articlesPublished: 0
  });

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Simulate data loading
      setStats({
        totalUsers: 1248,
        activeSessions: 36,
        counsellors: 18,
        articlesPublished: 42
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // --- 3. Prepare chart data ---
  const userGrowthData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Total Users',
        data: [520, 640, 780, 910, 1050, 1248],
        borderColor: 'rgba(110, 142, 251, 1)',
        backgroundColor: 'rgba(110, 142, 251, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(110, 142, 251, 1)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const sessionVolumeData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sessions Completed',
        data: [120, 145, 182, 210, 258, 312],
        backgroundColor: 'rgba(167, 119, 227, 0.6)',
        borderColor: 'rgba(167, 119, 227, 1)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(167, 119, 227, 0.8)',
      },
    ],
  };

  const counsellorDistributionData = {
    labels: ['Available', 'In Session', 'On Leave'],
    datasets: [
      {
        label: 'Counsellors',
        data: [12, 4, 2],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.glassCard,
        ...(isLoaded ? styles.glassCardVisible : {})
      }}>
        <h1 style={styles.header}>Reports & Analytics</h1>
        <p style={styles.subtitle}>View key metrics and performance data for the platform.</p>
        
        {/* --- 4. Statistic cards with animations --- */}
        <div style={styles.statsGrid}>
          <div style={styles.reportCard}>
            <h2 style={styles.reportCardLabel}>Total Users</h2>
            <p style={styles.reportCardValue}>{stats.totalUsers}</p>
            <div style={styles.cardTrend}>
              <span style={styles.trendPositive}>+12%</span> from last month
            </div>
          </div>
          <div style={styles.reportCard}>
            <h2 style={styles.reportCardLabel}>Active Sessions</h2>
            <p style={styles.reportCardValue}>{stats.activeSessions}</p>
            <div style={styles.cardTrend}>
              <span style={styles.trendPositive}>+8%</span> from yesterday
            </div>
          </div>
          <div style={styles.reportCard}>
            <h2 style={styles.reportCardLabel}>Counsellors</h2>
            <p style={styles.reportCardValue}>{stats.counsellors}</p>
            <div style={styles.cardTrend}>
              <span style={styles.trendNeutral}>+2</span> this quarter
            </div>
          </div>
          <div style={styles.reportCard}>
            <h2 style={styles.reportCardLabel}>Articles Published</h2>
            <p style={styles.reportCardValue}>{stats.articlesPublished}</p>
            <div style={styles.cardTrend}>
              <span style={styles.trendPositive}>+5</span> this month
            </div>
          </div>
        </div>

        <div style={styles.chartsSection}>
          <div style={styles.chartContainer}>
            <div style={styles.chartWrapper}>
              <Line 
                options={{
                  ...chartOptions, 
                  plugins: {
                    ...chartOptions.plugins, 
                    title: {
                      ...chartOptions.plugins.title, 
                      text: 'User Growth Over Time'
                    }
                  }
                }} 
                data={userGrowthData} 
              />
            </div>
          </div>
          <div style={styles.chartContainer}>
            <div style={styles.chartWrapper}>
              <Bar 
                options={{
                  ...chartOptions, 
                  plugins: {
                    ...chartOptions.plugins, 
                    title: {
                      ...chartOptions.plugins.title, 
                      text: 'Monthly Session Volume'
                    }
                  }
                }} 
                data={sessionVolumeData} 
              />
            </div>
          </div>
          <div style={styles.chartContainer}>
            <div style={styles.chartWrapper}>
              <Doughnut 
                options={{
                  ...doughnutOptions, 
                  plugins: {
                    ...doughnutOptions.plugins, 
                    title: {
                      ...doughnutOptions.plugins.title, 
                      text: 'Counsellor Distribution'
                    }
                  }
                }} 
                data={counsellorDistributionData} 
              />
            </div>
          </div>
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
    background: 'rgba(138, 199, 242, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: '40px',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-out',
    marginTop:'1cm'
  },
  glassCardVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  header: {
    color: '#1f6c8aff',
    marginBottom: '10px',
    fontSize: '2.5rem',
    // fontWeight: '700',
    // textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    color: '#05161dff',
    fontSize: '1.1rem',
    margin: '0 0 30px 0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  reportCard: {
    background: '#439abc55',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.6s ease-out',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      background: 'rgba(255, 255, 255, 0.2)'
    }
  },
  reportCardLabel: {
    color: 'rgba(18, 13, 13, 0.8)',
    fontSize: '1rem',
    fontWeight: '500',
    margin: '0 0 10px 0'
  },
  reportCardValue: {
    color: '#0a0f11ff',
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  cardTrend: {
    color: 'rgba(17, 6, 6, 0.7)',
    fontSize: '0.9rem'
  },
  trendPositive: {
    color: '#4CAF50',
    fontWeight: '600'
  },
  trendNeutral: {
    color: '#FFC107',
    fontWeight: '600'
  },
  chartsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '25px',
  },
  chartContainer: {
    background: 'rgba(81, 161, 211, 0.74)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  chartWrapper: {
    height: '300px',
    position: 'relative',
  }
};

// Function to inject keyframes as global styles
const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist
  if (document.getElementById('reports-page-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'reports-page-styles';
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Staggered animation for stat cards */
    .report-card:nth-child(1) { animation-delay: 0.1s; }
    .report-card:nth-child(2) { animation-delay: 0.2s; }
    .report-card:nth-child(3) { animation-delay: 0.3s; }
    .report-card:nth-child(4) { animation-delay: 0.4s; }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .glass-card {
        padding: 25px;
      }
      
      .header {
        font-size: 2rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inject global styles when component is imported
if (typeof document !== 'undefined') {
  injectGlobalStyles();
}

export default ReportsPage;