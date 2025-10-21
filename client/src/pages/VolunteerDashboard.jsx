import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";

function VolunteerDashboard() {
  // const navigate = useNavigate();
  // const location = useLocation();

  const [activeTab, setActiveTab] = useState("profile");
  const [resourceTab, setResourceTab] = useState("guides");
const [file, setFile] = useState(null);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [resources, setResources] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Add animation state
  const [isLoading, setIsLoading] = useState(true);

  
  const [clientChats, setClientChats] = useState([]);   // now fetched from backend
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
 
  
  // Profile image menu state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const [volunteer, setVolunteer] = useState({
  fullName: "",
  age: "",
  gender: "",
  email: "",
  mobile: "",
  location: "",
  availability: "",
  skills: "",
  bio: "",
  experience: "",
  profileImage: "",   // ✅ important
});



  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5600/api/volunteer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVolunteer(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch volunteer data");
      }
    };

    fetchVolunteer();
  }, []);

 
  
  // ✅ Fetch chats for this volunteer
  useEffect(() => {
  const fetchChats = async () => {
    if (!volunteer?.email) return;
    try {
      const res = await axios.get(
        `http://localhost:5600/api/chat/volunteer/${encodeURIComponent(volunteer.email)}`
      );

      const formatted = res.data.map((c) => ({
        id: c._id,
        name: c.userName || c.userEmail, // or fetch user's real name separately
        avatar: (c.userName?.[0] || c.userEmail[0] || "U").toUpperCase(),
        // 🔑 map message -> {text, sender, time}
        messages: (c.messages || []).map((m) => ({
          text: m.message,                                // <-- was m.text
          sender: m.senderEmail === volunteer.email ? "me" : "them",
          time: new Date(m.timestamp).toLocaleTimeString()
        })),
        userEmail: c.userEmail,
      }));

      setClientChats(formatted);
      setIsLoading(false); 
      console.log("Chats response:", res.data);
    } catch (err) {
      console.error("Failed to fetch chats", err);
      setIsLoading(false); 
    }
  };

  fetchChats();
}, [volunteer?.email]);

   

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateCallStatus = (index, newStatus) => {
    setCalls((prev) =>
      prev.map((c, i) => (i === index ? { ...c, status: newStatus } : c))
    );
  };

  const updateCallNotes = (index, newNotes) => {
    setCalls((prev) =>
      prev.map((c, i) => (i === index ? { ...c, notes: newNotes } : c))
    );
  };

  const acceptCall = (index) => {
    setCalls((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, status: "In Progress" } : c
      )
    );
  };

  const rejectCall = (index) => {
    setCalls((prev) => prev.filter((_, i) => i !== index));
  };

  // Resource States
 

  const [guides, setGuides] = useState([
    { title: "Volunteer Training Manual", description: "A guide to effective counseling.", link: "/manual.pdf", type: "pdf" },
  ]);

  const [articles, setArticles] = useState([
    { title: "WHO: Mental Health Basics", description: "World Health Organization article.", link: "https://www.who.int/mental_health", type: "link" },
  ]);

  const [videos, setVideos] = useState([
    { title: "Stress Management Techniques", description: "Training video on stress relief.", link: "/stress-management.mp4", type: "video" },
  ]);

  const [others, setOthers] = useState([]);

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const newRes = {
      title: uploadedFile.name,
      description: "Uploaded resource",
      link: URL.createObjectURL(uploadedFile),
      type: uploadedFile.type.includes("video")
        ? "video"
        : uploadedFile.type.includes("pdf")
        ? "pdf"
        : "other",
    };

    setOthers((prev) => [...prev, newRes]);
    setUploadedFile(null);
    alert("Resource uploaded successfully ✅");
  };

  // Message states
  const [messageTab, setMessageTab] = useState("clients");
 

  // // Mock chat data
  // const [clientChats, setClientChats] = useState([
  //   {
  //     id: 1,
  //     name: "Rahul Sharma",
  //     avatar: "RS",
  //     messages: [
  //       { sender: "client", text: "I've been feeling anxious lately.", time: "10:30 AM" },
  //       { sender: "me", text: "I understand, let's work on calming exercises.", time: "10:35 AM" },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Ananya Mehta",
  //     avatar: "AM",
  //     messages: [
  //       { sender: "client", text: "Can we reschedule our session?", time: "9:00 AM" },
  //     ],
  //   },
  // ]);

  const [volunteerChats, setVolunteerChats] = useState([
    {
      id: 1,
      name: "Ravi (Volunteer)",
      avatar: "RV",
      messages: [
        { sender: "volunteer", text: "Can you cover for me tomorrow?", time: "8:15 AM" },
        { sender: "me", text: "Sure, I'll take it up.", time: "8:20 AM" },
      ],
    },
  ]);

  // Send message handler
