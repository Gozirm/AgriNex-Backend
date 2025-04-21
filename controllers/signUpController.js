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
