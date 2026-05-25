const socketIo = require("socket.io");
const User = require("./models/User");
const Message = require("./models/Message");

const activeUsers = new Map();

function initSocket(server, corsOptions) {
  const io = socketIo(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    
    socket.on("join", async (userId) => {
      if (!userId) return;
      activeUsers.set(userId, socket.id);
      socket.userId = userId;

      try {
        await User.findByIdAndUpdate(userId, { status: "online" });
        io.emit("userStatusChange", { userId, status: "online" });
      } catch (err) {}
    });

    
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId });
      }
    });

    
    socket.on("connectionRequest", (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newConnectionRequest", { senderId });
      }
    });

    
    socket.on("connectionAccepted", (data) => {
      const { senderId, receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("connectionAccepted", { senderId });
      }
    });

    
    socket.on("profileUpdated", (data) => {
      const { userId } = data;
      
      socket.broadcast.emit("userProfileUpdated", { userId });
    });

    
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, text, isFile, fileUrl } = data;
      
      try {
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          text: text || "",
          fileUrl: isFile ? fileUrl : "",
        });
        await newMessage.save();

        const msgPayload = {
          _id: newMessage._id,
          senderId,
          receiverId,
          text,
          isFile,
          fileUrl,
          createdAt: newMessage.createdAt,
        };

        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", msgPayload);
        }
        
        
        socket.emit("messageSent", msgPayload);

      } catch (err) {
        console.error("Socket Send Message Error:", err);
      }
    });

    
    socket.on("disconnect", async () => {
      console.log("🔴 Client disconnected:", socket.id);
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        try {
          await User.findByIdAndUpdate(socket.userId, { 
            status: "offline", 
            lastSeen: new Date() 
          });
          io.emit("userStatusChange", { userId: socket.userId, status: "offline", lastSeen: new Date() });
        } catch (err) {}
      }
    });
  });

  return io;
}

module.exports = { initSocket };
