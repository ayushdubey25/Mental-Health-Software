import "../Styling/Welcome.css";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login"); 
  };

  return (
    <div className="welcome-container">
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="overlay">
        <h1>Mental Health Matters 💙</h1>
        <p>Your safe space for emotional wellness</p>
        <button className="btn" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}

export default Welcome;
