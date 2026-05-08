import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUser = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Token not provided"));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRETKEY);
    socket.userId = decode.userId;
    next();
  } catch (error) {
    return next(new Error("Invalid Token"));
  }
});

io.on("connection", (socket) => {

  const userId = socket.userId;
 
  onlineUser.set(userId, socket.id);

  io.emit("onlineUser", Array.from(onlineUser.keys()));
  socket.on("typing", ({ receiver, sender }) => {
    const receiverSocket = onlineUser.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", userId);
    }
  });

  socket.on("stopTyping", ({ receiver, sender }) => {
    const receiverSocket = onlineUser.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("stopTyping", userId);
    }
  });

  socket.on("disconnect", () => {
    onlineUser.delete(userId);
    io.emit("onlineUser", Array.from(onlineUser.keys()));
  });
});

export const getSocketId = (userId) => {
  return onlineUser.get(userId);
};
export { app, server, io };
