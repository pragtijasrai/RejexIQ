/**
 * RejexIQ — Socket.IO Server
 * Handles: realtime chat, typing, rooms, notifications, presence, coding sessions
 */
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rejexiq_dev_secret_2025";

// In-memory stores
const onlineUsers   = new Map(); // socketId → { userId, name, email, avatar }
const rooms         = new Map(); // roomId  → Set<socketId>
const typingUsers   = new Map(); // roomId  → Set<userId>
const notifications = new Map(); // userId  → []
const chatHistory   = new Map(); // roomId  → []

function initSocket(httpServer, clientUrl) {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl || "http://localhost:5173", credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── Auth middleware ──────────────────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        socket.user = jwt.verify(token, JWT_SECRET);
      } catch {
        socket.user = null;
      }
    }
    // Allow unauthenticated connections (guest mode)
    if (!socket.user) {
      socket.user = {
        id: "guest_" + socket.id.slice(0, 8),
        name: socket.handshake.auth?.name || "Guest",
        email: socket.handshake.auth?.email || "",
        avatar: socket.handshake.auth?.avatar || "",
      };
    }
    next();
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`[Socket] Connected: ${user.name} (${socket.id})`);

    // Register online presence
    onlineUsers.set(socket.id, { ...user, socketId: socket.id, connectedAt: Date.now() });
    io.emit("online-users", Array.from(onlineUsers.values()));

    // ── JOIN ROOM ──────────────────────────────────────────────────────────────
    socket.on("join-room", ({ roomId, roomType }) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(socket.id);

      const history = chatHistory.get(roomId) || [];
      socket.emit("room-history", { roomId, messages: history.slice(-50) });

      socket.to(roomId).emit("user-joined", {
        user: { id: user.id, name: user.name, avatar: user.avatar },
        roomId, roomType,
        participants: rooms.get(roomId).size,
      });

      console.log(`[Socket] ${user.name} joined room: ${roomId}`);
    });

    // ── LEAVE ROOM ─────────────────────────────────────────────────────────────
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) rooms.delete(roomId);
      }
      socket.to(roomId).emit("user-left", {
        user: { id: user.id, name: user.name },
        roomId,
        participants: rooms.get(roomId)?.size || 0,
      });
    });

    // ── SEND MESSAGE ───────────────────────────────────────────────────────────
    socket.on("send-message", ({ roomId, message, type = "text" }) => {
      const msg = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        roomId,
        type,
        text: message,
        sender: { id: user.id, name: user.name, avatar: user.avatar },
        timestamp: new Date().toISOString(),
      };

      // Persist in memory
      if (!chatHistory.has(roomId)) chatHistory.set(roomId, []);
      chatHistory.get(roomId).push(msg);
      if (chatHistory.get(roomId).length > 200) chatHistory.get(roomId).shift();

      io.to(roomId).emit("receive-message", msg);
    });

    // ── TYPING ─────────────────────────────────────────────────────────────────
    socket.on("typing", ({ roomId }) => {
      if (!typingUsers.has(roomId)) typingUsers.set(roomId, new Set());
      typingUsers.get(roomId).add(user.name);
      socket.to(roomId).emit("typing-update", {
        roomId,
        users: Array.from(typingUsers.get(roomId)),
      });
    });

    socket.on("stop-typing", ({ roomId }) => {
      if (typingUsers.has(roomId)) {
        typingUsers.get(roomId).delete(user.name);
        socket.to(roomId).emit("typing-update", {
          roomId,
          users: Array.from(typingUsers.get(roomId)),
        });
      }
    });

    // ── CODE CHANGE (collaborative coding) ────────────────────────────────────
    socket.on("code-change", ({ roomId, code, language, cursorPos }) => {
      socket.to(roomId).emit("code-update", {
        code, language, cursorPos,
        editor: { id: user.id, name: user.name },
        timestamp: Date.now(),
      });
    });

    // ── AI STREAM (relay Gemini chunks to room) ────────────────────────────────
    socket.on("ai-stream-chunk", ({ roomId, chunk, done }) => {
      io.to(roomId).emit("ai-response-chunk", { chunk, done, timestamp: Date.now() });
    });

    // ── RESUME ANALYSIS PROGRESS ───────────────────────────────────────────────
    socket.on("resume-analysis-start", ({ fileName }) => {
      const steps = [
        { step: "Parsing document...",        pct: 15 },
        { step: "Extracting skills...",        pct: 30 },
        { step: "Analyzing experience...",     pct: 50 },
        { step: "Checking ATS compatibility...",pct: 65 },
        { step: "Scoring keywords...",         pct: 80 },
        { step: "Generating recommendations...",pct: 95 },
        { step: "Analysis complete!",          pct: 100 },
      ];
      let i = 0;
      const iv = setInterval(() => {
        if (i >= steps.length) { clearInterval(iv); return; }
        socket.emit("resume-progress", { ...steps[i], fileName });
        i++;
      }, 600);
    });

    // ── INTERVIEW EVENT ────────────────────────────────────────────────────────
    socket.on("interview-event", ({ roomId, event, data }) => {
      io.to(roomId).emit("interview-update", {
        event, data,
        from: { id: user.id, name: user.name },
        timestamp: Date.now(),
      });
    });

    // ── NOTIFICATION ───────────────────────────────────────────────────────────
    socket.on("send-notification", ({ targetUserId, notification }) => {
      // Find target socket
      for (const [sid, u] of onlineUsers) {
        if (u.id === targetUserId) {
          io.to(sid).emit("notification", {
            ...notification,
            id: Date.now(),
            read: false,
            timestamp: new Date().toISOString(),
          });
          break;
        }
      }
    });

    // ── DASHBOARD SYNC ─────────────────────────────────────────────────────────
    socket.on("dashboard-update", ({ type, data }) => {
      socket.broadcast.emit("dashboard-sync", { type, data, from: user.id });
    });

    // ── DISCONNECT ─────────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("online-users", Array.from(onlineUsers.values()));

      // Clean up typing
      for (const [roomId, users] of typingUsers) {
        users.delete(user.name);
        io.to(roomId).emit("typing-update", { roomId, users: Array.from(users) });
      }

      // Clean up rooms
      for (const [roomId, sockets] of rooms) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          socket.to(roomId).emit("user-left", {
            user: { id: user.id, name: user.name },
            roomId,
            participants: sockets.size,
          });
        }
      }

      console.log(`[Socket] Disconnected: ${user.name} (${socket.id})`);
    });
  });

  return io;
}

module.exports = { initSocket };
