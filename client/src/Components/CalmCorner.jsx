import { useState, useEffect } from "react";

function CalmCorner() {
  const [activeTab, setActiveTab] = useState("music");
  const [selectedMusic, setSelectedMusic] = useState("stress");
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [selectedBreathing, setSelectedBreathing] = useState("box");

  const musicTracks = {
    stress: {
      label: "Music to Release Stress",
      tracks: [
        { title: "Stress Relief 1", src: "/music/stress1.mp3" },
        { title: "Stress Relief 2", src: "/music/stress2.mp3" },
      ],
    },
    anxiety: { 
      label: "Music to Release Anxiety", 
      tracks: [
        { title: "Anxiety Relief 1", src: "/music/anxiety1.mp3" },
        { title: "Anxiety Relief 2", src: "/music/anxiety2.mp3" },
      ] 
    },
    sleep: { 
      label: "Music to Fall Asleep", 
      tracks: [
        { title: "Sleep Music 1", src: "/music/sleep1.mp3" },
        { title: "Sleep Music 2", src: "/music/sleep2.mp3" },
    ] 
  },
  };

  const breathingExercises = {
    box: { label: "Box Breathing", steps: ["Inhale 4s", "Hold 4s", "Exhale 4s", "Hold 4s", "Repeat 4x"] },
    diaphragmatic: { label: "Diaphragmatic Breathing", steps: ["Sit/lie comfortably", "Place hands", "Inhale 4s", "Exhale 6s", "Repeat 5–10 min"] },
    alternate: { label: "Alternate Nostril Breathing", steps: ["Close right nostril", "Inhale left 4s", "Exhale right 4s", "Inhale right", "Exhale left", "Repeat 5–10 cycles"] },
    "4_7_8": { label: "4-7-8 Breathing", steps: ["Inhale 4s", "Hold 7s", "Exhale 8s", "Repeat 4–5x"] },
    progressive: { label: "Progressive Relaxation Breathing", steps: ["Inhale and tense muscles", "Hold 5s", "Exhale and release", "Move through body", "Repeat"] },
  };

  const affirmations = [
    "I am worthy of love and happiness.",
    "I am strong, resilient, and capable.",
    "I release all tension and embrace calm.",
    "I am grateful for the blessings in my life.",
    "I am in control of my thoughts and emotions.",
    "Every day, I grow healthier and happier.",
    "I forgive myself and others for the past.",
    "I attract positivity and good energy.",
    "I trust the journey of my life.",
    "I am at peace with myself and the world.",
  ];

  // Reset track index when changing music
  useEffect(() => setSelectedTrackIndex(0), [selectedMusic]);

  // Internal CSS Styles
  const styles = {
    container: {
      minHeight: '100vh',
      minWidth:'100vw',
      padding: '30px',
      background: 'linear-gradient(135deg, #e8f0fe 0%, #c5e3f6 30%, #a8d8f0 70%, #8edbf9 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Poppins", sans-serif'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '40px',
      borderRadius: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      width: '100%',
      maxWidth: '900px',
      zIndex: 2,
      position: 'relative'
    },
    heading: {
      textAlign: 'center',
      color: '#1e3c72',
      fontSize: '2.5rem',
      marginBottom: '30px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #1e3c72 0%, #4cafef 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      position: 'relative',
      paddingBottom: '15px'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '40px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '12px',
      borderRadius: '50px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    tabButton: {
      padding: '14px 28px',
      border: 'none',
      borderRadius: '50px',
      background: 'transparent',
      color: '#1e3c72',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    activeTab: {
      background: 'linear-gradient(135deg, #64e3e3 0%, #4cafef 100%)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(76, 175, 239, 0.4)',
      transform: 'scale(1.05)'
    },
    tabContent: {
      minHeight: '400px'
    },
    tabPanel: {
      animation: 'fadeIn 0.5s ease-out'
    },
    tabDescription: {
      textAlign: 'center',
      color: '#1e3c72',
      fontSize: '1.2rem',
      marginBottom: '30px',
      opacity: '0.9'
    },
    musicButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'center',
      marginBottom: '25px'
    },
    musicButton: {
      padding: '15px 25px',
      border: 'none',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#1e3c72',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    activeMusic: {
      background: 'linear-gradient(135deg, #64e3e3 0%, #4cafef 100%)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(76, 175, 239, 0.4)'
    },
    audioContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '25px'
    },
    audioPlayer: {
      width: '100%',
      maxWidth: '400px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    breathingButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    },
    breathingButton: {
      padding: '18px',
      border: 'none',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#1e3c72',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center',
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    activeBreathing: {
      background: 'linear-gradient(135deg, #87c5a4 0%, #66bb6a 100%)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(135, 197, 164, 0.4)'
    },
    stepsList: {
      listStyle: 'none',
      padding: '0',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    stepItem: {
      padding: '12px 15px',
      marginBottom: '10px',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      color: '#1e3c72',
      position: 'relative',
      paddingLeft: '45px',
      transition: 'all 0.3s ease'
    },
    affirmationCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '25px'
    },
    affirmationCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      padding: '25px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      position: 'relative',
      overflow: 'hidden'
    },
    affirmationIcon: {
      fontSize: '2.5rem',
      display: 'block',
      marginBottom: '15px'
    },
    affirmationText: {
      color: '#1e3c72',
      fontWeight: '500',
      lineHeight: '1.6',
      margin: '0',
      fontStyle: 'italic',
      fontSize: '1.1rem'
    },
    bubble: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      animation: 'float 6s ease-in-out infinite'
    },
    bubble1: {
      width: '80px',
      height: '80px',
      top: '20%',
      left: '10%',
      animationDelay: '0s'
    },
    bubble2: {
      width: '60px',
      height: '60px',
      top: '60%',
      right: '15%',
      animationDelay: '2s'
    },
    bubble3: {
      width: '40px',
      height: '40px',
      bottom: '20%',
      left: '20%',
      animationDelay: '4s'
    }
  };

  // Helper function to merge styles
  const mergeStyles = (baseStyle, additionalStyle) => ({
    ...baseStyle,
    ...additionalStyle
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🌿 Calm Corner</h2>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={mergeStyles(styles.tabButton, activeTab === "music" && styles.activeTab)}
            onClick={() => setActiveTab("music")}
          >
            🎵 Soothing Music
          </button>
          <button 
            style={mergeStyles(styles.tabButton, activeTab === "breathing" && styles.activeTab)}
            onClick={() => setActiveTab("breathing")}
          >
            🫁 Breathing Exercises
          </button>
          <button 
            style={mergeStyles(styles.tabButton, activeTab === "affirmations" && styles.activeTab)}
            onClick={() => setActiveTab("affirmations")}
          >
            💬 Affirmations
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* MUSIC */}
          {activeTab === "music" && (
            <div style={styles.tabPanel}>
              <p style={styles.tabDescription}>🎶 Relax and choose the music that suits your mood:</p>
              <div style={styles.musicButtons}>
                {Object.keys(musicTracks).map((key) => (
                  <button
                    key={key}
                    style={mergeStyles(styles.musicButton, selectedMusic === key && styles.activeMusic)}
                    onClick={() => setSelectedMusic(key)}
                  >
                    {musicTracks[key].label}
                  </button>
                ))}
              </div>
              {musicTracks[selectedMusic].tracks.length > 1 && (
                <div style={styles.musicButtons}>
                  {musicTracks[selectedMusic].tracks.map((track, idx) => (
                    <button
                      key={idx}
                      style={mergeStyles(styles.musicButton, selectedTrackIndex === idx && styles.activeMusic)}
                      onClick={() => setSelectedTrackIndex(idx)}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>
              )}
              <div style={styles.audioContainer}>
                <audio 
                  controls 
                  key={musicTracks[selectedMusic].tracks[selectedTrackIndex].src}
                  style={styles.audioPlayer}
                >
                  <source src={musicTracks[selectedMusic].tracks[selectedTrackIndex].src} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}

          {/* BREATHING */}
          {activeTab === "breathing" && (
            <div style={styles.tabPanel}>
              <p style={styles.tabDescription}>🫁 Choose a breathing exercise to relax:</p>
              <div style={styles.breathingButtons}>
                {Object.keys(breathingExercises).map((key) => (
                  <button
                    key={key}
                    style={mergeStyles(styles.breathingButton, selectedBreathing === key && styles.activeBreathing)}
                    onClick={() => setSelectedBreathing(key)}
                  >
                    {breathingExercises[key].label}
                  </button>
                ))}
              </div>
              <ul style={styles.stepsList}>
                {breathingExercises[selectedBreathing].steps.map((step, idx) => (
                  <li key={idx} style={styles.stepItem}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AFFIRMATIONS */}
          {activeTab === "affirmations" && (
            <div style={styles.tabPanel}>
              <p style={styles.tabDescription}>💬 Repeat these affirmations daily to uplift your mood:</p>
              <div style={styles.affirmationCards}>
                {affirmations.map((text, idx) => (
                  <div key={idx} style={styles.affirmationCard}>
                    <span style={styles.affirmationIcon}>🍁</span>
                    <p style={styles.affirmationText}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating bubbles */}
      <div style={mergeStyles(styles.bubble, styles.bubble1)}></div>
      <div style={mergeStyles(styles.bubble, styles.bubble2)}></div>
      <div style={mergeStyles(styles.bubble, styles.bubble3)}></div>

      {/* Internal CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .calm-corner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        button:hover {
          transform: translateY(-3px);
        }
        
        .affirmation-card:hover {
          transform: translateY(-5px) rotate(1deg);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        li:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}

export default CalmCorner;