import express from "express";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import {
  deleteMessage,
  getMessage,
  markAsRead,
  sendMessage,
  unreadMessageCount,
} from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send/:receiverId", isAuthenticated, sendMessage);
messageRouter.get("/getMessage/:participantId", isAuthenticated, getMessage);
messageRouter.put("/markRead/:participantId", isAuthenticated, markAsRead);
messageRouter.get("/getMessageCount", isAuthenticated, unreadMessageCount);
messageRouter.delete(
  "/deleteMessage/:messageId",
  isAuthenticated,
  deleteMessage,
);
export default messageRouter;
