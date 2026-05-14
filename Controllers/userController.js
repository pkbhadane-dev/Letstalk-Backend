import { validateResult } from "../Middlewares/validateResult.js";
import User from "../Models/userModel.js";
import { check } from "express-validator";
import bcrypt from "bcryptjs";
import { jwtToken } from "../Utilities/handleJsonWebToken.js";
import customErrorHandler from "../Utilities/handleCustomError.js";
import cloudinary from "../Utilities/handleCloudinary.js";
import streamifier from "streamifier";
import { json } from "express";

export const getLogin = (req, res, next) => {
  res.send("Connected to server");
};

export const postSignup = [
  check("firstname")
    .notEmpty()
    .withMessage("firstname is required")
    .bail()
    .trim()
    .isLength({ min: 2 })
    .withMessage("firstname atleast 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("firstname should contain only alphabets"),

  check("lastname")
    .notEmpty()
    .withMessage("lastname is required")
    .bail()
    .trim()
    .isLength({ min: 2 })
    .withMessage("lastname atleast 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("lastname should contain only alphabets"),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("please enter a valid email")
    .normalizeEmail(),

  check("gender").notEmpty().withMessage("please select gender"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 character long")
    .matches(/[!@#$%&*]/)
    .withMessage("password must contain a special character")
    .matches(/[A-Z]/)
    .withMessage("password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("password must contain a lowercase letter"),

  validateResult,

  async (req, res, next) => {
    try {
      const { firstname, lastname, email, gender, password } = req.body;

      const user = await User.findOne({ email });
      if (user) {
        return next(
          new customErrorHandler("Signup fail", "User already exist"),
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstname,
        lastname,
        email,
        gender,
        password: hashedPassword,
      });
      await newUser.save();

      const filterUser = newUser.toObject();
      delete filterUser.password;

      const token = jwtToken(newUser);

      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: 1000 * 60 * 60 * 24 * 2,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        })
        .json({
          status: 200,
          message: "user created successfully",
          responseData: { filterUser, token },
        });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
];

export const postLogin = [
  check("email").notEmpty().withMessage("email is required"),

  check("password").notEmpty().withMessage("password is required"),

  validateResult,

  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(
          new customErrorHandler(
            "Login fail",
            "Please enter valid email and password",
          ),
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(
          new customErrorHandler(
            "Login fail",
            "Please enter valid email and password",
          ),
        );
      }

      const userData = user.toObject();
      delete userData.password;

      const token = jwtToken(user);

      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: 1000 * 60 * 60 * 24 * 2,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        })
        .json({
          message: "Login Successfull",
          responseData: { user: userData, token },
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const profile = await User.findById(userId);

    res.status(200).json({
      success: true,
      responseData: profile,
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const postLogout = (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        partitioned: true,
        path: "/"
      })
      .json({
        message: "Logout successfull",
        status: 200,
      });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

export const otherUsers = async (req, res, next) => {
  try {
    const myId = req.user.userId;

    const allUsers = await User.find({ _id: { $ne: myId } }).select(
      "-password",
    );

    res.status(200).json({
      success: true,
      responseData: allUsers,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

export const uploadProfilePic = async (req, res, next) => {
  try {
    const myId = req.user.userId;
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles", upload_preset: "optimized_image" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);

    const user = await User.findByIdAndUpdate(
      myId,
      { profilePic: result.secure_url },
      { new: true },
    );

    await user.save();

    res.json({
      message: "susscefully update",
      responseData: user,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

export const setUserAbout = async (req, res, next) => {
  try {
    const myId = req.user.userId;

    const { about } = req.body;

    const user = await User.findByIdAndUpdate(
      myId,
      { about: about },
      { new: true },
    );
    user.save();

    res.json({
      message: "update successfull",
      responseData: user.about,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
