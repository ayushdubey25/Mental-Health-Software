import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/GuestPage.css";

function GuestPage() {
  const [activeGuide, setActiveGuide] = useState("seekHelp");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    // Navigate to user registration/login page
    navigate("/helpRegister");
  };

  const handleJoinAsVolunteer = () => {
    // Navigate to volunteer registration/login page
    navigate("/volunteer-dashboard");
  };

  const handleAIBuddy = () => {
    navigate("/chatbot");
  };

  const handleViewDashboards = () => {
    // Navigate to dashboard page
    navigate("/dashboards");
  };

  return (
    <div className="guest-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className={`glass-card main-content ${isVisible ? 'fade-in' : ''}`}>
        <h1 className="main-title">🌸 Welcome to Mindful Campus</h1>
        <p className="subtitle">Your mental wellness journey begins here</p>
        
        <div className="guide-section">
          <h2 className="guide-question">How would you like to join us today?</h2>
          
          {/* Tabs */}
          <div className="guest-tabs">
            <button
              className={`tab-btn ${activeGuide === "seekHelp" ? "active-tab" : ""}`}
              onClick={() => setActiveGuide("seekHelp")}
            >
              <span className="icon">💙</span>
              <span>I Need Help</span>
            </button>
            <button
              className={`tab-btn ${activeGuide === "volunteer" ? "active-tab" : ""}`}
              onClick={() => setActiveGuide("volunteer")}
            >
              <span className="icon">💚</span>
              <span>Join as Volunteer</span>
            </button>
          </div>

          {/* Content */}
          <div className="guide-content">
            {activeGuide === "seekHelp" && (
              <div className="guide-card slide-in">
                <h2>🧑‍🤝‍🧑 Guide for Those Seeking Mental Help</h2>
                <div className="guide-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <strong>Register or Login</strong> to create your safe space.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <strong>Share Your Concerns</strong> confidentially with our system.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <strong>Get Matched</strong> with trained volunteers or professionals.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <strong>Talk, Chat or Call</strong> — choose the way you feel comfortable.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <strong>Access Resources</strong> like articles, exercises, and wellness tips anytime.
                    </div>
                  </div>
                </div>
                <p className="note">💡 Everything you share stays private & secure.</p>
                <button className="action-btn" onClick={handleGetStarted}>
                  Get Started
                </button>
              </div>
            )}

            {activeGuide === "volunteer" && (
              <div className="guide-card slide-in">
                <h2>🌟 Guide for Volunteers & Helpers</h2>
                <div className="guide-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <strong>Sign Up</strong> as a volunteer and create your profile.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <strong>Share Your Skills</strong> (e.g., counseling, psychology, active listening).
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <strong>Get Assigned</strong> cases based on your availability & skills.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <strong>Manage Your Schedule</strong> for counseling sessions and chats.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <strong>Use Resources</strong> — guides, toolkits, and training to support clients better.
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">6</div>
                    <div className="step-content">
                      <strong>Make an Impact</strong> by supporting someone in need 💕.
                    </div>
                  </div>
                </div>
                <p className="note">💡 Remember: Even listening with empathy can save a life.</p>
                <button className="action-btn" onClick={handleJoinAsVolunteer}>
                  Join as Volunteer
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="alternative-options">
          <p>Or choose another option:</p>
          <div className="option-buttons">
            <button className="alt-option-btn" onClick={handleAIBuddy}>
              <span className="alt-icon">🤖</span>
              <span>Talk to our AI buddy</span>
            </button>
            {/* <button className="alt-option-btn" onClick={handleViewDashboards}>
              <span className="alt-icon">📊</span>
              <span>View anonymized dashboards</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;