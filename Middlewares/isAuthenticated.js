import customErrorHandler from "../Utilities/handleCustomError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new customErrorHandler("Authentication fail", "token not found")
    );
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = tokenData;
    next(); 
  } catch (error) {
    console.error(error.message);
    return next(
      new customErrorHandler("Authentication fail", "Invalid or expired token")
    );
  }
};
