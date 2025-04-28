import jwt from "jsonwebtoken";
import signUp from "../models/signUp.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided. Unauthorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await signUp.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found. Unauthorized." });
    }
    next(); 
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};