import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isRead:{
      type: Boolean,
      default : false
    }
  },
  { timestamps: true }
);

// Add an index to speed up queries filtering by sender/receiver and sorting by time
// messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
