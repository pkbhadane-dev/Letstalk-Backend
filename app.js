import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRouter from "./Routers/userRouter.js";
import messageRouter from "./Routers/messageRouter.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import { connectDb } from "./DB/db.js";
import { app, server } from "./Socket/socket.js";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/api", messageRouter);
app.use(errorHandler);

connectDb().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`server is running on PORT ${process.env.PORT}`);
  });
});
