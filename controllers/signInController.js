import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SignUp from "../models/signUp.js";

export const signInController = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
  
    try {
      const user = await SignUp.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email." });
      }
  
      console.log("Plain password:", password);
      console.log("Hashed password from DB:", user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: `Sign-in successful. Welcome, ${user.username}!`,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  };