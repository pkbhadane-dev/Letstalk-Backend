import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    console.log("connected to mongoDb");
    await mongoose.connect(process.env.MONGODB_PATH);
  } catch (error) {
    console.log("error during connection to mongoose", error.message);
  }
};
