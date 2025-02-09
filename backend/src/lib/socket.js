import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get userId from the handshake query
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Notify all clients about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle incoming messages
  socket.on("sendMessage", (messageData) => {
    const { receiverId, message } = messageData;
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }
  });

 // Socket.IO server example
socket.on("typing", (data) => {
  socket.to(data.to).emit("typing", socket.userId); // Emit sender's ID
});

socket.on("stopTyping", (data) => {
  socket.to(data.to).emit("stopTyping", socket.userId); // Emit sender's ID
});

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
