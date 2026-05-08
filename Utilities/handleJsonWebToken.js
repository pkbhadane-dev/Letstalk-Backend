import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const jwtToken = (User) => {
  const paylod = { userId: User?._id };
  const secretKey = process.env.JWT_SECRETKEY;
  const expiresIn = process.env.JWT_EXPIRES;

  return jwt.sign(paylod, secretKey, { expiresIn });
};
