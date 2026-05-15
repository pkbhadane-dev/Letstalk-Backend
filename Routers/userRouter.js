import express from "express";
import {
  otherUsers,
  getLogin,
  getProfile,
  postLogin,
  postLogout,
  postSignup,
  uploadProfilePic,
  setUserAbout,
} from "../Controllers/userController.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import upload from "../Middlewares/multer.js";
const userRouter = express.Router();

userRouter.get("/login", getLogin);
userRouter.post("/login", postLogin);
userRouter.post("/signup", postSignup);
userRouter.post("/logout", postLogout);
userRouter.post("/uploadProfilePic", upload.single("image"), isAuthenticated, uploadProfilePic)
userRouter.post("/setAbout", isAuthenticated, setUserAbout)
userRouter.get("/getprofile", isAuthenticated, getProfile);
userRouter.get("/otherUsers", isAuthenticated, otherUsers);

export default userRouter;
