import { ObjectId } from "bson";
import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";
import customErrorHandler from "../Utilities/handleCustomError.js";
import mongoose, { Mongoose } from "mongoose";
import { getSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;
    const message = req.body.message;

    if (!senderId || !receiverId || !message) {
      return next(
        new customErrorHandler("send message fail", "all fields are required")
      );
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, receiverId] });
      await conversation.save();
    }

    const newMessage = new Message({ message, senderId, receiverId });
    await newMessage.save();

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const unreadCount = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(receiverId),
          isRead: false,
        },
      },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    const socketId = getSocketId(receiverId);

    io.to(socketId).emit("newMessage", newMessage);
    io.to(socketId).emit("unreadMsgCount", unreadCount);

    res.status(200).json({
      success: true,
      responseData: newMessage,
      conversation,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const myId = req.user.userId;
    const participantId = req.params.participantId;

    if (!myId || !participantId) {
      return next(
        new customErrorHandler("get message fail", "all fields are required")
      );
    }

    // // Fetch messages directly from Message collection for better performance
    // // and to allow proper indexing / sorting instead of populating a potentially
    // // very large conversation document.
    // const messages = await Message.find({
    //   $or: [
    //     { senderId: myId, receiverId: participantId },
    //     { senderId: participantId, receiverId: myId },
    //   ],
    // }).sort({ createdAt: 1 });

    // res.status(200).json({
    //   success: true,
    //   responseData: { messages },
    // });

    const getMessages = await Conversation.findOne({
      participants: { $all: [myId, participantId] },
    }).populate("messages");

    res.status(200).json({
      success: true,
      responseData: getMessages,
    });
  } catch (error) {
    console.error(error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const myId = new ObjectId(req.user.userId);
    const participantId = new ObjectId(req.params.participantId);

    if (!myId && !participantId) {
      return next(
        new customErrorHandler(
          "update fail",
          "myId and participantId not found"
        )
      );
    }

    await Message.updateMany(
      {
        senderId: participantId,
        receiverId: myId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    const updatedCount = await Message.aggregate([
      { $match: { receiverId: myId, isRead: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);
    

    const socketId = getSocketId(myId);
    io.to(socketId).emit("unreadMsgCount", updatedCount);

    res.status(200).json({
      success: true,
      message: "mark as read",
      responseData: updatedCount,
    });
  } catch (error) {
    console.log(error);
  }
};

export const unreadMessageCount = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.userId);

    const messageCount = await Message.aggregate([
      {
        $match: { receiverId: currentUserId, isRead: false },
      },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    // const userId = getSocketId(req.user.userId);

    // io.emit("unreadMsgCount", messageCount);

    res.status(200).json({
      success: true,
      responseData: messageCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
