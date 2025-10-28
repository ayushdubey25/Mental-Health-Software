import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "../../Styling/VolunteerRegister.css";
import { API_URL } from "../../utils/api";


function VolunteerRegister() {
  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    language: "",
    email: "",
    mobile: "",
    location: "",
    availability: "",
    skills: [],
    bio: "",
    experience: [],
    password: "",
        emergencyAvailability: DAYS_OF_WEEK.map(day => ({ day, start: "", end: "" })),
    consent: false,
    remember: false
  });

  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  // Handle text/select/checkbox change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle multi-select skills (avoid duplicates)
  const handleSkillsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData({ ...formData, skills: [...new Set(selected)] });
  };

  // Handle multiple PDFs (avoid duplicates)
  const handleExperienceChange = (e) => {
    const files = Array.from(e.target.files);
    const existingFiles = formData.experience.map(f => f.name);
    const filteredFiles = files.filter(f => !existingFiles.includes(f.name));
    setFormData({ ...formData, experience: [...formData.experience, ...filteredFiles] });
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const removeFile = (fileName) => {
    setFormData({ ...formData, experience: formData.experience.filter(f => f.name !== fileName) });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isLogin) {
      // LOGIN — use JSON!
      const res = await fetch(`${API_URL}/volunteer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      alert("Volunteer logged in ✅");
      navigate("/volunteer-dash");
    } else {
      // REGISTER — use FormData (for file upload)
      const payload = new FormData();
      for (let key in formData) {
        if (key === "skills") {
          payload.append("skills", JSON.stringify(formData.skills));
        } else if (key === "experience") {
          formData.experience.forEach(file => payload.append("experience", file));
        } else if (key === "emergencyAvailability") {     // <--- ADD THIS BLOCK
          payload.append("emergencyAvailability", JSON.stringify(formData.emergencyAvailability || []));}
          else {
          payload.append(key, formData[key]);
        }
      }

      const res = await fetch(`${API_URL}/volunteer/register`, {
        method: "POST",
        body: payload
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Thanks for registering as a volunteer 🤝");
      setIsLogin(true);
    }
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="volunteer-container">
      <h2>{isLogin ? "Volunteer Login 🔑" : "Register as a Volunteer 🤝"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
            <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
            <select name="gender" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="preferNot">Prefer not to say</option>
            </select>
            <input type="text" name="language" placeholder="Languages Spoken" required onChange={handleChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" required onChange={handleChange} />
            <input type="text" name="location" placeholder="City/Region" onChange={handleChange} />
            <select name="availability" required onChange={handleChange}>
              <option value="">Availability (per week)</option>
              <option value="5">~5 hours</option>
              <option value="10">~10 hours</option>
              <option value="15">15+ hours</option>
            </select>

            {/* Multi-select skills */}
            <select name="skills" multiple required onChange={handleSkillsChange}>
              <option value="Counseling">Counseling</option>
              <option value="Psychotherapy">Psychotherapy</option>
              <option value="Stress Management">Stress Management</option>
              <option value="Cognitive Behavioral Therapy">Cognitive Behavioral Therapy</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="First Aid Mental Health">First Aid Mental Health</option>
              <option value="Peer Support">Peer Support</option>
            </select>

            {/* Preview skills */}
            <div className="skills-preview">
              {formData.skills.map(skill => (
                <span key={skill} onClick={() => removeSkill(skill)} className="skill-tag" style={{color:"GrayText"}}>{skill} ✕</span>
              ))}
            </div>

            <textarea name="bio" placeholder="Why do you want to volunteer?" onChange={handleChange}></textarea>

            {/* Multiple PDFs */}
            <input type="file" accept="application/pdf" multiple onChange={handleExperienceChange} />

            {/* Preview PDFs */}
            <ul className="pdf-preview">
              {formData.experience.map(file => (
                <li key={file.name}>
                  {file.name} <span onClick={() => removeFile(file.name)}>✕</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Common fields */}
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

        <label style={{color:"black"}}>Emergency On-Call Times (for instant contact, optional):</label>
<div>
  {formData.emergencyAvailability?.map((slot, idx) => (
    <div key={idx} style={{marginBottom:'6px'}}>
      <input type="text" placeholder="Day (e.g. Monday)" value={slot.day} onChange={e=>{
        const updated = [...formData.emergencyAvailability];
        updated[idx].day = e.target.value;
        setFormData({...formData, emergencyAvailability: updated});
      }} style={{width:'110px'}}/>
      <input type="time" value={slot.start} onChange={e=>{
        const updated = [...formData.emergencyAvailability];
        updated[idx].start = e.target.value;
        setFormData({...formData, emergencyAvailability: updated});
      }}/>
      <input type="time" value={slot.end} onChange={e=>{
        const updated = [...formData.emergencyAvailability];
        updated[idx].end = e.target.value;
        setFormData({...formData, emergencyAvailability: updated});
      }}/>
      <button type="button" onClick={()=>{
        setFormData({
          ...formData,
          emergencyAvailability: formData.emergencyAvailability.filter((_,i)=>i!==idx)
        })
      }} style={{marginLeft:'7px',color:'red'}}>✕</button>
    </div>
  ))}
  <button type="button" onClick={()=>
    setFormData({
      ...formData,
      emergencyAvailability: [ ...(formData.emergencyAvailability||[]), { day:"Monday", start:"09:00", end:"17:00" }]
    })
  }>+ Add Slot</button>
</div>


        <label className="remember">
          <input type="checkbox" name="remember" onChange={handleChange} /> Remember me
        </label>

        {!isLogin && (
          <label className="consent">
            <input type="checkbox" name="consent" required onChange={handleChange} />
            I agree to the volunteer guidelines and privacy policy
          </label>
        )}

        <button type="submit" className="btn">{isLogin ? "Login" : "Register"}</button>
        
      </form>
      <div className="toggle-section">
        {isLogin ? (
          <>
            <p onClick={() => setIsLogin(false)}>👉 New here? Register now</p>
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </>
        ) : (
          <p onClick={() => setIsLogin(true)}>👉 Already registered? Login here</p>
        )}
      </div>
    </div>
  );
}

export default VolunteerRegister;
