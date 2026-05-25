const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./authRoutes");
const User = require("./models/User");
const Message = require("./models/Message");
const Connection = require("./models/Connection");

router.get("/users", authMiddleware, async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("fullName username avatar skills tags bio status lastSeen points rank role privacy");
    
    
    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.fullName,
      role: u.role === "user" ? "Member" : "Admin",
      rank: u.rank || Math.floor(Math.random() * 100) + 1, 
      points: u.points || Math.floor(Math.random() * 2000), 
      tags: u.tags && u.tags.length > 0 ? u.tags : Object.keys(u.skills || {}).slice(0, 3),
      avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(u.fullName || "User").replace(/\s+/g,'')}&backgroundColor=fdfbf7`,
      status: u.status,
      lastSeen: u.lastSeen,
      bio: u.bio || "",
      privacy: u.privacy || "public"
    }));

    res.json(formattedUsers);
  } catch (err) {
    next(err);
  }
});

router.get("/leaderboard", authMiddleware, async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("fullName avatar points")
      .sort({ points: -1 })
      .limit(100);
      
    const leaderboardData = users.map((u, index) => ({
      id: u._id.toString(),
      name: u.fullName,
      avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(u.fullName || "User").replace(/\s+/g,'')}&backgroundColor=transparent`,
      points: u.points || Math.floor(Math.random() * 2000), 
      rank: index + 1,
      isYou: u._id.toString() === req.user.id,
      prize: index === 0 ? 500 : index === 1 ? 250 : index === 2 ? 100 : 0
    }));

    res.json(leaderboardData);
  } catch (err) {
    next(err);
  }
});

router.get("/chat/:userId", authMiddleware, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post("/connect/:userId", authMiddleware, async (req, res, next) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.id;

    const existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      
      await Connection.findByIdAndDelete(existing._id);
      return res.json({ connected: false, status: "removed" });
    }

    
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "User not found" });

    const isPrivate = receiver.privacy === "private";
    const status = isPrivate ? "pending" : "accepted";

    const newConn = new Connection({ sender: senderId, receiver: receiverId, status });
    await newConn.save();

    return res.json({ connected: status === "accepted", status });
  } catch (err) {
    next(err);
  }
});

router.post("/connect/:userId/accept", authMiddleware, async (req, res, next) => {
  try {
    const senderId = req.params.userId;
    const receiverId = req.user.id;

    const conn = await Connection.findOne({ sender: senderId, receiver: receiverId, status: "pending" });
    if (!conn) return res.status(404).json({ error: "Request not found" });

    conn.status = "accepted";
    await conn.save();

    res.json({ success: true, status: "accepted" });
  } catch (err) {
    next(err);
  }
});

router.post("/connect/:userId/reject", authMiddleware, async (req, res, next) => {
  try {
    const senderId = req.params.userId;
    const receiverId = req.user.id;

    const conn = await Connection.findOne({ sender: senderId, receiver: receiverId, status: "pending" });
    if (!conn) return res.status(404).json({ error: "Request not found" });

    await Connection.findByIdAndDelete(conn._id);

    res.json({ success: true, status: "rejected" });
  } catch (err) {
    next(err);
  }
});

router.get("/connections/pending", authMiddleware, async (req, res, next) => {
  try {
    const pending = await Connection.find({ receiver: req.user.id, status: "pending" }).populate("sender", "fullName avatar role");
    
    const formatted = pending.map(p => ({
      connectionId: p._id.toString(),
      senderId: p.sender._id.toString(),
      name: p.sender.fullName,
      avatar: p.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(p.sender.fullName || "User").replace(/\s+/g,'')}&backgroundColor=fdfbf7`,
      role: p.sender.role === "user" ? "Member" : "Admin"
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

router.get("/connections", authMiddleware, async (req, res, next) => {
  try {
    const conns = await Connection.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      status: "accepted"
    });

    const connectedUserIds = conns.map(c => 
      c.sender.toString() === req.user.id ? c.receiver.toString() : c.sender.toString()
    );

    res.json(connectedUserIds);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
