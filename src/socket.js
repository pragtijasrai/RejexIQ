/**
 * RejexIQ — Socket.IO Client Service
 * Singleton socket connection with auth support
 */
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket = null;

export function getSocket() {
  return socket;
}

export function connectSocket(user) {
  if (socket?.connected) return socket;

  const token = localStorage.getItem("rejexiq_token") || "";

  socket = io(SOCKET_URL, {
    auth: {
      token,
      name:   user?.name   || "Guest",
      email:  user?.email  || "",
      avatar: user?.avatar || "",
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket.id);
  });
  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });
  socket.on("connect_error", (err) => {
    console.warn("[Socket] Connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function joinRoom(roomId, roomType = "chat") {
  socket?.emit("join-room", { roomId, roomType });
}

export function leaveRoom(roomId) {
  socket?.emit("leave-room", { roomId });
}

export function sendMessage(roomId, message, type = "text") {
  socket?.emit("send-message", { roomId, message, type });
}

export function emitTyping(roomId) {
  socket?.emit("typing", { roomId });
}

export function emitStopTyping(roomId) {
  socket?.emit("stop-typing", { roomId });
}

export function emitCodeChange(roomId, code, language, cursorPos) {
  socket?.emit("code-change", { roomId, code, language, cursorPos });
}

export function emitInterviewEvent(roomId, event, data) {
  socket?.emit("interview-event", { roomId, event, data });
}

export function startResumeAnalysis(fileName) {
  socket?.emit("resume-analysis-start", { fileName });
}

export function emitAIChunk(roomId, chunk, done = false) {
  socket?.emit("ai-stream-chunk", { roomId, chunk, done });
}
