import { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import HelpRegister from "./pages/Auth/HelpRegister.jsx"; 
import VolunteerRegister from "./pages/Auth/VolunteerRegister.jsx"; 
import AdminLogin from "./pages/Auth/AdminRegister.jsx"; 
import HelpIntro from "./pages/HelpIntro";
import UserDashboard from "./pages/UserDashboard";
import CallAssistance from "./Components/CallAssistance";
import Counseling from "./Components/Counselling";
import PeerGroups from "./Components/PeerGroups";
import EmergencySupport from "./Components/EmergencySupport";
import ChatRoom from "./Components/ChatRoom.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import MusicPlayer from "./Components/MusicPlayer.jsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.jsx";
import GuestPage from "./pages/GuestPage.jsx";
import CalmCorner from "./Components/CalmCorner.jsx";
import ChatWithVolunteer from "./pages/ChatWithVolunteer.jsx";

// NEW REAL ADMIN PAGES (NOT the old mock ones!)
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Users from "./pages/Admin/Users.jsx";
import Counsellors from "./pages/Admin/Counsellors.jsx";
import Sessions from "./pages/Admin/Sessions.jsx";
import Reports from "./pages/Admin/Reports.jsx";
import AdminSidebar from "./Components/AdminSidebar.jsx";

// Create a separate component for the main app content
function AppContent() {
  const [showChatbot, setShowChatbot] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  // Pages where logout button should NOT appear
  const noLogoutPages = [
    '/',
    '/login',
    '/helpRegister',
    '/volunteer-dashboard',
    '/admin/login',
    '/guest-page'
  ];

  // Admin routes that need sidebar
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/counsellors',
    '/admin/sessions',
    '/admin/reports'
  ];

  const isAdminRoute = adminRoutes.includes(location.pathname);
  const shouldShowLogout = !noLogoutPages.includes(location.pathname) && !isAdminRoute;

  // Global Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <>
      {/* Admin Layout with Sidebar */}
      {isAdminRoute ? (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
          <AdminSidebar />
          <div style={{ flex: 1, marginLeft: '260px', width: 'calc(100% - 260px)' }}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/counsellors" element={<Counsellors />} />
              <Route path="/admin/sessions" element={<Sessions />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      ) : (
        <>
          {/* Logout Button - Only show on certain pages */}
          {shouldShowLogout && (
            <button
              onClick={handleLogout}
              style={{
                position: 'fixed',
                top: '25px',
                left: '25px',
                background: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                cursor: 'pointer',
                zIndex: 1000,
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 6px 20px rgba(255, 71, 87, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 71, 87, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.4)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          )}

          {/* App Logo in Top Right */}
          {!isAdminRoute && (
            <img 
              src="/logo.png" 
              alt="App Logo" 
              className="app-logo"
              style={{
                position: 'fixed',
                top: '25px',
                right: '25px',
                width: '170px',
                height: '115px',
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          )}

          {/* Chatbot Icon */}
          {!isAdminRoute && (
            <button 
              className="chatbot-icon"
              onClick={() => setShowChatbot(!showChatbot)}
              style={{
                position: 'fixed',
                bottom: '25px',
                right: '25px',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #4cafef 0%, #8e7cc3 100%)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(76, 175, 239, 0.4)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                animation: 'float 3s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 239, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 239, 0.4)';
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
          )}

          {/* Chatbot Modal */}
          {showChatbot && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001
            }}>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                width: '90%',
                maxWidth: '1500px',
                maxHeight: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowChatbot(false)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 1002,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ff4757';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'white');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'scale(1)';
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.setAttribute('fill', '#333');
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
                
                <Chatbot onClose={() => setShowChatbot(false)} />
              </div>
            </div>
          )}

          {/* Non-Admin Routes */}
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/helpRegister" element={<HelpRegister />} />
            <Route path="/help-intro" element={<HelpIntro />} />
            <Route path="/volunteer-dashboard" element={<VolunteerRegister />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/volunteer-dash" element={<VolunteerDashboard />} />
            <Route path="/call" element={<CallAssistance />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/counseling" element={<Counseling />} />
            <Route path="/peer-groups" element={<PeerGroups />} />
            <Route path="/emergency" element={<EmergencySupport />} />
            <Route path="/calm-corner" element={<CalmCorner />} />
            <Route path="/guest-page" element={<GuestPage />} />
            <Route path="/chat/:groupId" element={<ChatRoom/>} />
            <Route path="/music-player" element={<MusicPlayer />} />
            <Route path="/chat-volunteer" element={<ChatWithVolunteer />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @media (max-width: 768px) {
          .chatbot-icon {
            bottom: 20px;
            right: 20px;
            width: 55px;
            height: 55px;
          }
          
          .chatbot-icon svg {
            width: 25px;
            height: 25px;
          }
        }
        
        @media (max-width: 480px) {
          .chatbot-icon {
            bottom: 15px;
            right: 15px;
            width: 50px;
            height: 50px;
          }
          
          .chatbot-icon svg {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
