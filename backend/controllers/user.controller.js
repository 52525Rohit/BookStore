import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCredentials = (
  { fullname, email, password },
  requireFullname,
) => {
  if (requireFullname && !fullname) return "Fullname is required";
  if (!email || !EMAIL_RE.test(email)) return "A valid email is required";
  if (!password || password.length < 6)
    return "Password must be at least 6 characters";
  return null;
};

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const validationError = validateCredentials(
      { fullname, email, password },
      true,
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    // Create a new user
    const createdUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    await createdUser.save();
    res.status(201).json({
      message: "User created successfully",
      token: signToken(createdUser),
      user: {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials({ email, password }, false);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const user = await User.findOne({ email });
    const isMatch = user && (await bcryptjs.compare(password, user.password));
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    } else {
      res.status(200).json({
        message: "Login successful",
        token: signToken(user),
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