const handleSendMessage = async () => {
  if (!newMessage.trim() || !selectedChat) return;

  const msg = newMessage.trim();

  try {
    await axios.post("http://localhost:5600/api/chat/send", {
      userEmail: selectedChat.userEmail,
      volunteerEmail: volunteer.email,
      senderEmail: volunteer.email,
      message: msg,
    });

    // 👇 Make keys match what the chat window reads (text & time)
    setSelectedChat((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          senderEmail: volunteer.email,
          text: msg,                             // was "message"
          time: new Date().toLocaleTimeString(),  // was "timestamp"
        },
      ],
    }));

    setNewMessage("");
  } catch (err) {
    console.error("Failed to send message", err);
  }
};



  // Mock volunteer data
  // const [volunteer, setVolunteer] = useState({
  //   fullName: "Jane Doe",
  //   age: 30,
  //   gender: "Female",
  //   email: "janedoe@example.com",
  //   mobile: "9876543210",
  //   location: "Mumbai",
  //   availability: "10 hours/week",
  //   skills: "Psychology, Counseling",
  //   bio: "Passionate about mental health support",
  //   experience: "5 years of counseling experience",
  //   profileImage: "/default-avatar.png",
  // });

  // State for schedule
  const [sessions, setSessions] = useState([
    {
      client: "Rahul Sharma",
      date: "2025-09-20",
      time: "5:00 PM",
      mode: "Video",
      notes: "Follow-up on stress management",
    },
    {
      client: "Ananya Mehta",
      date: "2025-09-22",
      time: "3:30 PM",
      mode: "Call",
      notes: "Initial consultation",
    },
  ]);

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSession, setNewSession] = useState({
    client: "",
    date: "",
    time: "",
    mode: "Video",
    notes: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Save or update session
  const handleSaveSession = () => {
    if (editingIndex !== null) {
      const updated = [...sessions];
      updated[editingIndex] = newSession;
      setSessions(updated);
      setEditingIndex(null);
    } else {
      setSessions([...sessions, newSession]);
    }
    setNewSession({ client: "", date: "", time: "", mode: "Video", notes: "" });
    setShowSessionModal(false);
  };

  // Edit session
  const handleEditSession = (index) => {
    setEditingIndex(index);
    setNewSession(sessions[index]);
    setShowSessionModal(true);
  };

  // Delete session
  const handleDeleteSession = (index) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  // Mock assigned cases
  const [assignedCases, setAssignedCases] = useState([
    {
      id: 1,
      patientName: "John Smith",
      age: 28,
      gender: "Male",
      contact: "9876543210",
      status: "Active",
      reports: ["report1.pdf", "report2.pdf"],
      progress: "Initial counseling done",
    },
    {
      id: 2,
      patientName: "Anita Kapoor",
      age: 35,
      gender: "Female",
      contact: "9123456780",
      status: "Pending",
      reports: [],
      progress: "Waiting for initial session",
    },
  ]);

  const [selectedCase, setSelectedCase] = useState(null);

  
// track input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setVolunteer(prev => ({ ...prev, [name]: value }));
};

// save to backend
const handleSaveProfile = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5600/api/volunteer/${volunteer._id}`,
      volunteer
    );
    setVolunteer(res.data);     // update state with saved values
    setIsEditing(false);        // exit edit mode
  } catch (err) {
    console.error("Profile update failed", err);
    alert("Failed to save changes");
  }
};

  // Profile image functions
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVolunteer({ ...volunteer, profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
      setShowProfileMenu(false);
    }
  };

  const handleDeleteProfileImage = () => {
    setVolunteer({ ...volunteer, profileImage: "/default-avatar.png" });
    setShowProfileMenu(false);
  };

  const handleViewProfileImage = () => {
    // Open image in new tab
    window.open(volunteer.profileImage, '_blank');
    setShowProfileMenu(false);
  };

  // CSS styles based on the login page design
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      minWidth: "100vw",
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "url('/login-bg.jpg') no-repeat center center / cover",
      padding: 0,
      margin: 0,
      overflowX: "hidden",
    },
    loadingScreen: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "url('/login-bg.jpg') no-repeat center center / cover",
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      transition: "opacity 0.5s ease-out",
    },
    loader: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      border: "5px solid rgba(255, 255, 255, 0.2)",
      borderTop: "5px solid #fff",
      animation: "spin 1s linear infinite",
    },
    nav: {
      display: "flex",
      justifyContent: "flex-start",
      background: "linear-gradient(135deg, #4380dbff 0%, #97c6f4ff 100%)",
      backdropFilter: "blur(10px)",
      padding: 0,
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    },
    navButton: {
      background: "transparent",
      border: "none",
      color: "white",
      fontWeight: 500,
      padding: "18px 24px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      fontSize: "16px",
      overflow: "hidden",
    },
    navButtonHover: {
      background: "rgba(255, 255, 255, 0.15)",
    },
    navButtonActive: {
      background: "rgba(255, 255, 255, 0.2)",
    },
    navButtonBefore: {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      width: "0%",
      height: "3px",
      background: "white",
      transition: "all 0.3s ease",
      transform: "translateX(-50%)",
    },
    navButtonHoverBefore: {
      width: "70%",
    },
    content: {
      padding: "30px",
      maxWidth: "1400px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    },
    card: {
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      marginBottom: "30px",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      animation: "fadeIn 0.5s ease-out",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "25px",
      paddingBottom: "15px",
      borderBottom: "2px solid rgba(0, 0, 0, 0.05)",
    },
    cardIcon: {
      fontSize: "28px",
      marginRight: "15px",
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    cardTitle: {
      margin: 0,
      color: "#2d3748",
      fontSize: "24px",
      fontWeight: 600,
    },
    profileDetails: {
      display: "grid",
      gridTemplateColumns: "150px 1fr",
      gap: "30px",
      alignItems: "start",
    },
    profileImgContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    profileImg: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #fff",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    profileImgHover: {
      transform: "scale(1.05)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    },
    profileMenuButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      background: "rgba(255, 255, 255, 0.9)",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
    },
    profileMenuButtonHover: {
      background: "rgba(255, 255, 255, 1)",
      transform: "scale(1.1)",
    },
    profileMenu: {
      position: "absolute",
      top: "40px",
      right: "0",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
      minWidth: "150px",
      overflow: "hidden",
    },
    profileMenuItem: {
      padding: "10px 15px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    profileMenuItemHover: {
      background: "rgba(102, 126, 234, 0.1)",
    },
    profileInfo: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    infoGroup: {
      marginBottom: "20px",
    },
    infoLabel: {
      display: "block",
      fontWeight: 600,
      color: "#4a5568",
      fontSize: "14px",
      marginBottom: "6px",
    },
    infoText: {
      margin: 0,
      color: "#2d3748",
      fontSize: "16px",
      wordBreak: "break-word",
      padding: "8px 0",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      margin: "5px 0",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "16px",
      transition: "all 3s ease",
      boxSizing: "border-box",
      background: "rgba(255, 255, 255, 0.7)",
      color: "#2d3748",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.15)",
      background: "#fff",
    },
    button: {
      marginTop: "20px",
      padding: "14px 28px",
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      color: "white",
      fontWeight: 500,
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
    },
    casesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "25px",
      marginTop: "25px",
    },
    caseCard: {
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    caseCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)",
    },
    statusBadge: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
    },
    statusActive: {
      background: "rgba(72, 187, 120, 0.2)",
      color: "#4299e1",
    },
    statusPending: {
      background: "rgba(246, 173, 85, 0.2)",
      color: "#ed8936",
    },
    caseDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "15px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.3s ease-out",
    },
    modal: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      animation: "slideUp 0.4s ease-out",
    },
    messageTabs: {
      display: "flex",
      gap: "10px",
      marginBottom: "25px",
      background: "rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      padding: "5px",
    },
    messageTabButton: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      background: "transparent",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: 500,
    },
    messageTabButtonActive: {
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      color: "white",
      boxShadow: "0 4px 10px rgba(102, 126, 234, 0.3)",
    },
    chatContainer: {
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gap: "25px",
      height: "500px",
    },
    chatSidebar: {
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      display: "flex",
      flexDirection: "column",
    },
    chatSidebarHeader: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.9)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    },
    chatList: {
      overflowY: "auto",
      flex: 1,
    },
    chatListItem: {
      padding: "18px 20px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
    },
    chatListItemSelected: {
      background: "rgba(102, 126, 234, 0.1)",
    },
    avatar: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      marginRight: "15px",
      flexShrink: 0,
    },
    chatInfo: {
      flex: 1,
      minWidth: 0,
    },
    chatName: {
      margin: "0 0 5px 0",
      fontSize: "16px",
      fontWeight: 600,
      color: "#2d3748",
    },
    lastMsg: {
      margin: 0,
      fontSize: "14px",
      color: "#718096",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    chatWindow: {
      display: "flex",
      flexDirection: "column",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
    },
    chatHeader: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.9)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
    },
    chatMessages: {
      flex: 1,
      padding: "20px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    },
    chatMessage: {
      marginBottom: "15px",
      padding: "12px 16px",
      borderRadius: "18px",
      maxWidth: "70%",
      position: "relative",
      animation: "fadeIn 0.3s ease-out",
    },
    chatMessageSent: {
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      color: "white",
      marginLeft: "auto",
      borderBottomRightRadius: "5px",
    },
    chatMessageReceived: {
      background: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      marginRight: "auto",
      borderBottomLeftRadius: "5px",
    },
    messageTime: {
      fontSize: "11px",
      opacity: 0.7,
      marginTop: "5px",
      textAlign: "right",
    },
    chatInput: {
      display: "flex",
      padding: "15px 20px",
      borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      background: "rgba(255, 255, 255, 0.9)",
    },
    chatInputField: {
      flex: 1,
      padding: "12px 15px",
      border: "1px solid #cbd5e1",
      borderRadius: "20px",
      marginRight: "10px",
      fontSize: "15px",
      transition: "all 0.3s ease",
    },
    chatInputFieldFocus: {
      outline: "none",
      borderColor: "#667eea",
      boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
    },
    resourceTabs: {
      display: "flex",
      gap: "10px",
      marginBottom: "25px",
      background: "rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      padding: "5px",
    },
    resourceTabButton: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      background: "transparent",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: 500,
    },
    resourceTabButtonActive: {
      background: "linear-gradient(135deg, #1a66d9ff 0%, #88c1fbff 100%)",
      color: "white",
      boxShadow: "0 4px 10px rgba(102, 126, 234, 0.3)",
    },
    uploadSection: {
      display: "flex",
      gap: "15px",
      marginBottom: "25px",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.5)",
      padding: "15px 20px",
      borderRadius: "12px",
    },
    resourceList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    resourceItem: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
    },
    resourceItemHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    },
    sessionCard: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px",
      transition: "all 0.3s ease",
    },
    sessionCardHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    },
    sessionModal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
      zIndex: 1000,
      width: "90%",
      maxWidth: "500px",
      animation: "slideUp 0.4s ease-out",
    },
    callItem: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px",
      transition: "all 0.3s ease",
    },
    callItemHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    },
    callActions: {
      display: "flex",
      gap: "10px",
      marginTop: "15px",
    },
    // Animation keyframes
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translate(-50%, -40%); opacity: 0; }
        to { transform: translate(-50%, -50%); opacity: 1; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `,
  };

  // Add CSS keyframes to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = styles.keyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Loading Screen */}
      {isLoading && (
        <div style={styles.loadingScreen}>
          <div style={styles.loader}></div>
        </div>
      )}

      {/* Top Navigation */}
      <nav style={styles.nav}>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === "profile" ? styles.navButtonActive : {})
          }} 
          onMouseOver={(e) => Object.assign(e.target.style, styles.navButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: 'transparent'})}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === "tasks" ? styles.navButtonActive : {})
          }}
          onMouseOver={(e) => Object.assign(e.target.style, styles.navButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: 'transparent'})}
          onClick={() => setActiveTab("tasks")}
        >
          Assigned Cases
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === "schedule" ? styles.navButtonActive : {})
          }}
          onMouseOver={(e) => Object.assign(e.target.style, styles.navButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: 'transparent'})}
          onClick={() => setActiveTab("schedule")}
        >
          Schedule
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === "messages" ? styles.navButtonActive : {})
          }}
          onMouseOver={(e) => Object.assign(e.target.style, styles.navButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: 'transparent'})}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === "resources" ? styles.navButtonActive : {})
          }}
          onMouseOver={(e) => Object.assign(e.target.style, styles.navButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: 'transparent'})}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
      </nav>

      <div style={styles.content}>
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div style={styles.card} onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.cardHover)} onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'})}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>👤</div>
              <h2 style={styles.cardTitle}>Profile</h2>
            </div>
            <div style={styles.profileDetails}>
              <div style={styles.profileImgContainer}>
                <img 
                  src={volunteer.profileImage} 
                  alt="Profile" 
                  style={styles.profileImg}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.profileImgHover)}
                  onMouseOut={(e) => Object.assign(e.target.style, {transform: 'none', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'})}
                />
                <button 
                  style={styles.profileMenuButton}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.profileMenuButtonHover)}
                  onMouseOut={(e) => Object.assign(e.target.style, {background: 'rgba(255, 255, 255, 0.9)', transform: 'none'})}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  ⋮
                </button>
                {showProfileMenu && (
                  <div style={styles.profileMenu} ref={menuRef}>
                    <div 
                      style={styles.profileMenuItem}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.profileMenuItemHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, {background: 'transparent'})}
                      onClick={handleViewProfileImage}
                    >
                      👁️ View Image
                    </div>
                    <label 
                      style={styles.profileMenuItem}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.profileMenuItemHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, {background: 'transparent'})}
                    >
                      📁 Change Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageChange}
                      />
                    </label>
                    <div 
                      style={styles.profileMenuItem}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.profileMenuItemHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, {background: 'transparent'})}
                      onClick={handleDeleteProfileImage}
                    >
                      🗑️ Remove Image
                    </div>
                  </div>
                )}
              </div>
              <div style={styles.profileInfo}>
                {isEditing ? (
                  <>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Name</span>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={volunteer.fullName} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Age</span>
                      <input 
                        type="number" 
                        name="age" 
                        value={volunteer.age} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Gender</span>
                      <input 
                        type="text" 
                        name="gender" 
                        value={volunteer.gender} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Email</span>
                      <input 
                        type="email" 
                        name="email" 
                        value={volunteer.email} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Mobile</span>
                      <input 
                        type="text" 
                        name="mobile" 
                        value={volunteer.mobile} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Location</span>
                      <input 
                        type="text" 
                        name="location" 
                        value={volunteer.location} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Availability</span>
                      <input 
                        type="text" 
                        name="availability" 
                        value={volunteer.availability} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Skills</span>
                      <input 
                        type="text" 
                        name="skills" 
                        value={volunteer.skills} 
                        onChange={handleInputChange} 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      />
                    </div>
                    <div style={{...styles.infoGroup, gridColumn: '1 / -1'}}>
                      <span style={styles.infoLabel}>Bio</span>
                      <textarea 
                        name="bio" 
                        value={volunteer.bio} 
                        onChange={handleInputChange} 
                        style={{...styles.input, minHeight: '100px'}}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      ></textarea>
                    </div>
                    <div style={{...styles.infoGroup, gridColumn: '1 / -1'}}>
                      <span style={styles.infoLabel}>Experience</span>
                      <textarea 
                        name="experience" 
                        value={volunteer.experience} 
                        onChange={handleInputChange} 
                        style={{...styles.input, minHeight: '100px'}}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none', background: 'rgba(255, 255, 255, 0.7)'})}
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Name</span>
                      <p style={styles.infoText}>{volunteer.fullName}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Age</span>
                      <p style={styles.infoText}>{volunteer.age}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Gender</span>
                      <p style={styles.infoText}>{volunteer.gender}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Email</span>
                      <p style={styles.infoText}>{volunteer.email}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Mobile</span>
                      <p style={styles.infoText}>{volunteer.mobile}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Location</span>
                      <p style={styles.infoText}>{volunteer.location}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Availability</span>
                      <p style={styles.infoText}>{volunteer.availability}</p>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Skills</span>
                      <p style={styles.infoText}>{volunteer.skills}</p>
                    </div>
                    <div style={{...styles.infoGroup, gridColumn: '1 / -1'}}>
                      <span style={styles.infoLabel}>Bio</span>
                      <p style={styles.infoText}>{volunteer.bio}</p>
                    </div>
                    <div style={{...styles.infoGroup, gridColumn: '1 / -1'}}>
                      <span style={styles.infoLabel}>Experience</span>
                      <p style={styles.infoText}>{volunteer.experience}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <button 
                style={styles.button}
                onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, {transform: 'none', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'})}
                onClick={handleSaveProfile}
              >
                💾 Save
              </button>
            ) : (
              <button 
                style={styles.button}
                onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, {transform: 'none', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'})}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        )}

        {/* Assigned Cases Tab */}
        {activeTab === "tasks" && (
          <div style={styles.card} onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.cardHover)} onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'})}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>🗂️</div>
              <h2 style={styles.cardTitle}>Assigned Cases</h2>
            </div>
            <div style={styles.casesGrid}>
              {assignedCases.map((c) => (
                <div 
                  key={c.id} 
                  style={styles.caseCard}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.caseCardHover)}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'})}
                >
                  <div style={{...styles.statusBadge, ...(c.status === 'Active' ? styles.statusActive : styles.statusPending)}}>
                    {c.status}
                  </div>
                  <h3 style={{margin: '0 0 15px 0', color: '#2d3748'}}>{c.patientName}</h3>
                  <div style={styles.caseDetails}>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Age</span>
                      <span>{c.age}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Gender</span>
                      <span>{c.gender}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Contact</span>
                      <span>{c.contact}</span>
                    </div>
                  </div>
                  <button 
                    style={{...styles.button, padding: '10px 20px', width: '100%', marginTop: '15px'}}
                    onClick={() => setSelectedCase(c)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {selectedCase && (
              <div style={styles.modalOverlay} onClick={() => setSelectedCase(null)}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{margin: '0 0 20px 0', color: '#2d3748'}}>Patient Details</h3>
                  <div style={styles.caseDetails}>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Name</span>
                      <span>{selectedCase.patientName}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Age</span>
                      <span>{selectedCase.age}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Gender</span>
                      <span>{selectedCase.gender}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Contact</span>
                      <span>{selectedCase.contact}</span>
                    </div>
                    <div style={styles.infoGroup}>
                      <span style={styles.infoLabel}>Status</span>
                      <span>{selectedCase.status}</span>
                    </div>
                  </div>
                  <div style={styles.infoGroup}>
                    <span style={styles.infoLabel}>Progress</span>
                    <p style={styles.infoText}>{selectedCase.progress}</p>
                  </div>
                  <div style={styles.infoGroup}>
                    <span style={styles.infoLabel}>Reports</span>
                    <ul style={{paddingLeft: '20px', margin: '10px 0 0 0'}}>
                      {selectedCase.reports.length > 0 ? (
                        selectedCase.reports.map((r, index) => (
                          <li key={index} style={{marginBottom: '8px'}}>
                            <a href={`/${r}`} target="_blank" rel="noopener noreferrer" style={{color: '#68adfcff', textDecoration: 'none'}}>
                              📄 {r}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>No reports uploaded</li>
                      )}
                    </ul>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '25px'}}>
                    <button 
                      style={{...styles.button, backgroundColor: '#ef4444', padding: '10px 20px'}}
                      onMouseOver={(e) => Object.assign(e.target.style, {backgroundColor: '#dc2626', transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'})}
                      onMouseOut={(e) => Object.assign(e.target.style, {transform: 'none', boxShadow: 'none', backgroundColor: '#ef4444'})}
                      onClick={() => setSelectedCase(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
                </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>💬</div>
              <h2 style={styles.cardTitle}>Messages</h2>
            </div>

            {/* Sub-Tabs */}
            <div style={styles.messageTabs}>
              <button
                style={{
                  ...styles.messageTabButton,
                  ...(messageTab === "clients" ? styles.messageTabButtonActive : {})
                }}
                onClick={() => setMessageTab("clients")}
              >
                Clients
              </button>
              <button
                style={{
                  ...styles.messageTabButton,
                  ...(messageTab === "volunteers" ? styles.messageTabButtonActive : {})
                }}
                onClick={() => setMessageTab("volunteers")}
              >
                Peer Volunteers
              </button>
            </div>

            {/* Chat Layout */}
            <div style={styles.chatContainer}>
              {/* Sidebar */}
              <div style={styles.chatSidebar}>
                <div style={styles.chatSidebarHeader}>
                  <h3 style={{margin: 0, fontSize: '18px'}}>
                    {messageTab === "clients" ? "Clients" : "Volunteers"}
                  </h3>
                </div>
                <div style={styles.chatList}>
                  {(messageTab === "clients" ? clientChats : volunteerChats).map((chat) => (
                    <div
                      key={chat.id}
                      style={{
                        ...styles.chatListItem,
                        ...(selectedChat?.id === chat.id ? styles.chatListItemSelected : {})
                      }}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div style={styles.avatar}>{chat.avatar}</div>
                      <div style={styles.chatInfo}>
                        <h4 style={styles.chatName}>{chat.name}</h4>
                        <p style={styles.lastMsg}>
  {chat.messages[chat.messages.length - 1]?.text}
</p>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div style={styles.chatWindow}>
                {selectedChat ? (
                  <>
                    <div style={styles.chatHeader}>
                      <div style={styles.avatar}>{selectedChat.avatar}</div>
                      <div>
                        <h3 style={{margin: 0, fontSize: '18px'}}>{selectedChat.name}</h3>
                        <p style={{margin: 0, fontSize: '14px', color: '#718096'}}>Online</p>
                      </div>
                    </div>
                    <div style={styles.chatMessages}>
                      {selectedChat.messages.map((msg, index) => (
    <div
      key={index}
      style={{
        ...styles.chatMessage,
        ...(msg.senderEmail === volunteer.email
          ? styles.chatMessageSent
          : styles.chatMessageReceived),
      }}>
                          <p style={{margin: "0 0 5px 0"}}>{msg.text}</p>
                          <span style={styles.messageTime}>{msg.time}</span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.chatInput}>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={styles.chatInputField}
                        onFocus={(e) => Object.assign(e.target.style, styles.chatInputFieldFocus)}
                        onBlur={(e) => Object.assign(e.target.style, {borderColor: '#cbd5e1', boxShadow: 'none'})}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        style={{...styles.button, padding: '10px 20px'}}
                        onClick={handleSendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <p style={{textAlign: "center", color: "#718096", padding: "20px"}}>
                      Select a conversation to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>📅</div>
              <h2 style={styles.cardTitle}>My Schedule</h2>
            </div>

            {/* Weekly Availability */}
            <div style={styles.infoGroup}>
              <h3 style={{margin: '0 0 15px 0', color: '#2d3748'}}>Weekly Availability</h3>
              <ul style={{paddingLeft: "20px", margin: 0}}>
                <li style={{marginBottom: '8px', color:'#2d3748'}}><strong>Mon:</strong> 5:00 PM – 7:00 PM</li>
                <li style={{marginBottom: '8px', color:'#2d3748'}}><strong>Wed:</strong> 3:00 PM – 6:00 PM</li>
                <li style={{marginBottom: '8px', color:'#2d3748'}}><strong>Sat:</strong> 11:00 AM – 2:00 PM</li>
              </ul>
            </div>

            {/* Upcoming Sessions */}
            <div style={styles.infoGroup}>
              <h3 style={{margin: '0 0 15px 0', color: '#2d3748'}}>Upcoming Counseling Sessions</h3>
              {sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <div 
                    key={index} 
                    style={styles.sessionCard}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.sessionCardHover)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'})}
                  >
                    <p style={{margin: '0 0 8px 0', color:'#2d3748'}}><strong>Client:</strong> {session.client}</p>
                    <p style={{margin: '0 0 8px 0', color:'#2d3748'}}><strong>Date:</strong> {session.date}</p>
                    <p style={{margin: '0 0 8px 0', color:'#2d3748'}}><strong>Time:</strong> {session.time}</p>
                    <p style={{margin: '0 0 8px 0',color:'#2d3748'}}><strong>Mode:</strong> {session.mode}</p>
                    <p style={{margin: '0 0 15px 0',color:'#2d3748'}}><strong>Notes:</strong> {session.notes}</p>
                    <div style={{display: "flex", gap: "10px"}}>
                      <button 
                        style={{...styles.button, padding: "8px 16px"}}
                        onClick={() => handleEditSession(index)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        style={{...styles.button, padding: "8px 16px", backgroundColor: "#ef4444"}}
                        onClick={() => handleDeleteSession(index)}
                      >
                        🗑️ Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No upcoming sessions scheduled.</p>
              )}
            </div>

            {/* Add New Session */}
            <button 
              style={styles.button}
              onClick={() => setShowSessionModal(true)}
            >
              ➕ Add New Session
            </button>

            {/* Modal for Adding Session */}
            {showSessionModal && (
              <div style={styles.modalOverlay} onClick={() => setShowSessionModal(false)}>
                <div style={styles.sessionModal} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{margin: '0 0 20px 0'}}>{editingIndex !== null ? "Edit Session" : "Add New Session"}</h3>
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={newSession.client}
                    onChange={(e) => setNewSession({ ...newSession, client: e.target.value })}
                    style={{...styles.input, marginBottom: "15px"}}
                  />
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    style={{...styles.input, marginBottom: "15px"}}
                  />
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    style={{...styles.input, marginBottom: "15px"}}
                  />
                  <select
                    value={newSession.mode}
                    onChange={(e) => setNewSession({ ...newSession, mode: e.target.value })}
                    style={{...styles.input, marginBottom: "15px"}}
                  >
                    <option value="Video">Video</option>
                    <option value="Call">Call</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                  <textarea
                    placeholder="Notes"
                    value={newSession.notes}
                    onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                    style={{...styles.input, marginBottom: "20px", minHeight: "80px"}}
                  ></textarea>

                  <div style={{display: "flex", gap: "10px"}}>
                    <button 
                      style={styles.button}
                      onClick={handleSaveSession}
                    >
                      💾 Save
                    </button>
                    <button 
                      style={{...styles.button, backgroundColor: "#64748b"}}
                      onClick={() => setShowSessionModal(false)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

    {activeTab === "resources" && (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <div style={styles.cardIcon}>📚</div>
      <h2 style={styles.cardTitle}>Resources</h2>
    </div>

    {/* Categories */}
    <div style={styles.resourceTabs}>
      {["guides", "articles", "videos", "others"].map((tab) => (
        <button
          key={tab}
          style={{
            ...styles.resourceTabButton,
            ...(resourceTab === tab ? styles.resourceTabButtonActive : {}),
          }}
          onClick={() => setResourceTab(tab)}
        >
          {tab[0].toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    {/* Upload Section */}
    <div style={styles.uploadSection}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ flex: 1 }}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginLeft: "10px", flex: 2 }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginLeft: "10px", flex: 3 }}
      />
      <button
        style={{ ...styles.button, padding: "12px 20px", marginLeft: "10px" }}
        onClick={async () => {
          if (!file || !title.trim()) return alert("Select a file and add a title");

          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", title);
          formData.append("description", description);
          formData.append("category", resourceTab);
          formData.append("volunteerEmail", volunteer.email);

          try {
            const { data } = await axios.post(
              "http://localhost:5600/api/resources/upload",
              formData
            );
            setResources((prev) => [data, ...prev]);
            setFile(null);
            setTitle("");
            setDescription("");
            alert("Resource uploaded!");
          } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload resource");
          }
        }}
      >
        ⬆️ Upload Resource
      </button>
    </div>

    {/* Resource List */}
    <div style={styles.resourceList}>
      {resources
        .filter((res) => res.category === resourceTab)
        .map((res, index) => (
          <div
            key={index}
            style={styles.resourceItem}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.resourceItemHover)}
            onMouseOut={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: "none",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
              })
            }
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>{res.title}</h4>
            <p style={{ margin: "0 0 15px 0", color: "#718096" }}>{res.description}</p>
            {res.type === "pdf" && (
              <a
                href={res.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#4d90fdff", textDecoration: "none", fontWeight: 500 }}
              >
                📄 View PDF
              </a>
            )}
            {res.type === "link" && (
              <a
                href={res.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#43a5fbff", textDecoration: "none", fontWeight: 500 }}
              >
                🔗 Open Link
              </a>
            )}
            {res.type === "video" && (
              <video controls width="100%" style={{ marginTop: "10px", borderRadius: "10px" }}>
                <source src={res.link} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
    </div>
  </div>
)}
   {/* Calls Tab */}
        {activeTab === "calls" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>📞</div>
              <h2 style={styles.cardTitle}>Calls Assigned</h2>
            </div>

            {calls.length === 0 ? (
              <p>No calls assigned yet.</p>
            ) : (
              <div>
                {calls.map((call, index) => (
                  <div 
                    key={index} 
                    style={styles.callItem}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.callItemHover)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'})}
                  >
                    <h4 style={{margin: "0 0 10px 0", color: '#2d3748'}}>{call.callerName}</h4>
                    <p style={{margin: "5px 0"}}><strong>Issue:</strong> {call.issue}</p>
                    <p style={{margin: "5px 0"}}><strong>Time:</strong> {call.time}</p>
                    <p style={{margin: "5px 0 15px 0"}}><strong>Status:</strong> {call.status}</p>

                    {/* Update status */}
                    <select
                      value={call.status}
                      onChange={(e) => updateCallStatus(index, e.target.value)}
                      style={{...styles.input, margin: "0 0 15px 0"}}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* Notes */}
                    <textarea
                      placeholder="Add notes..."
                      value={call.notes}
                      onChange={(e) => updateCallNotes(index, e.target.value)}
                      style={{...styles.input, margin: "0 0 15px 0", minHeight: "80px"}}
                    />

                    <div style={styles.callActions}>
                      <button 
                        style={{...styles.button, padding: "10px 16px"}}
                        onClick={() => acceptCall(index)}
                      >
                        ✅ Accept
                      </button>
                      <button 
                        style={{...styles.button, padding: "10px 16px", backgroundColor: "#ef4444"}}
                        onClick={() => rejectCall(index)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerDashboard;