import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

// Show login page
const login = async (req, res) => {
  res.render("auth/login");
};

// Validate login
const validateUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.redirect("/auth/login");
  }
};

// Show register page
const register = async (req, res) => {
  res.render("auth/register");
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.redirect("/auth/login");
};

// Signup API
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({ message: "User Created" });
};

// Logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

export { login, validateUser, register, registerUser, signup, logout };