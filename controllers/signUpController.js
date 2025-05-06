import axios from "axios";
import jwt from "jsonwebtoken";
import SignUp from "../models/signUp.js";

export const signUpController = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingEmail = await SignUp.findOne({ email });
  if (existingEmail) {
    return res
      .status(400)
      .json({ success: false, errMsg: "Email already exists" });
  }

  try {
    const newUser = new SignUp({ email, password, username });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token and get user info
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email, name, email_verified, picture } = response.data;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    // Check if the user already exists
    let user = await SignUp.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = new SignUp({
        email,
        username: name,
        profilePicture: picture,
        password: "", // No password for Google sign-in
      });
      await user.save();
    }else {
      // Update the profile picture if it has changed
      if (user.profilePicture !== picture) {
        user.profilePicture = picture;
        await user.save();
      }
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username, 
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

