// import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, useNavigate,useLocation } from "react-router-dom";
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

import DashboardPage from "./pages/Admin/DashboardPage.jsx";
import UsersPage from "./pages/Admin/UserPage.jsx";
import AddUserPage from "./pages/Admin/AddUserPage.jsx";
import CounsellorsPage from "./pages/Admin/CounsellorPage.jsx";
import SessionsPage from "./pages/Admin/SessionPage.jsx";
import ReportsPage from "./pages/Admin/ReportPage.jsx";
import AddCounsellorPage from "./pages/Admin/AddCounsellorPage.jsx";
import AddSessionPage from "./pages/Admin/AddSessionPage.jsx";

import ChatWithVolunteer from "./pages/ChatWithVolunteer.jsx";

// Create a separate component for the main app content
function AppContent() {
  const [showChatbot, setShowChatbot] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  // Pages where logout button should NOT appear
  const noLogoutPages = [
    '/',
    '/login',
    '/helpRegister',
    '/volunteer-dashboard',
    '/admin-login',
    '/guest-page'
  ];

  // Check if current page should show logout button
  const shouldShowLogout = !noLogoutPages.includes(location.pathname);

  // Global Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
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

      {/* App Logo in Top Right - Show on all pages */}
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

      {/* Chatbot Icon in Bottom Right - Show on all pages */}
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
            {/* Close Button */}
            {/* Close Button */}
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
    if (svg) svg.setAttribute('fill', 'white'); // ensure fill changes
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
    e.currentTarget.style.transform = 'scale(1)';
    const svg = e.currentTarget.querySelector('svg');
    if (svg) svg.setAttribute('fill', '#333'); // reset fill
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

      {/* Routes */}
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
        <Route path="/admin-dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/addUser-page" element={<AddUserPage />} />
        <Route path="/counsellors" element={<CounsellorsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/add-counsellor-page" element={<AddCounsellorPage />} />
        <Route path="/add-session-page" element={<AddSessionPage />} />
        <Route path="/guest-page" element={<GuestPage />} />
        <Route path="/chat/:groupId" element={<ChatRoom/>} />
        <Route path="/music-player" element={<MusicPlayer />} />
        <Route path="/chat-volunteer" element={<ChatWithVolunteer />} />
        
      </Routes>

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

// Main App component that wraps everything with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;