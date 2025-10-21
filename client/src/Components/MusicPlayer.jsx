import { useState } from "react";
import "../Styling/MusicPlayer.css";

export default function MusicPlayer() {
  const [mood, setMood] = useState("relax"); // default

  const musicTracks = {
    relax: ["relax1.mp3", "relax2.mp3"],
    happy: ["happy1.mp3", "happy2.mp3"],
    stress: ["stress1.mp3"],
    sad: ["sad1.mp3"],
  };

  const [currentTrack, setCurrentTrack] = useState(musicTracks[mood][0]);

  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    setCurrentTrack(musicTracks[selectedMood][0]);
  };

  return (
    <div className="music-player">
      <h2>🎵 Soothing Music</h2>
      <p>Select mood for music:</p>
      <div className="mood-buttons">
        {Object.keys(musicTracks).map((m) => (
          <button
            key={m}
            onClick={() => handleMoodChange(m)}
            className={m === mood ? "active" : ""}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <audio controls autoPlay>
        <source src={`/music/${currentTrack}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
