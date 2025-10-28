const express = require("express");
const router = express.Router();
const User = require("../models/HelpUser");
const Volunteer = require("../models/Volunteer");
const Case = require("../models/Case");

// Hardcoded admin credentials
const ADMIN_USERS = [
  { email: "ayushadmin@gmail.com", password: "ayushadmin", name: "Ayush Admin" },
  { email: "garimaadmin@gmail.com", password: "garimaadmin", name: "Garima Admin" }
];

// ==================== AUTHENTICATION ====================

// Admin login (no registration allowed)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = ADMIN_USERS.find(
      a => a.email === email && a.password === password
    );
    
    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // Create a simple token
    const token = Buffer.from(`${email}:${password}`).toString('base64');
    
    res.json({ 
      token, 
      admin: { 
        email: admin.email, 
        name: admin.name,
        role: "admin"
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify admin token
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');
    
    const admin = ADMIN_USERS.find(
      a => a.email === email && a.password === password
    );
    
    if (!admin) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({ 
      admin: { 
        email: admin.email, 
        name: admin.name,
        role: "admin"
      } 
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ==================== DASHBOARD STATS ====================

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();
    const totalCases = await Case.countDocuments();
    const activeCases = await Case.countDocuments({ status: "Active" });
    const completedCases = await Case.countDocuments({ status: "Completed" });
    
    // Recent activity (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: lastWeek } });
    const newVolunteersThisWeek = await Volunteer.countDocuments({ createdAt: { $gte: lastWeek } });

    res.json({
      totalUsers,
      totalVolunteers,
      totalCases,
      activeCases,
      completedCases,
      newUsersThisWeek,
      newVolunteersThisWeek
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete associated cases
    await Case.deleteMany({ userId: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VOLUNTEER MANAGEMENT ====================

// Get all volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().select("-password").sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete volunteer
router.delete("/volunteers/:id", async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    // Also delete associated cases
    await Case.deleteMany({ volunteerId: req.params.id });
    res.json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CASE MANAGEMENT ====================

// Get all cases
router.get("/cases", async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("userId", "name email")
      .populate("volunteerId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign case (create new case assignment)
router.post("/cases/assign", async (req, res) => {
  try {
    const { userId, volunteerId, issue, severity } = req.body;
    
    const user = await User.findById(userId);
    const volunteer = await Volunteer.findById(volunteerId);
    
    if (!user || !volunteer) {
      return res.status(404).json({ error: "User or volunteer not found" });
    }

    const newCase = await Case.create({
      userId,
      volunteerId,
      userName: user.name,
      userEmail: user.email,
      userAge: user.age,
      userGender: user.gender,
      userContact: user.mobile,
      issue,
      severity,
      status: "Pending",
      progress: "Case assigned, awaiting initial contact"
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete case
router.delete("/cases/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
