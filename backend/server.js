// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const helpAuth = require("./routes/helpAuth");
const volunteerAuth = require("./routes/volunteerAuth");
const geminiRoute = require("./routes/gemini");
const userRoute = require("./routes/users");
const contactRoute = require("./routes/contacts");
const adminAuthRoutes = require("./routes/adminAuth");
const groupRoute = require("./routes/groups");
const chatRoutes = require("./routes/chat");
const resourceRoutes = require("./routes/resourceRoutes");
const aiReport = require("./routes/aiReport");
const caseRoutes = require("./routes/cases");
dotenv.config();
const app = express();
const path = require("path");

const server = http.createServer(app);

// ===== Socket.IO =====
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.set("io", io);

// ===== Socket handlers (Group & Call) =====
// Group chat
io.on("connection", (socket) => {
  console.log("🔌 Group socket connected:", socket.id);

  socket.on("joinRoom", (groupId) => socket.join(groupId));
  socket.on("chatMessage", ({ groupId, message, user }) =>
    io.to(groupId).emit("chatMessage", { message, user, time: new Date() })
  );
  socket.on("disconnect", () => console.log("❌ Group socket disconnected"));
});

// Real-time call namespace
const callNamespace = io.of("/call");
callNamespace.on("connection", (socket) => {
  console.log("📞 New call socket:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("ready");
  });

  socket.on("offer", (data) => socket.to(data.room).emit("offer", data.sdp));
  socket.on("answer", (data) => socket.to(data.room).emit("answer", data.sdp));
  socket.on("ice-candidate", (data) =>
    socket.to(data.room).emit("ice-candidate", data.candidate)
  );

  socket.on("disconnect", () =>
    console.log("❌ Call socket disconnected:", socket.id)
  );
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== Routes =====
app.use("/api/help", helpAuth);
app.use("/api/volunteer", volunteerAuth);
app.use("/api/gemini", geminiRoute);
app.use("/api/users", userRoute);
app.use("/api/groups", groupRoute);
app.use("/api", contactRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai-report", aiReport);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/cases", caseRoutes);
// Make uploaded chat files accessible
app.use('/uploads/chat', express.static(path.join(__dirname, 'uploads/chat')));


const PORT = process.env.PORT || 5600;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
