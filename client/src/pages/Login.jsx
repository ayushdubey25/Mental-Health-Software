import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Styling/Login.css";

function Login() {
  const navigate = useNavigate();
  const [activeHover, setActiveHover] = useState(null);

  const handleSelect = (role) => {
    localStorage.setItem("role", role);
    if (role === "help") navigate("/helpRegister"); 
    if (role === "volunteer") navigate("/volunteer-dashboard");
    if (role === "admin") navigate("/admin-dashboard");
    if (role === "guest") navigate("/guest-page");
  };

  // Floating animation for background elements
  useEffect(() => {
    const moveElements = (e) => {
      const elements = document.querySelectorAll('.floating-element');
      elements.forEach(element => {
        const speed = parseInt(element.getAttribute('data-speed'));
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', moveElements);
    return () => {
      document.removeEventListener('mousemove', moveElements);
    };
  }, []);

  return (
    <div className="login-container">
      {/* Animated background elements */}
      <div className="floating-element" data-speed="2" style={{top: '10%', left: '5%'}}>🌿</div>
      <div className="floating-element" data-speed="5" style={{top: '20%', right: '15%'}}>✨</div>
      <div className="floating-element" data-speed="3" style={{bottom: '30%', left: '15%'}}>🌱</div>
      <div className="floating-element" data-speed="4" style={{bottom: '10%', right: '5%'}}>💫</div>
      
      <div className="login-content">
        <div className="welcome-text">
          <h1>Welcome to <span className="app-name">Mindful Campus</span></h1>
          <p>Your mental wellness journey begins here</p>
        </div>
        
        <div className="login-card">
          <h2>
            <span className="text-wave">How_</span>
            <span className="text-wave" style={{animationDelay: '0.1s'}}> would_</span>
            <span className="text-wave" style={{animationDelay: '0.2s'}}> you_</span>
            <span className="text-wave" style={{animationDelay: '0.3s'}}> like_ </span>
            <span className="text-wave" style={{animationDelay: '0.4s'}}> to_ </span>
            <span className="text-wave" style={{animationDelay: '0.5s'}}> join_ </span>
            <span className="text-wave" style={{animationDelay: '0.6s'}}> us_ </span>
            <span className="text-wave" style={{animationDelay: '0.7s'}}> today? </span>
          </h2>

          <div className="role-options">
            <div 
              className={`role-card ${activeHover === 'help' ? 'active' : ''}`}
              onClick={() => handleSelect("help")}
              onMouseEnter={() => setActiveHover('help')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="card-icon">💙</div>
              <div className="ripple-effect"></div>
              <h3>I Need Help</h3>
              <p>Talk to our AI buddy or connect with peers.</p>
              <div className="card-hover-effect"></div>
            </div>

            <div 
              className={`role-card ${activeHover === 'volunteer' ? 'active' : ''}`}
              onClick={() => handleSelect("volunteer")}
              onMouseEnter={() => setActiveHover('volunteer')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="card-icon">🤝</div>
              <div className="ripple-effect"></div>
              <h3>Join as Volunteer</h3>
              <p>Support others and spread positivity.</p>
              <div className="card-hover-effect"></div>
            </div>

            <div 
              className={`role-card ${activeHover === 'admin' ? 'active' : ''}`}
              onClick={() => handleSelect("admin")}
              onMouseEnter={() => setActiveHover('admin')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="card-icon">📊</div>
              <div className="ripple-effect"></div>
              <h3>Admin</h3>
              <p>View anonymized dashboards and insights.</p>
              <div className="card-hover-effect"></div>
            </div>

            <div 
              className={`role-card ${activeHover === 'guest' ? 'active' : ''}`}
              onClick={() => handleSelect("guest")}
              onMouseEnter={() => setActiveHover('guest')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="card-icon">👀</div>
              <div className="ripple-effect"></div>
              <h3>Guest Mode</h3>
              <p>Browse anonymously before committing.</p>
              <div className="card-hover-effect"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;